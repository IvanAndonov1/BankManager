import CustomerTableRow from "../Customers/CustomerTableRow";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { getAllTransactions, getUserAccounts } from "../../services/userService";
import { useEffect, useState } from "react";

export default function TransactionTable({ showAll = false }) {
	const [transactions, setTransactions] = useState([]);
	const [accounts, setAccounts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (accounts.length > 0) {
			const fetchCards = async () => {
				try {

					const data = await getAllTransactions(accounts[0].accountNumber, user.token);

					setTransactions(Array.isArray(data) ? data : []);
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};

			const fetchAccounts = async () => {
				try {
					const data = await getUserAccounts(user.token);
					setAccounts(Array.isArray(data) ? data : []);

				} catch (err) {
					setError(err.message);
				}
			};

			fetchAccounts();
			fetchCards();
		}
	}, [user.token]);

	console.log(accounts);


	if (loading) return <p className="text-[#351f78] font-bold">Loading transactions...</p>;
	if (error) return <p className="text-red-500">{error}</p>;


	const rowsToShow = showAll ? transactions : transactions.slice(0, 4);

	console.log(accounts);


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

