import CustomerTableRow from "../Customers/CustomerTableRow";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { getAllTransactions} from "../../services/userService";
import { useEffect, useState } from "react";

export default function TransactionTable({showAll}) {
 
  
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
  
    useEffect(() => {
      const fetchCards = async () => {
        try {
         
          const data = await getAllTransactions(user.id, user.token);
          
          setTransactions(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCards();
    }, [user]);
  
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
         {rowsToShow.map((transaction, index) => (
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
  );
}

