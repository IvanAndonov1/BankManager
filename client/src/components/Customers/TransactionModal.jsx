import { useEffect } from "react";
import LoanCards from "./LoanCards";
import { FaCircleCheck } from "react-icons/fa6";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose?.();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
        <div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[800px]">
       <h1 className="text-2xl text-center">Money Transfer</h1>
       <h2 className="text-sm text-gray-500 mb-4 text-center">Between Your Accounts</h2>

       <p className="text-normal font-light mb-4">From</p>
       <div className="w-full border border-gray-300 rounded-2xl mb-6">
       <LoanCards className="w-full"/>
         </div>

      
       <p className="text-normal font-light mb-4">To</p>
       <div className="w-full border border-[#351F78] rounded-2xl mb-6">
       <LoanCards className="w-full"/>
         </div>

        <p className="text-normal font-light mb-4">Amount</p>
        <div className="flex items-center gap-24 mb-6">
        <input 
        type="text"
        placeholder="0.00 EUR"
        className="w-3/4 border border-[#351F78] rounded-2xl p-2 mb-2"
        />
        <button>
        <FaCircleCheck className="text-[#351F78] w-10 h-10 mb-2" />
        </button>
        </div>

        <div className="mt-4">{children}</div>
        
        
        <button
          className="absolute mr-2 top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}