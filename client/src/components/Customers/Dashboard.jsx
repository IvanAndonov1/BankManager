import CustomerSidebar from "../common/CustomerSidebar";
import CustomerTableRow from "./CustomerTableRow";
import CardList from "./CardList";
import AiChatBot from "../common/aiChatBot";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getBalanceData } from "../../services/cardService";
import { getAllTransactions, getUserAccounts } from "../../services/userService";

export default function Dashboard() {
	const { user } = useContext(AuthContext);

	const [balances, setBalances] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (user.id && user.token) {
			const fetchData = async () => {
				try {
					const accountsData = await getUserAccounts(user.token);
					const accountNumbers = accountsData.map(account => account.accountNumber);

					if (accountNumbers.length > 0) {
						const balancePromises = accountNumbers.map(async (iban) => {
							const response = await getBalanceData(iban, user.token);
							return {
								accountNumber: response.accountNumber || iban,
								balance: response.balance
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

					<div className="flex items-center mb-6 cursor-pointer gap-8">
                 
					<div className="grid grid-cols-1 gap-10">
						<CardList />
					</div> 
					<button className=" rounded-full bg-gradient-to-b from-[#351F78] to-[#0B82BE] w-8 h-8 text-white text-center pt-[1px] font-bold text-xl">+</button>
					</div>

					<div className="grid grid-cols-2 gap-4 mt-6">
						{balances.map((x, i) => (
							<div
								key={i}
								className={`mr-6 w-80 h-20 rounded-2xl border-2 border-[#351F78] flex flex-col justify-center ${i === 1 ? 'bg-[#351F78]' : ''
									}`}
							>
								<div className={`text-2xl text-center ${i === 1 ? 'text-white' : 'text-[#351F78]'
									}`}>
									Balance: {x.balance} EUR
								</div>
								<div className={`text-sm text-center ${i === 1 ? 'text-white' : 'text-[#351F78]'
									}`}>
									IBAN: {x.accountNumber}
								</div>
							</div>
						))}
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
							{transactions
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
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}