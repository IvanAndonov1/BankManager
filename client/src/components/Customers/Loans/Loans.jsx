import CustomerSidebar from "../../common/CustomerSidebar";
import LoanCards from "./LoanCards";
import LoansSection from "./LoansSection";
import { useState } from "react";
import Modal from "./LoanModal";

export default function Loans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen flex  bg-white">
      <CustomerSidebar />
      <div className="flex-1 items-center justify-center p-12 space-y-12 ml-24">
          <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Your Credit</h2>
        <LoansSection />
        </div>
        
         <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Cards</h2>
       
        <LoanCards />
        </div>
    


        <div className="flex gap-24 ml-2 mt-6">
          <button className="bg-[#351f78] text-white px-10 py-2 rounded-3xl"
          onClick={() => setIsModalOpen(true)}>
            Request Loan
          </button>
           <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
          <button className="bg-[#508443] text-white px-10 py-2 rounded-3xl">
            Pay All
          </button>
          <button className="bg-[#351f78] text-white px-10 py-2 rounded-3xl">
            Waiting Loans
          </button>
        </div>
      </div>
    </div>
  );
}
