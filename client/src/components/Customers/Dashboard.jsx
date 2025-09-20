import CustomerSidebar from "../common/CustomerSidebar";
import CustomerTableRow from "./CustomerTableRow";
import Card from "./Cards";
import { useEffect, useState, useContext } from "react";
import { getUserAccount } from "../../services/userService";
import { AuthContext } from "../../contexts/AuthContext";

let data = {
	name: "Name 1",
	amount: "+ 1200 EUR",
	date: "04/09/2025",
	time: "10:30 AM",
	card: "Debit",
};

export default function Dashboard() {
	const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
		
		console.log("Token in Dashboard:", token);

        const accs = await getUserAccount(user.id, token); 
        setAccounts(accs);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, [user]);

  if (loading) return <p>Loading accounts...</p>;

	return (
		<div className="min-h-screen flex bg-white">
			<CustomerSidebar />


			<div className="flex-1 p-8 ml-12 flex flex-col gap-12">


				<div>
					<h1 className="text-2xl font-bold mb-4">Your Cards</h1>


					<div className="grid grid-cols-2 gap-6">
						<Card className="w-96 h-56" />
						<Card className="w-96 h-56" />

					</div>


					<div className="grid grid-cols-2 gap-6 mt-6">
						 {accounts.map((acc) => (
						<div
						key={acc.id} 
						className="w-96 h-20 rounded-2xl border-2 border-[#351F78] flex flex-col justify-center">
							<div className="text-[#351F78] text-2xl text-center">  Balance: {acc.balance.toFixed(2)} EUR</div>
							<div className="text-[#351F78] text-sm text-center"> IBAN: {acc.accountNumber}</div>
						</div>
						))}
					</div>
				</div>


				<div className="w-full">
					<h1 className="text-xl font-bold mb-6 text-[#351f78]">
						Recent Transactions
					</h1>
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
				</div>

			</div>
		</div>
	);
}
