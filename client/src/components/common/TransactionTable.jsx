import { use, useEffect } from "react";
import CustomerTableRow from "../Customers/CustomerTableRow";

import { AuthContext } from '../../contexts/AuthContext';
import { getUserAccount } from "../../services/userService";

let data = {
	name: "Name 1",
	amount: "+ 1200 EUR",
	date: "04/09/2025",
	time: "10:30 AM",
	card: "Debit",
};

export default function TransactionTable() {
	const { user } = use(AuthContext);

	useEffect(() => {
		getUserAccount(user.id, user.token)
			.then(result => console.log(result));
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
				<CustomerTableRow {...data} />
				<CustomerTableRow {...data} />
				<CustomerTableRow {...data} />
				<CustomerTableRow {...data} />
			</tbody>
		</table>
	);
}