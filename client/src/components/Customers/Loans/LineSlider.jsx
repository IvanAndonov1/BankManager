import { useState } from "react";

export default function LineSlider({ sliderName,details, min, max, defaultValue }) {
  const [requestedAmount, setRequestedAmount] = useState(defaultValue ?? min);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-full flex justify-between items-center">
      <h2 className="text-xl font-light">{sliderName}</h2>
       <span className="text-lg px-6 py-2 rounded-3xl border-2 border-[#351F78]  font-medium text-[#351F78]">
         {requestedAmount} {details}</span>
         </div>
      
      <input
        type="range"
        min={min}
        max={max}
        requestedAmount={requestedAmount}
        onChange={(e) => setRequestedAmount(e.target.value)}
         className="w-full h-3 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #D6CAFF 0%, #96D8FF ${
            ((requestedAmount - min) / (max - min)) * 100
          }%, #e5e7eb ${((requestedAmount - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
      
     
    </div>
  );
}

