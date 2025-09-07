import LoanDetailsDialog from "./LoanDetailsDialog";
import { useState } from "react";

function LoansPlaceholder() {
	const loans = [
		{
			id: "DG 1234567",
			type: "Consumer Loan",
			amount: "15 000,00 EUR",
			date: "23/04/2025",
		},
	];

	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-8">
			{loans.map((ln) => (
				<div key={ln.id} className="pt-2">
					<div className="flex justify-between items-center py-6">
						<span className="text-gray-600">
							Loan Amount <span className="mx-1">•</span> Consumer Loan
						</span>
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="text-[#6a1ea1] font-medium hover:underline"
						>
							View Details
						</button>
					</div>

					<LoanDetailsDialog open={open} onClose={() => setOpen(false)} />

					<div className="mt-2">
						<div className="text-2xl md:text-[28px] font-semibold text-gray-900">
							{ln.amount}
						</div>
						<div className="mt-1 text-xs md:text-sm text-gray-500">
							No {ln.id} <span className="mx-2">·</span> {ln.date}
						</div>
					</div>

					<div className="mt-4 border-t" />
				</div>
			))}

			<div className="pt-2 flex justify-center">
				<button
					type="button"
					className="px-8 h-11 rounded-full text-white font-medium shadow
                     bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9]
                     hover:opacity-95"
				>
					Confirm
				</button>
			</div>
		</div>
	);
}

export default LoansPlaceholder;