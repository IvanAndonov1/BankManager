import { use, useEffect, useState } from "react";
import LoanCards from "../Loans/LoanCards";
import Card from "../Cards";
import { FaCircleCheck } from "react-icons/fa6";
import { AuthContext } from "../../../contexts/AuthContext";
import { transferMoneyBetweenCards } from "../../../services/cardService";

export default function Modal({ isOpen, onClose, children }) {
	const { user } = use(AuthContext);
	const [showFromSelector, setShowFromSelector] = useState(false);
	const [showToSelector, setShowToSelector] = useState(false);
	const [selectedFromCard, setSelectedFromCard] = useState(null);
	const [selectedToCard, setSelectedToCard] = useState(null);
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");

	const handleTransfer = async () => {
		const fromAccountNumber = selectedFromCard?.accountNumber;
		const toAccountNumber = selectedToCard?.accountNumber;
		const numericAmount = Number(amount);

		if (!fromAccountNumber || !toAccountNumber || !numericAmount) {
			alert("All fields are required.");
			return;
		}
		if (fromAccountNumber === toAccountNumber) {
			alert("Accounts are equal!");
			return;
		}
		if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
			alert("Please enter an amount greater than zero!");
			return;
		}

		const payload = {
			toAccountNumber,
			amount: numericAmount,
			description: reason?.trim() || null,
		};

		try {
			await transferMoneyBetweenCards(fromAccountNumber, payload, user.token);
			setSelectedFromCard(null);
			setSelectedToCard(null);
			setAmount("");
			setReason("");
			onClose?.();
		} catch (err) {
			console.error(err);
			alert("Transfer error. Please, try again later.");
		}
	};

	useEffect(() => {
		if (isOpen) {
			setSelectedFromCard(null);
			setSelectedToCard(null);
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onEsc);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onEsc);
			document.body.style.overflow = prevOverflow;
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleSelectAccount = (account, type) => {
		if (type === "from") {
			setSelectedFromCard(account);
			setShowFromSelector(false);
		} else {
			setSelectedToCard(account);
			setShowToSelector(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
		>
			<div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

			<div className="relative z-10 w-full max-w-[800px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-lg">
				<div className="sticky top-0 z-10 rounded-t-2xl bg-white/90 backdrop-blur px-6 pt-5 pb-3 border-b">
					<h1 className="text-2xl text-center">Money Transfer</h1>
					<h2 className="text-sm text-gray-500 text-center">Between Your Accounts</h2>
					<button
						className="absolute top-3.5 right-4 text-gray-600 hover:text-black"
						onClick={onClose}
						aria-label="Close"
					>
						✕
					</button>
				</div>

				<div className="px-6 py-5">
					<p className="text-normal font-light mb-3">From</p>
					<div
						className="w-full border border-gray-300 rounded-2xl mb-6 p-4 cursor-pointer hover:bg-gray-100"
						onClick={() => setShowFromSelector(true)}
					>
						{selectedFromCard ? (
							<div className="flex items-center justify-between">
								<Card
									width="w-24"
									height="h-14"
									textSize="text-[5px]"
									logoSize="w-4 h-2"
									size="py-1 px-1"
									margin="mt-1"
									rounded="rounded-lg"
									{...selectedFromCard}
								/>
								<div className="ml-4 flex-1">
									<p className="font-semibold">{selectedFromCard.cardType}</p>
									<p className="text-sm text-gray-600">
										IBAN: {selectedFromCard.accountNumber}
									</p>
								</div>
								<p className="text-md font-bold text-[#351F78]">
									Balance: {selectedFromCard.balance} EUR
								</p>
							</div>
						) : (
							<span className="text-gray-400">Select card</span>
						)}
					</div>

					<p className="text-normal font-light mb-4">To</p>
					<div
						className="w-full border border-gray-300 rounded-2xl mb-6 p-4 cursor-pointer hover:bg-gray-100"
						onClick={() => setShowToSelector(true)}
					>
						{selectedToCard ? (
							<div className="flex items-center justify-between">
								<Card
									width="w-24"
									height="h-14"
									textSize="text-[5px]"
									logoSize="w-4 h-2"
									size="py-1 px-1"
									margin="mt-1"
									rounded="rounded-lg"
									{...selectedToCard}
								/>
								<div className="ml-4 flex-1">
									<p className="font-semibold">{selectedToCard.cardType}</p>
									<p className="text-sm text-gray-600">
										IBAN: {selectedToCard.accountNumber}
									</p>
								</div>
								<p className="text-md font-bold text-[#351F78]">
									Balance: {selectedToCard.balance} EUR
								</p>
							</div>
						) : (
							<span className="text-gray-400">Select card</span>
						)}
					</div>

					<p className="text-normal font-light mb-3">Amount</p>
					<div className="flex items-center gap-4 flex-wrap mb-6">
						<div className="flex-1 min-w-[220px]">
							<input
								type="number"
								placeholder="0.00"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full border border-[#351F78] rounded-2xl p-2"
							/>
						</div>
						<span className="text-sm text-gray-600">EUR</span>
					</div>

					<label className="block text-normal font-light mb-2" htmlFor="reason">
						Description
					</label>
					<textarea
						id="reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Example: Transfer between my cards..."
						rows={3}
						maxLength={200}
						className="w-full border border-gray-300 rounded-2xl p-3 mb-6 resize-y"
					/>

					<div className="flex justify-end">
						<button
							onClick={handleTransfer}
							title="Confirm transfer"
							className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-[#351F78] hover:bg-[#351F78]/5"
						>
							<FaCircleCheck className="text-[#351F78] w-6 h-6" />
							Transfer
						</button>
					</div>

					{children ? <div className="mt-4">{children}</div> : null}
				</div>
			</div>

			{showFromSelector && (
				<div className="fixed inset-0 flex items-center justify-center z-[1100]">
					<div
						className="absolute inset-0 bg-black opacity-50"
						onClick={() => setShowFromSelector(false)}
					/>
					<div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[600px]">
						<h2 className="text-xl mb-4">Select From Account</h2>
						<LoanCards onSelect={(account) => handleSelectAccount(account, "from")} />
					</div>
				</div>
			)}

			{showToSelector && (
				<div className="fixed inset-0 flex items-center justify-center z-[1100]">
					<div
						className="absolute inset-0 bg-black opacity-50"
						onClick={() => setShowToSelector(false)}
					/>
					<div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[600px]">
						<h2 className="text-xl mb-4">Select To Account</h2>
						<LoanCards onSelect={(account) => handleSelectAccount(account, "to")} />
					</div>
				</div>
			)}
		</div>
	);
}
