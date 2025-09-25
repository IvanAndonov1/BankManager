import { useEffect, useMemo, useState } from "react";
import LoanDetailsDialog from "./LoanDetailsDialog";
import { useParams } from "react-router";

function StatusBadge({ status }) {
	const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
	const map = {
		APPROVED: "bg-green-100 text-green-700 ring-1 ring-green-200",
		DECLINED: "bg-red-100 text-red-700 ring-1 ring-red-200",
		PENDING: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
		REVIEW: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
	};
	const cls = map[status] || "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
	return (
		<span className={`${base} ${cls}`}>
			<span className="h-1.5 w-1.5 rounded-full bg-current" />
			{status}
		</span>
	);
}

function LoansPlaceholder({ loanDetails }) {
	const { userId } = useParams();
	const [open, setOpen] = useState({ status: false, index: -1 });

	const currentLoans = useMemo(() => {
		const uid = Number(userId);
		return Array.isArray(loanDetails)
			? loanDetails.filter((x) => x?.customerId === uid)
			: [];
	}, [loanDetails, userId]);

	const selectedLoan = open.index >= 0 ? currentLoans[open.index] : null;

	return (
		<div className="space-y-8">
			{currentLoans.map((ln, idx) => (
				<div key={ln.id} className="pt-2">
					<div className="flex justify-between items-center py-6">
						<span className="text-gray-600 flex items-center gap-2">
							<StatusBadge status={ln.status} />
							<span className="text-gray-400">•</span>
							<span>Consumer Loan</span>
						</span>

						<button
							type="button"
							onClick={() => setOpen({ status: true, index: idx })}
							className="text-[#6a1ea1] font-medium hover:underline"
						>
							View Details
						</button>
					</div>

					<div className="mt-2">
						<div className="text-2xl md:text-[28px] font-semibold text-gray-900">
							{Number(ln.requestedAmount)?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {ln.currency}
						</div>
						<div className="mt-1 text-xs md:text-sm text-gray-500">
							No {ln.id} <span className="mx-2">·</span> {String(ln.createdAt).slice(0, 10)}
						</div>
					</div>

					<div className="mt-4 border-t" />
				</div>
			))}

			{currentLoans.length <= 0 && <h1>No loans data.</h1>}

			<LoanDetailsDialog
				open={open.status}
				onClose={() => setOpen({ status: false, index: -1 })}
				loan={selectedLoan}
			/>
		</div>
	);
}

export default LoansPlaceholder;
