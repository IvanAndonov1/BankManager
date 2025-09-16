import Card from "../Cards";

export default function LoanCards({className = ""}) {
  return (
    <div className={`w-3/4 h-32 rounded-2xl border border-gray-300 shadow-xl  bg-gradient-to-br from-[#351F78]/10 to-[#0B82BE]/10 text-white relative overflow-hidden ${className}`}>
      <div className="text-black opacity-100">
        <div className=" rounded-2xl py-4 px-6 flex justify-between items-center">
             <div className=" origin-left">
            <Card size="w-38 h-24" textSize="text-[10px]" />
          </div>
          <div>
            <p className="text-lg font-semibold">Credit Mastercard</p>
            <p size className="font-normal mt-2">
              IBAN BG00 XXXX XXXX XXXX XXXX 11
            </p>
            <p className="font-medium">1234 **** **** 0000 | 06/27</p>
          </div>

          <div className="text-right border-l-2 border-gray-300 pl-6">
            <p className="text-lg text-black font-normal text-left">Balance</p>
            <p className="text-2xl text-gray-600 font-semibold mt-2">
              2034,62 EUR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
