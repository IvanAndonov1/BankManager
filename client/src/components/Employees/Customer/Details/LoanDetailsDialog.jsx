import { useEffect } from "react";

function nextMonthDate(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	const n = new Date(d);
	n.setMonth(n.getMonth() + 1);
	if (n.getDate() !== d.getDate()) {
		n.setDate(0);
	}
	return n.toISOString().slice(0, 10);
}

export default function LoanDetailsDialog({ open, onClose, loan }) {
	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, [onClose]);

	if (!open || !loan) return null;

	const fieldsTop = [
		{ label: "Status", value: loan.status },
		{ label: "Requested Amount", value: `${loan.requestedAmount} ${loan.currency}` },
		{ label: "Term (months)", value: loan.termMonths },
		{ label: "Nominal Annual Rate", value: (loan.nominalAnnualRate * 100).toFixed(2) + " %" },
		{ label: "Monthly Payment", value: `${loan.monthlyPayment} ${loan.currency}` },
		{ label: "Total Payable", value: `${loan.totalPayable} ${loan.currency}` },
	];

	const fieldsClient = [
		{ label: "Customer ID", value: loan.customerId },
		{ label: "Target Account", value: loan.targetAccountNumber },
		{ label: "Decided By (User ID)", value: loan.decidedByUserId ?? "—" },
		{ label: "Decided At", value: loan.decidedAt ? String(loan.decidedAt).slice(0, 19).replace("T", " ") : "—" },
		{ label: "Created At", value: String(loan.createdAt).slice(0, 19).replace("T", " ") },
		{ label: "Updated At", value: String(loan.updatedAt).slice(0, 19).replace("T", " ") },
	];

	const scoring = [
		{ label: "Tenure Score", value: loan.tenureScore },
		{ label: "DTI Score", value: loan.dtiScore },
		{ label: "Account Age Score", value: loan.accountAgeScore },
		{ label: "Cushion Score", value: loan.cushionScore },
		{ label: "Recent Debt Score", value: loan.recentDebtScore },
		{ label: "Composite", value: loan.composite },
		{ label: "Accumulated Points", value: loan.accumulatedPoints },
		{ label: "Max Possible", value: loan.maxPossiblePoints },
		{ label: "Percentage of Max", value: `${loan.percentageOfMax}%` },
		{ label: "Credit Score", value: loan.creditScore },
		{ label: "Recommendation", value: loan.recommendation },
	];

	const nextPaymentDate = nextMonthDate(loan.decidedAt);

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center p-4">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

			<div className="relative w-full max-w-4xl max-h-[97vh] rounded-2xl bg-white shadow-2xl overflow-hidden">
				<div className="sticky top-0 bg-white border-b px-8 py-4 z-10">
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl leading-none"
						aria-label="Close"
					>
						✕
					</button>

					<div className="flex items-start justify-between gap-6">
						<div>
							<div className="text-xs text-gray-500">Loan · #{loan.id}</div>
							<div className="mt-2 text-[28px] font-semibold text-gray-900">
								{loan.disbursedAmount ?? loan.requestedAmount} {loan.currency}
							</div>
							<div className="text-sm text-gray-600">
								Next Payment: <span className="font-medium">{loan.monthlyPayment} {loan.currency}</span>{" "}
								on <span className="font-medium">{nextPaymentDate}</span>
							</div>
						</div>
						<div className="text-center">
							<div className="text-xs text-gray-500">Status</div>
							<div
								className={[
									"inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium",
									loan.status === "APPROVED"
										? "bg-green-100 text-green-700 ring-1 ring-green-200"
										: loan.status === "DECLINED"
											? "bg-red-100 text-red-700 ring-1 ring-red-200"
											: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
								].join(" ")}
							>
								{loan.status}
							</div>
						</div>
					</div>
				</div>

				<div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{fieldsTop.map(({ label, value }) => (
							<div key={label} className="rounded-xl border p-4">
								<div className="text-xs text-gray-500">{label}</div>
								<div className="mt-1 text-base font-medium text-gray-900">{String(value)}</div>
							</div>
						))}
					</div>

					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
						{fieldsClient.map(({ label, value }) => (
							<div key={label} className="rounded-xl border p-4">
								<div className="text-xs text-gray-500">{label}</div>
								<div className="mt-1 text-base font-medium text-gray-900 break-all">{String(value)}</div>
							</div>
						))}
					</div>

					<div className="mt-6">
						<div className="text-sm font-semibold text-gray-800 mb-3">Scoring</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{scoring.map(({ label, value }) => (
								<div key={label} className="rounded-xl border p-4">
									<div className="text-xs text-gray-500">{label}</div>
									<div className="mt-1 text-base font-medium text-gray-900">{String(value)}</div>
								</div>
							))}
						</div>
					</div>

					{Array.isArray(loan.reasons) && loan.reasons.length > 0 && (
						<div className="mt-6">
							<div className="text-sm font-semibold text-gray-800 mb-2">Reasons</div>
							<ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
								{loan.reasons.map((r, i) => (
									<li key={i}>{r}</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="sticky bottom-0 bg-white border-t px-8 py-4">
					<div className="flex justify-center gap-3">
						{/* <button
							type="button"
							className="px-6 h-11 rounded-full text-white font-medium shadow
                           bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9]
                           hover:opacity-95"
						>
							Update
						</button> */}
						<button
							type="button"
							onClick={onClose}
							className="px-6 h-11 rounded-full font-medium border hover:bg-gray-50"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}