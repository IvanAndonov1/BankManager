import { X, Download } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";

import {
	getAnalyticsOverview,
	getLoansDisbursedDaily,
	getLoanDecisionsDaily,
	getTopDeclines,
	getCashflowDaily,
} from "../../../../services/analyticsService";

import { downloadAnalyticsPdf } from "../../../../utils/analyticsPdf";
import { getAIApplicationForecast } from "../../../../services/adminService";

const fmt = (v) =>
	typeof v === "number"
		? v.toLocaleString("en-US", { maximumFractionDigits: 2 })
		: v ?? "—";
const pct = (v) => (typeof v === "number" ? `${(v * 100).toFixed(1)}%` : "—");

export default function AnalyticsModal({ isOpen, onClose }) {
	const { user } = useContext(AuthContext);

	const [overview, setOverview] = useState(null);
	const [disbursedDaily, setDisbursedDaily] = useState([]);
	const [decisionsDaily, setDecisionsDaily] = useState([]);
	const [declinesTop, setDeclinesTop] = useState([]);
	const [cashflowDaily, setCashflowDaily] = useState([]);
	const [aiGeneratedData, setAIGeneratedData] = useState({});

	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	const tabs = useMemo(
		() => [
			{ key: "overview", label: "Overview" },
			{ key: "disbursed", label: "Loans Disbursed (Daily)" },
			{ key: "decisions", label: "Loan Decisions (Daily)" },
			{ key: "declines", label: "Top Declines" },
			{ key: "cashflow", label: "Cashflow (Daily)" },
		],
		[]
	);

	console.log(overview);


	useEffect(() => {
		if (!isOpen || !user?.token) return;

		const fetchData = async () => {
			setLoading(true);
			try {
				const [ov, disb, decis, decl, cash, aiData] = await Promise.all([
					getAnalyticsOverview(user.token),
					getLoansDisbursedDaily(user.token),
					getLoanDecisionsDaily(user.token),
					getTopDeclines(user.token),
					getCashflowDaily(user.token),
					getAIApplicationForecast(user.token)
				]);

				setOverview(ov);
				setDisbursedDaily(disb);
				setDecisionsDaily(decis);
				setDeclinesTop(decl);
				setCashflowDaily(cash);
				setAIGeneratedData(aiData);
			} catch (err) {
				console.error("Error loading analytics:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [isOpen, user?.token]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">Staff Analytics</h2>
					<div className="flex items-center gap-2">
						<button
							onClick={() =>
								downloadAnalyticsPdf(activeTab, {
									overview,
									disbursedDaily,
									decisionsDaily,
									declinesTop,
									cashflowDaily,
								})
							}
							className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							<Download size={16} /> Download
						</button>
						<button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
							<X size={20} />
						</button>
					</div>
				</div>

				<div className="flex border-b">
					{tabs.map((t) => (
						<button
							key={t.key}
							onClick={() => setActiveTab(t.key)}
							className={`px-4 py-2 text-sm font-medium ${activeTab === t.key
								? "border-b-2 border-blue-600 text-blue-600"
								: "text-gray-600 hover:text-gray-800"
								}`}
						>
							{t.label}
						</button>
					))}
				</div>

				<div className="p-6 space-y-6">
					{loading && (
						<div className="text-center text-gray-500">Loading...</div>
					)}

					{!loading && activeTab === "overview" && overview && (
						<OverviewTab ov={overview} aiText={aiGeneratedData?.analysis} />
					)}

					{!loading && activeTab === "disbursed" && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Daily Disbursement</h3>
							<Table
								headers={["day", "disbursedCount", "disbursedAmount"]}
								rows={disbursedDaily}
							/>
						</div>
					)}

					{!loading && activeTab === "decisions" && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Loan Decisions (Daily)</h3>
							<Table
								headers={["day", "created", "approved", "declined"]}
								rows={decisionsDaily}
							/>
						</div>
					)}

					{!loading && activeTab === "declines" && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Top Declines</h3>
							<Table headers={["key", "count"]} rows={declinesTop} />
						</div>
					)}

					{!loading && activeTab === "cashflow" && (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Daily Cashflow</h3>
							<Table
								headers={["day", "inflow", "outflow", "net"]}
								rows={cashflowDaily}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function OverviewTab({ ov, aiText }) {
	return (
		<div className="space-y-6">
			<div className="text-sm text-gray-500">
				Period:{" "}
				<span className="font-medium text-gray-700">{ov?.period?.from}</span> →{" "}
				<span className="font-medium text-gray-700">{ov?.period?.to}</span>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				<KpiCard title="AUM" value={fmt(ov.aum)} />
				<KpiCard title="Inflow" value={fmt(ov.inflow)} />
				<KpiCard title="Outflow" value={fmt(ov.outflow)} />
				<KpiCard title="Net Flow" value={fmt(ov.netFlow)} />
				<KpiCard title="New Accounts" value={fmt(ov.newAccounts)} />
				<KpiCard title="Active Customers" value={fmt(ov.activeCustomers)} />
			</div>

			<Section title="Loans">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<KpiCard title="Pending" value={fmt(ov.loans?.pending)} />
					<KpiCard title="Approved" value={fmt(ov.loans?.approved)} />
					<KpiCard title="Declined" value={fmt(ov.loans?.declined)} />
					<KpiCard title="Approval Rate" value={`${ov.loans?.approvalRate}%`} />
					<KpiCard title="Disbursed Amount" value={fmt(ov.loans?.disbursedAmount)} />
					<KpiCard title="Avg Ticket" value={fmt(ov.loans?.avgTicket)} />
					<KpiCard title="Open Pending Now" value={fmt(ov.loans?.openPendingNow)} />
				</div>
			</Section>

			<Section title="Risk Proxy">
				<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
					<KpiCard title="Late Payers 30d Share" value={pct(ov.riskProxy?.latePayers30dShare)} />
					<KpiCard title="Late Payers 90d Share" value={pct(ov.riskProxy?.latePayers90dShare)} />
				</div>
			</Section>

			{aiText && (
				<div className="mt-6 p-4 rounded-lg shadow relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-300 opacity-90 rounded-lg" />
					<div className="relative text-white">
						<div className="flex items-center gap-2 text-sm font-semibold">
							<span className="px-2 py-0.5 rounded bg-white/20 text-white uppercase tracking-wide">
								AI
							</span>
							<span>Forecast Summary</span>
						</div>
						<p className="mt-2 leading-relaxed whitespace-pre-line">
							{aiText}
						</p>
						<p className="mt-2 text-xs text-white/70">
							Generated automatically by the AI model based on system data.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

function KpiCard({ title, value }) {
	return (
		<div className="p-4 bg-gray-50 rounded-lg shadow">
			<h4 className="text-sm text-gray-500">{title}</h4>
			<div className="text-xl font-semibold mt-1">{value}</div>
		</div>
	);
}

function Section({ title, children }) {
	return (
		<div>
			<h3 className="text-lg font-semibold mb-3">{title}</h3>
			{children}
		</div>
	);
}

function Table({ headers = [], rows = [] }) {
	return (
		<div className="overflow-x-auto border rounded-lg">
			<table className="w-full text-sm">
				<thead className="bg-gray-100">
					<tr>
						{headers.map((h) => (
							<th key={h} className="px-4 py-2 border text-left capitalize">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.isArray(rows) && rows.length ? (
						rows.map((r, i) => (
							<tr key={i} className="odd:bg-white even:bg-gray-50">
								{headers.map((h) => (
									<td key={h} className="px-4 py-2 border">
										{fmt(r?.[h])}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td
								className="px-4 py-6 text-center text-gray-500"
								colSpan={headers.length}
							>
								No data
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}