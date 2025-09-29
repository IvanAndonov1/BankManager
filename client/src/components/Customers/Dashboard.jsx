import CustomerSidebar from "../common/CustomerSidebar";
import CustomerTableRow from "./CustomerTableRow";
import CardList from "./CardList";
import AiChatBot from "../common/aiChatBot";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllCardsData, getBalanceData } from "../../services/cardService";
import { addAccountForUser, addCardToAccount, getAllTransactions, getUserAccounts } from "../../services/userService";

export default function Dashboard() {
	const { user } = useContext(AuthContext);

	const [balances, setBalances] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [isLinkCardModalOpen, setIsLinkCardModalOpen] = useState(false);
	const [selectedAccountIban, setSelectedAccountIban] = useState("");
	const [cardsData, setAllCardsData] = useState([]);


	useEffect(() => {
		if (user.id && user.token) {
			const fetchData = async () => {
				try {
					const accountsData = await getUserAccounts(user.token);
					const accountNumbers = accountsData.map((account) => account.accountNumber);

					if (accountNumbers.length > 0) {
						const balancePromises = accountNumbers.map(async (iban) => {
							const response = await getBalanceData(iban, user.token);
							return {
								accountNumber: response.accountNumber || iban,
								balance: response.balance,
							};
						});

						const transactionPromises = accountNumbers.map(async (iban) => {
							const data = await getAllTransactions(iban, user.token);
							return Array.isArray(data) ? data : [];
						});

						const balanceResults = await Promise.all(balancePromises);
						const transactionResults = await Promise.all(transactionPromises);

						setBalances(balanceResults);
						setTransactions(transactionResults.flat());
					}
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, [user.id, user.token]);

	const openLinkCardModal = () => {
		setSelectedAccountIban(balances?.[0]?.accountNumber || "");
		setIsLinkCardModalOpen(true);
	};

	const handleConfirmLink = () => {
		const payload = {
			accountNumber: selectedAccountIban,
			holderName: `${user.firstName} ${user.lastName}`,
			type: 'DEBIT'
		};

		addCardToAccount(user.token, payload)
			.then(() => {
				getAllCardsData(user.token)
					.then(res => setAllCardsData(res));
			})
		setIsLinkCardModalOpen(false);
	};

	const handleCreateAccount = () => {
		addAccountForUser(user.token, { customerId: user.id })
			.then(res => setBalances(state => ([...state, res])));
	};

	if (loading) {
		return (
			<div className="min-h-screen flex bg-white">
				<CustomerSidebar className="z-20" />
				<div className="flex-1 p-8 ml-12 flex flex-col gap-12 z-10">
					<h1 className="text-2xl font-bold">Loading...</h1>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex bg-white">
				<CustomerSidebar className="z-20" />
				<div className="flex-1 p-8 ml-12 flex flex-col gap-6 z-10">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="text-red-700">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex bg-white">
			<CustomerSidebar />

			<div className="flex-1 p-8 ml-12 flex flex-col gap-12">
				<div>
					<h1 className="text-2xl font-bold mb-4">Your Cards</h1>

					<div className="flex items-center mb-6 gap-4">
						<div className="flex gap-4">
							<CardList cardsData={cardsData} setCardsData={setAllCardsData} />
						</div>

						<button
							onClick={openLinkCardModal}
							title="Link card to account"
							className="rounded-full ml-2 bg-gradient-to-b from-[#351F78] to-[#0B82BE] w-9 h-9 text-white text-center leading-9 font-bold text-xl shadow hover:opacity-90 active:scale-95"
						>
							+
						</button>
					</div>

					<div className="flex items-center gap-6 mt-6 flex-wrap">
						{balances.map((x, i) => (
							<div
								key={i}
								className={`w-80 h-20 rounded-2xl border-2 border-[#351F78] flex flex-col justify-center ${i === 1 ? "bg-[#351F78]" : ""
									}`}
							>
								<div
									className={`text-2xl text-center ${i === 1 ? "text-white" : "text-[#351F78]"
										}`}
								>
									Balance: {x.balance} EUR
								</div>
								<div
									className={`text-sm text-center ${i === 1 ? "text-white" : "text-[#351F78]"
										}`}
								>
									IBAN: {x.accountNumber}
								</div>
							</div>
						))}

						<button
							onClick={handleCreateAccount}
							title="Add account"
							className="rounded-full bg-gradient-to-b from-[#351F78] to-[#0B82BE] w-9 h-9 text-white text-center leading-9 font-bold text-xl shadow hover:opacity-90 active:scale-95"
						>
							+
						</button>
					</div>
				</div>

				<AiChatBot />

				<div className="w-full">
					<h1 className="text-xl font-bold mb-6 text-[#351f78]">Recent Transactions</h1>
					<table className="w-full text-left text-sm">
						<thead className="text-[#707070]">
							<tr className="border-b border-gray-300">
								<th className="py-2 font-normal">Transaction Name</th>
								<th className="py-2 font-normal">Amount</th>
								<th className="py-2 font-normal">Date</th>
								<th className="py-2 font-normal">Time</th>
								<th className="py-2 font-normal">Description</th>
								<th className="py-2 font-normal">Card</th>
							</tr>
						</thead>
						<tbody>
							{transactions.length > 0 ? (
								transactions
									.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
									.slice(0, 4)
									.map((transaction, index) => (
										<CustomerTableRow
											key={index}
											type={transaction.type}
											amount={transaction.amount}
											dateTime={transaction.dateTime}
											description={transaction.description}
											cardType={transaction.cardType}
										/>
									))
							) : (
								<tr>
									<td colSpan={6} className="py-4 text-center text-gray-500">
										No transactions found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isLinkCardModalOpen && (
				<Modal onClose={() => setIsLinkCardModalOpen(false)} title="Link card to account">
					<div className="space-y-4">
						<label className="block text-sm font-medium text-gray-700">
							Choose account (IBAN)
						</label>
						<select
							className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B82BE]"
							value={selectedAccountIban}
							onChange={(e) => setSelectedAccountIban(e.target.value)}
						>
							{balances.map((b, idx) => (
								<option key={idx} value={b.accountNumber}>
									{b.accountNumber} — {b.balance} EUR
								</option>
							))}
						</select>

						<div className="flex justify-end gap-3 pt-2">
							<button
								onClick={() => setIsLinkCardModalOpen(false)}
								className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmLink}
								disabled={!selectedAccountIban}
								className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#351F78] to-[#0B82BE] disabled:opacity-60"
							>
								Save selection
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
}

function Modal({ title, children, onClose }) {
	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && onClose?.();
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			aria-modal="true"
			role="dialog"
		>
			<div
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-[#351F78]">{title}</h3>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-full border border-gray-300 grid place-items-center hover:bg-gray-50"
						aria-label="Close"
						title="Close"
					>
						✕
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}