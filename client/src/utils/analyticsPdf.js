import jsPDF from "jspdf";
import autoTable from "jspdf";

const fmt = (v) =>
	typeof v === "number"
		? v.toLocaleString("en-US", { maximumFractionDigits: 2 })
		: v ?? "—";
const pct = (v) =>
	typeof v === "number" ? `${(v * 100).toFixed(1)}%` : "—";

export function downloadAnalyticsPdf(activeTab, { overview, disbursedDaily, decisionsDaily, declinesTop, cashflowDaily }) {
	const doc = new jsPDF();
	const now = new Date().toLocaleString();

	doc.setFontSize(16);
	doc.text("Staff Analytics", 14, 16);
	doc.setFontSize(10);
	doc.text(`Generated: ${now}`, 14, 22);
	doc.line(14, 24, 196, 24);

	const addTable = (head, body) => {
		autoTable(doc, {
			head: [head],
			body,
			startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 30,
		});
	};

	switch (activeTab) {
		case "overview": {
			if (!overview) break;
			let y = 30;
			const line = (label, value) => {
				doc.text(`${label}: ${value ?? "—"}`, 14, y);
				y += 7;
			};

			line("Period From", overview?.period?.from);
			line("Period To", overview?.period?.to);
			y += 5;

			doc.setFont(undefined, "bold");
			doc.text("KPIs", 14, y);
			doc.setFont(undefined, "normal");
			y += 7;
			line("AUM", fmt(overview.aum));
			line("Inflow", fmt(overview.inflow));
			line("Outflow", fmt(overview.outflow));
			line("Net Flow", fmt(overview.netFlow));
			line("New Accounts", fmt(overview.newAccounts));
			line("Active Customers", fmt(overview.activeCustomers));
			y += 5;

			doc.setFont(undefined, "bold");
			doc.text("Loans", 14, y);
			doc.setFont(undefined, "normal");
			y += 7;
			line("Pending", fmt(overview.loans?.pending));
			line("Approved", fmt(overview.loans?.approved));
			line("Declined", fmt(overview.loans?.declined));
			line("Approval Rate", pct(overview.loans?.approvalRate));
			line("Disbursed Amount", fmt(overview.loans?.disbursedAmount));
			line("Avg Ticket", fmt(overview.loans?.avgTicket));
			line("Open Pending Now", fmt(overview.loans?.openPendingNow));
			y += 5;

			doc.setFont(undefined, "bold");
			doc.text("Risk Proxy", 14, y);
			doc.setFont(undefined, "normal");
			y += 7;
			line("Late Payers 30d Share", pct(overview.riskProxy?.latePayers30dShare));
			line("Late Payers 90d Share", pct(overview.riskProxy?.latePayers90dShare));
			break;
		}
		case "disbursed":
			addTable(
				["day", "disbursedCount", "disbursedAmount"],
				(disbursedDaily || []).map((r) => [r?.day, fmt(r?.disbursedCount), fmt(r?.disbursedAmount)])
			);
			break;
		case "decisions":
			addTable(
				["day", "created", "approved", "declined"],
				(decisionsDaily || []).map((r) => [r?.day, fmt(r?.created), fmt(r?.approved), fmt(r?.declined)])
			);
			break;
		case "declines":
			addTable(
				["key", "count"],
				(declinesTop || []).map((r) => [r?.key, fmt(r?.count)])
			);
			break;
		case "cashflow":
			addTable(
				["day", "inflow", "outflow", "net"],
				(cashflowDaily || []).map((r) => [r?.day, fmt(r?.inflow), fmt(r?.outflow), fmt(r?.net)])
			);
			break;
		default:
			break;
	}

	doc.save("analytics-report.pdf");
}