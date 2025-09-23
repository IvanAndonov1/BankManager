import CustomerSidebar from '../../common/CustomerSidebar';
import MoneyTransferCard from '../../common/MoneyTransferCard';
import TransactionsTable from '../../common/TransactionTable';
import { useState } from 'react';
import Modal from './TransactionModal';
import AnotherAccount from './ToAntoherAccount';



export default function Transactions() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAnotherAccountOpen, setIsAnotherAccountOpen] = useState(false);
	const [showAll, setShowAll] = useState(false);

	return (
		<div className="min-h-screen flex  bg-white">
			<CustomerSidebar />
			<div className="flex-1 p-8 ml-12 flex flex-col gap-12">
				<h1 className="text-3xl font-bold mb-4 mt-4">Make Transactions</h1>
				<div className="grid grid-cols-2 gap-2">
					<MoneyTransferCard transfer="Between Your Cards" onClick={() => setIsModalOpen(true)} />
					<MoneyTransferCard transfer="To Another Account" onClick={() => setIsAnotherAccountOpen(true)} />
				</div>
				<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
				<AnotherAccount isOpen={isAnotherAccountOpen} onClose={() => setIsAnotherAccountOpen(false)} />


				<div className="w-full flex flex-col gap-6">
					<div className='grid grid-cols-2 gap-2'>
						<h1 className="text-3xl font-bold mt-4 text-[#351f78]">
							Transactions History
						</h1>

						<input className='mt-4 w-96 p-3 text-gray-400 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#351f78] rounded-3xl' placeholder='Search transactions...' type="text" />
					</div>

					<TransactionsTable showAll={showAll} />
					<div className="flex justify-end mt-8">
						<button className="bg-[#351f78] rounded-3xl p-2 px-6 text-white"
							onClick={() => setShowAll(!showAll)}
						>
							{showAll ? "See Less" : "See All History"}

						</button>
					</div>
				</div>
			</div>
		</div>

	);
}