import { useState } from "react";

export default function LineSlider() {
  const [value, setValue] = useState(100000);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-full flex justify-between items-center">
      <h2 className="text-xl font-light">Loan Amount</h2>
       <span className="text-lg px-6 py-2 rounded-3xl border-2 border-[#351F78]  font-medium text-[#351F78]">
         {value} EUR</span>
         </div>
      
      <input
        type="range"
        min="500"
        max="100000"
        value={value}
        onChange={(e) => setValue(e.target.value)}
         className="w-full h-3 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #D6CAFF 0%, #96D8FF ${(value / 100000) * 100}%, #e5e7eb ${(value / 100000) * 100}%, #e5e7eb 100%)`
        }}
      />
      
     
    </div>
  );
}

