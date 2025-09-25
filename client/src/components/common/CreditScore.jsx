export default function CreditScore({ score = 450 }) {
  const min = 0;
  const max = 600;

  const angle = ((score - min) / (max - min)) * 180;
  let label = "Bad";
  if (score >= 400) label = "Good";
  else if (score >= 200) label = "Fair";

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl text-gray-600 font-semibold mb-6 pl-22">
        Your Credit Score
      </h2>

     
      <div className="flex flex-row items-center space-x-8">
        
        <div className="flex flex-col space-y-2">
          <p>Criteria 1</p>
          <p>Criteria 2</p>
          <p>Criteria 3</p>
          <p>Criteria 4</p>
          <p>Criteria 5</p>
        </div>

        
        <div className="relative w-64 h-32 overflow-hidden">
          <div className="absolute inset-0 rounded-t-full border-t-[20px] border-r-[20px] border-l-[20px] border-b-0 border-yellow-200 border-r-[#137F00] border-l-[#D52020] opacity-60"></div>

          <div
            className="absolute bottom-0 left-1/2 w-1 h-12 bg-black origin-bottom"
            style={{ transform: `rotate(${angle - 90}deg)` }}
          />
        </div>
      </div>


      <div className="text-5xl font-bold mt-6 pl-22">{score}</div>
      <div className="text-gray-600 font-medium pl-22">{label}</div>
    </div>
  );
}
