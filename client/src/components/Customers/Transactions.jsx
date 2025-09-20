import CustomerSidebar from '../common/CustomerSidebar';
import MoneyTransferCard from '../common/MoneyTransferCard';
import TransactionsTable from '../common/TransactionTable';
import { useState, useEffect, useContext } from 'react';
import Modal from './TransactionModal';
import { getUserAccount, getAllTransactions } from '../../services/userService';
import { AuthContext } from "../../contexts/AuthContext.jsx";

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");

        
        const account = await getUserAccount(user.id, token);

       
        const txs = await getAllTransactions(account.id, token);

        setTransactions(txs);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen flex bg-white">
      <CustomerSidebar />

      <div className="flex-1 p-8 ml-12 flex flex-col gap-12">
        <h1 className="text-3xl font-bold mb-4 mt-4">Make Transactions</h1>

        <div className="grid grid-cols-2 gap-2">
          <MoneyTransferCard onClick={() => setIsModalOpen(true)} />
          <MoneyTransferCard />
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-2">
            <h1 className="text-3xl font-bold mt-4 text-[#351f78]">
              Transactions History
            </h1>

            <input
              className="mt-4 w-96 p-3 text-gray-400 border border-gray-300 
                         focus:outline-none focus:ring-1 focus:ring-[#351f78] rounded-3xl"
              placeholder="Search transactions..."
              type="text"
            />
          </div>

          {loading ? (
            <p>Loading transactions...</p>
          ) : (
            <TransactionsTable transactions={transactions} />
          )}

          <div className="flex justify-end mt-8">
            <button className="bg-[#351f78] rounded-3xl p-2 px-6 text-white">
              See All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
