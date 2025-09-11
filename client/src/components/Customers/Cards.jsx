export default function Card({ className = "" }) {
  return (
    <div className={` rounded-2xl shadow-xl bg-gradient-to-br from-[#A5438B] to-[#0B82BE] text-white relative overflow-hidden ${className}`}>
      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start"></div>
        <div className="flex justify-between items-end mt-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
            alt="card network"
            className="h-10"
          />
        </div>
        <div className="mt-4 space-y-1">
          <p className="tracking-widest text-xl">**** **** **** 0000</p>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="font-light text-lg">Debit Visa</p>
          </div>
          <p className="text-sm opacity-80">EXP 08/26</p>
        </div>
      </div>
    </div>
  );
}
