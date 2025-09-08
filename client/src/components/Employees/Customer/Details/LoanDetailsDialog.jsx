// LoanDetailsDialog.jsx
import { useEffect } from "react";

export default function LoanDetailsDialog({ open, onClose }) {
	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, [onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

			<div className="relative mx-auto mt-24 w-[480px] max-w-[90vw] rounded-2xl bg-white shadow-2xl p-8">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl leading-none"
					aria-label="Close"
				>
					✕
				</button>

				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-gray-500">Remaining Amount · Consumer Loan</div>
						<div className="mt-4 text-[28px] font-semibold text-gray-900">12 837,40 EUR</div>
					</div>
					<button
						className="mt-9 mr-9 text-[#6a1ea1] text-sm font-medium hover:underline"
						type="button"
					>
						Edit
					</button>
				</div>

				<div className="mt-6 flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-gray-500">Next Payment</div>
						<div className="mt-1 text-[22px] font-semibold text-gray-900">350,00 EUR</div>
						<div className="text-sm text-gray-600">10/09/2025</div>
					</div>
					<button
						className="mt-9 mr-9 text-[#6a1ea1] text-sm font-medium hover:underline"
						type="button"
					>
						Edit
					</button>
				</div>

				<div className="mt-8 flex justify-center">
					<button
						type="button"
						className="px-8 h-11 rounded-full text-white font-medium shadow
                       bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9]
                       hover:opacity-95"
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
}