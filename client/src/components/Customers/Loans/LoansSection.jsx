export default function LoansSection({ summary, loading, status }) {
	const dash = "—";

	const fmtMoneyEU = (n, cur = "EUR") => {
		if (n === 0) return `0,00 ${cur}`;
		const num = typeof n === "string" ? Number(n) : n;
		if (typeof num !== "number" || Number.isNaN(num)) return dash;
		return `${num.toLocaleString("bg-BG", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})} ${cur}`;
	};

	const fmtDateEU = (d) => {
		if (!d) return dash;
		const dt = d instanceof Date ? d : new Date(d);
		return Number.isNaN(dt.getTime()) ? dash : dt.toLocaleDateString("bg-BG");
	};

	const currency = summary?.currency || "EUR";
	const productName = (!loading && summary?.productName) || dash;
	const contractPart = (!loading && summary?.contractNo) ? `No DG ${summary.contractNo}` : dash;
	const creditAmount = (!loading && summary?.creditAmount != null) ?
		fmtMoneyEU(summary.creditAmount, currency) : dash;

	let remainingAmount, nextPaymentAmount, nextPaymentDate;

	if (status === "APPROVED") {
		remainingAmount = (!loading && summary?.remainingAmount != null) ?
			fmtMoneyEU(summary.remainingAmount, currency) : dash;

		nextPaymentAmount = (!loading && summary?.nextPaymentAmount != null) ?
			fmtMoneyEU(summary.nextPaymentAmount, currency) : dash;

		nextPaymentDate = (!loading && summary?.nextPaymentDate) ?
			fmtDateEU(summary.nextPaymentDate) : dash;
	} else if (status === "PENDING") {
		remainingAmount = "Pending approval";
		nextPaymentAmount = "—";
		nextPaymentDate = "—";
	} else if (status === "DECLINED") {
		remainingAmount = "Application declined";
		nextPaymentAmount = "—";
		nextPaymentDate = "—";
	}

	const renderRightSection = () => {
		if (status === "APPROVED") {
			return (
				<div className="text-right border-l-2 border-gray-300 pl-6">
					<p className="text-sm text-black font-semibold text-left">Next Payment</p>
					<p className="text-sm text-gray-500 font-medium text-left">{nextPaymentDate}</p>
					<p className="text-2xl text-gray-600 font-semibold mt-2">{nextPaymentAmount}</p>
				</div>
			);
		} else if (status === "PENDING") {
			return (
				<div className="text-right border-l-2 border-orange-300 pl-6">
					<p className="text-sm text-orange-600 font-semibold text-left">Status</p>
					<p className="text-lg text-orange-500 font-medium text-left mt-2">Under Review</p>
					<p className="text-sm text-gray-500 text-left mt-1">We'll notify you soon</p>
				</div>
			);
		} else if (status === "DECLINED") {
			return (
				<div className="text-right border-l-2 border-red-300 pl-6">
					<p className="text-sm text-red-600 font-semibold text-left">Status</p>
					<p className="text-lg text-red-500 font-medium text-left mt-2">Declined</p>
					<p className="text-sm text-gray-500 text-left mt-1">See reasons below</p>
				</div>
			);
		}
		return null;
	};

	const getBackgroundClass = () => {
		if (status === "APPROVED") {
			return "bg-gradient-to-br from-green-100 to-blue-100";
		} else if (status === "PENDING") {
			return "bg-gradient-to-br from-yellow-50 to-orange-100";
		} else if (status === "DECLINED") {
			return "bg-gradient-to-br from-red-50 to-red-100";
		}
		return "bg-gradient-to-br from-[#351F78]/10 to-[#0B82BE]/10";
	};

	return (
		<div className={`w-3/4 h-42 rounded-2xl border border-gray-300 shadow-xl ${getBackgroundClass()} text-white relative overflow-hidden`}>
			<div className="text-black opacity-100">
				<div className="rounded-2xl p-6 flex justify-between items-center">
					<div>
						<p className="text-lg font-normal">
							{status === "APPROVED" ? "Remaining Amount" :
								status === "PENDING" ? "Requested Amount" :
									"Applied Amount"} • {productName}
						</p>
						<p className="text-2xl font-semibold my-2">{remainingAmount}</p>
						<p className="text-sm font-light text-black mt-2">
							Credit Amount - {contractPart}
						</p>
						<p className="text-sm font-semibold">{creditAmount}</p>
					</div>

					{renderRightSection()}
				</div>
			</div>
		</div>
	);
}