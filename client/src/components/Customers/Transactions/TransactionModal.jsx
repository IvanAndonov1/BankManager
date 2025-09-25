import { useEffect, useState } from "react";
import LoanCards from "../Loans/LoanCards";
import Card from "../Cards";
import { FaCircleCheck } from "react-icons/fa6";

export default function Modal({ isOpen, onClose, children }) {
	const [showFromSelector, setShowFromSelector] = useState(false);
	const [showToSelector, setShowToSelector] = useState(false);
	const [fromAccount, setFromAccount] = useState(null);
	const [toAccount, setToAccount] = useState(null);

	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, [onClose]);

	if (!isOpen) return null;

	const handleSelectAccount = (account, type) => {
		if (type === "from") {
			setFromAccount(account);
			setShowFromSelector(false);
		} else {
			setToAccount(account);
			setShowToSelector(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
		
			<div
				className="absolute inset-0 bg-black opacity-50"
				onClick={onClose}
			></div>

	
			<div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[800px]">
				<h1 className="text-2xl text-center">Money Transfer</h1>
				<h2 className="text-sm text-gray-500 mb-4 text-center">
					Between Your Accounts
				</h2>

				
				<p className="text-normal font-light mb-4">From</p>
				<div
					className="w-full border border-gray-300 rounded-2xl mb-6 p-4 cursor-pointer hover:bg-gray-100"
					onClick={() => setShowFromSelector(true)}
				>
					{fromAccount ? (
						<div className="flex items-center justify-between">
							<Card
								width="w-24"
								height="h-14"
								textSize="text-[5px]"
								logoSize="w-4 h-2"
								size="py-1 px-1"
								margin="mt-1"
								rounded="rounded-lg"
								{...fromAccount}
							/>
							<div className="ml-4 flex-1">
								<p className="font-semibold">{fromAccount.cardType}</p>
								<p className="text-sm text-gray-600">IBAN: {fromAccount.accountNumber}</p>
							</div>
							<p className="text-md font-bold text-[#351F78]">
							Balance:	{fromAccount.balance} EUR
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
					{toAccount ? (
						<div className="flex items-center justify-between">
							<Card
								width="w-24"
								height="h-14"
								textSize="text-[5px]"
								logoSize="w-4 h-2"
								size="py-1 px-1"
								margin="mt-1"
								rounded="rounded-lg"
								{...toAccount}
							/>
							<div className="ml-4 flex-1">
								<p className="font-semibold">{toAccount.cardType}</p>
								<p className="text-sm text-gray-600">IBAN: {toAccount.accountNumber}</p>
							</div>
							<p className="text-md font-bold text-[#351F78]">
								Balance: {toAccount.balance} EUR
							</p>
						</div>
					) : (
						<span className="text-gray-400">Select card</span>
					)}
				</div>

				
				<p className="text-normal font-light mb-4">Amount</p>
				<div className="flex items-center gap-24 mb-6">
					<input
						type="text"
						placeholder="0.00 EUR"
						className="w-3/4 border border-[#351F78] rounded-2xl p-2 mb-2"
					/>
					<button>
						<FaCircleCheck
							className="text-[#351F78] w-10 h-10 mb-2"
							onClick={onClose}
						/>
					</button>
				</div>

				<div className="mt-4">{children}</div>

				
				<button
					className="absolute mr-2 top-2 right-2 text-gray-600 hover:text-black"
					onClick={onClose}
				>
					✕
				</button>
			</div>

			
			{showFromSelector && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div
						className="absolute inset-0 bg-black opacity-50"
						onClick={() => setShowFromSelector(false)}
					></div>
					<div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[600px]">
						<h2 className="text-xl mb-4">Select From Account</h2>
						<LoanCards onSelect={(account) => handleSelectAccount(account, "from")} />
					</div>
				</div>
			)}

			{showToSelector && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div
						className="absolute inset-0 bg-black opacity-50"
						onClick={() => setShowToSelector(false)}
					></div>
					<div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[600px]">
						<h2 className="text-xl mb-4">Select To Account</h2>
						<LoanCards onSelect={(account) => handleSelectAccount(account, "to")} />
					</div>
				</div>
			)}
		</div>
	);
}
