import { useEffect, useState, useContext } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import LoanCards from "../Loans/LoanCards";
import Card from "../Cards";
import { AuthContext } from "../../../contexts/AuthContext";
import { makeTransfer } from "../../../services/transferService";

export default function AnotherAccount({ isOpen, onClose }) {
	const { user } = useContext(AuthContext);

	const [showFromSelector, setShowFromSelector] = useState(false);
	const [fromAccount, setFromAccount] = useState(null);

	const [iban, setIban] = useState("");
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, [onClose]);

	if (!isOpen) return null;

	const handleSelectAccount = (account) => {
		setFromAccount(account);
		setShowFromSelector(false);
	};

	const handleTransfer = async () => {
		if (!fromAccount || !iban || !amount) {
			setError("Please fill in all fields.");
			return;
		}

		setLoading(true);
		try {
			makeTransfer(fromAccount.accountNumber, user.token, {
				toAccountNumber: iban,
				amount: parseFloat(amount),
				description: reason,
			});

			onClose();
		} catch (err) {
			setError(err.message || "Transfer failed");
		} finally {
			setLoading(false);
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
					To Another Account
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
								<p className="text-sm text-gray-600">
									IBAN: {fromAccount.accountNumber}
								</p>
							</div>
							<p className="text-md font-bold text-[#351F78]">
								Balance: {fromAccount.balance} EUR
							</p>
						</div>
					) : (
						<span className="text-gray-400">Select card</span>
					)}
				</div>


				<p className="text-normal font-light mb-4">Recipient IBAN</p>
				<input
					type="text"
					placeholder="Enter the IBAN of the recipient"
					value={iban}
					onChange={(e) => setIban(e.target.value)}
					className="w-3/4 border border-[#351F78] rounded-2xl p-2 mb-4"
				/>


				<p className="text-normal font-light mb-4">Amount</p>
				<input
					type="number"
					placeholder="0.00 EUR"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="w-3/4 border border-[#351F78] rounded-2xl p-2 mb-4"
				/>


				<p className="text-normal font-light mb-4">Reason</p>
				<input
					type="text"
					placeholder="Reason for the transfer"
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					className="w-3/4 border border-[#351F78] rounded-2xl p-2 mb-6"
				/>

				{error && <p className="text-red-500">{error}</p>}


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
						<LoanCards onSelect={handleSelectAccount} />
					</div>
				</div>
			)}
		</div>
	);
}
