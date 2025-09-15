import { use, useEffect, useState } from "react";
import CustomerTableRow from "../Customers/CustomerTableRow";

import { AuthContext } from '../../contexts/AuthContext';
import { getUserAccount } from "../../services/userService";

export default function TransactionTable() {
	const { user } = use(AuthContext);
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		getUserAccount(user.id, user.token)
			.then(result => setTransactions(result));
	}, []);

	return (
		<table className="w-full text-left text-sm">
			<thead className="text-[#707070]">
				<tr className="border-b border-gray-300">
					<th className="py-2 font-normal">Transaction Name</th>
					<th className="py-2 font-normal">Amount</th>
					<th className="py-2 font-normal">Date</th>
					<th className="py-2 font-normal">Time</th>
					<th className="py-2 font-normal">Card</th>
				</tr>
			</thead>
			<tbody>
				{transactions.length ?
					transactions.map(x => (
						<CustomerTableRow key={x.id} {...x} />
					))
					: <tr><td>No data available!</td></tr>
				}
			</tbody>
		</table>
	);
}