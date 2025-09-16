export default function LoansSection() {
    return (
     <div className="w-3/4 h-42 rounded-2xl border border-gray-300 shadow-xl  bg-gradient-to-br from-[#351F78]/10 to-[#0B82BE]/10 text-white relative overflow-hidden">
        <div className="text-black opacity-100">
       
        <div className=" rounded-2xl p-6 flex justify-between items-center">
        
          <div>
            <p className="text-lg font-normal">
              Remaining Amount • Consumer Loan
            </p>
            <p className="text-2xl font-semibold my-2">12 837,40 EUR</p>
            <p className="text-sm font-light text-black mt-2">
              Credit Amount - No DG 1234567
            </p>
            <p className="text-sm font-semibold">15 000,00 EUR</p>
          </div>

       
          <div className="text-right border-l-2 border-gray-300 pl-6">
            <p className="text-sm text-black font-semibold text-left">Next Payment</p>
            <p className="text-sm text-gray-500 font-medium text-left">10/09/2025</p>
            <p className="text-2xl text-gray-600 font-semibold mt-2">350,00 EUR</p>
          </div>
        </div>
        </div>
        </div>

 
    )
}   