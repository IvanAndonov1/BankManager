import CustomerTableRow from "../Customers/CustomerTableRow";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { getAllTransactions, getUserAccount, getUserAccounts } from "../../services/userService";
import { useEffect, useState } from "react";

export default function TransactionTable({ showAll = false }) {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user.id && user.token) {
			const fetchData = async () => {
				try {
					const accountsData = await getUserAccounts(user.token);
					const accountNumbers = accountsData.map(account => account.accountNumber);

					if (accountNumbers.length > 0) {
						const transactionPromises = accountNumbers.map(async (iban) => {
							const data = await getAllTransactions(iban, user.token);
							return Array.isArray(data) ? data : [];
						});
						const transactionResults = await Promise.all(transactionPromises);

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

	if (loading) return <p className="text-[#351f78] font-bold">Loading transactions...</p>;
	if (error) return <p className="text-red-500">{error}</p>;


	const rowsToShow = showAll ? transactions : transactions.slice(0, 4);


	return (
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
				{rowsToShow.length > 0 ? rowsToShow.map((transaction, index) => (
					<CustomerTableRow

						key={index}
						type={transaction.type}
						amount={transaction.amount}
						dateTime={transaction.dateTime}
						description={transaction.description}
						cardType={transaction.cardType}
					/>
				)) : null}
			</tbody>
		</table>
	);
}

