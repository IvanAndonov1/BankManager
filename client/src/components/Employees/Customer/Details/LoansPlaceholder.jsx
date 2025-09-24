import { useEffect, useState } from "react";
import LoanDetailsDialog from "./LoanDetailsDialog";
import { useParams } from "react-router";

function LoansPlaceholder({ loanDetails }) {
	const { userId } = useParams();
	const [currentLoanDetails, setCurrentLoanDetails] = useState([]);
	const [open, setOpen] = useState({
		status: false,
		id: 0
	});

	useEffect(() => {
		setCurrentLoanDetails(loanDetails.filter(x => x.customerId == Number(userId) && x.status == 'APPROVED'));
	}, [loanDetails, userId])

	return (
		<div className="space-y-8">
			{currentLoanDetails.map((ln, id) => (
				<div key={ln.id} className="pt-2">
					<div className="flex justify-between items-center py-6">
						<span className="text-gray-600">
							Loan Amount <span className="mx-1">•</span> Consumer Loan
						</span>
						<button
							type="button"
							onClick={() => setOpen(state => ({ ...state, status: true, id }))}
							className="text-[#6a1ea1] font-medium hover:underline"
						>
							View Details
						</button>
					</div>

					<LoanDetailsDialog open={open.status} onClose={() => setOpen(state => ({ ...state, status: false, id: 0 }))} loanDetails={[currentLoanDetails[open.id]]} />

					<div className="mt-2">
						<div className="text-2xl md:text-[28px] font-semibold text-gray-900">
							{ln.requestedAmount} {ln.currency}
						</div>
						<div className="mt-1 text-xs md:text-sm text-gray-500">
							No {ln.id} <span className="mx-2">·</span> {ln.createdAt.substr(0, 10)}
						</div>
					</div>

					<div className="mt-4 border-t" />
				</div>
			))}
		</div>
	);
}

export default LoansPlaceholder;