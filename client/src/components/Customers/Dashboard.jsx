import CustomerSidebar from "../common/CustomerSidebar";
import CustomerTableRow from "./CustomerTableRow";
import CardList from "./CardList";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getBalanceData } from "../../services/cardService";
import { getAllTransactions } from "../../services/userService";


export default function Dashboard() {

    const [balanceData, setBalanceData] = useState([]);
	const [transactions, setTransactions] = useState([]); 
	const [ setLoading] = useState(true);
	const [ setError] = useState(null);
    const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchBalanceData = async () => {
		  try {
			const response = await getBalanceData(user.id, user.token);
			if (!response.ok) throw new Error("Failed to fetch cards");
	
			const data = await response.json();
			setBalanceData(data);
		  } catch (err) {
			setError(err.message);
		  } finally {
			setLoading(false);
		  }
		};

		  const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions(user.id, user.token); 
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      }
    };
	
		fetchBalanceData();
		fetchTransactions();
	  }, [user]);
	
	

	return (
		<div className="min-h-screen flex bg-white">
			<CustomerSidebar />


			<div className="flex-1 p-8 ml-12 flex flex-col gap-12">


				<div>
					<h1 className="text-2xl font-bold mb-4">Your Cards</h1>


					<div className="flex flex-cols-2 gap-12">
						
						<CardList />

					</div>


					<div className="flex flex-cols-2 gap-10 mt-6">
						
						{balanceData.map(x => (
                            <div key={x.id} className="w-85 h-20 rounded-2xl border-2 border-[#351F78] flex flex-col justify-center">
                                <div className="text-[#351F78] text-2xl text-center">Balance: {x.balance} EUR</div>
                                <div className="text-[#351F78] text-sm text-center">IBAN: {x.accountNumber}</div>
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
								<th className="py-2 font-normal">Description</th>
								<th className="py-2 font-normal">Card</th>
							</tr>
						</thead>
						<tbody>
							{transactions.slice(0, 4).map((transaction, index) => (
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
