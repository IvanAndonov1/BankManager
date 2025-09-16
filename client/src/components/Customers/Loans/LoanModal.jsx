import LineSlider from "./LineSlider";
import Field from "../../Employees/Customer/Details/Field";
import { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose}) {
    const [step, setStep] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState("Customer"); 
  const [income, setIncome] = useState(null); 
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const handleClose = () => {
    setStep(1);
    setSelectedLoan("Customer");
    setIncome(null);
    onClose?.(); // call parent onClose
  };

  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
     
      <div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[500px]">


          {step === 1 && (
          <>
        <div className="w-full flex justify-center gap-12">
          <button
            onClick={() => setSelectedLoan("Customer")}
            className={`text-lg rounded-2xl font-semibold border-2 px-6 py-4 mb-4 text-center transition-colors duration-300 ${
              selectedLoan === "Customer"
                ? "bg-[#351f78] text-white border-[#351f78]"
                : "text-[#351f78] border-[#351f78] hover:bg-[#351f78] hover:text-white"
            }`}
          >
            Customer Loan
          </button>
          <button
            onClick={() => setSelectedLoan("Other")}
            className={`text-lg rounded-2xl font-semibold border-2 px-6 py-4 mb-4 text-center transition-colors duration-300 ${
              selectedLoan === "Other"
                ? "bg-[#351f78] text-white border-[#351f78]"
                : "text-[#351f78] border-[#351f78] hover:bg-[#351f78] hover:text-white"
            }`}
          >
            Other Loan
          </button>
        </div>

        <LineSlider sliderName="Loan Amount" details="EUR" min={500} max={50000} defaultValue={50000} />
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">500 EUR</p>
          <p className="text-sm text-right">50 000 EUR</p>
        </div>
        <LineSlider sliderName="Loan Term" details="months" min={6} max={120} defaultValue={120}/>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">6 month</p>
          <p className="text-sm text-right">120 month</p>
        </div>

        <div className="w-full flex justify-between items-center mt-8">
          <h3 className="font-normal ml-6 ">Monthly Income</h3>
         <button
            onClick={() => setIncome("over")}
            className={`rounded-3xl border px-4 py-2 transition-colors duration-300 ${
              income === "over"
                ? "bg-[#351f78] text-white border-[#351f78]"
                : "text-[#351f78] border-[#351f78] hover:bg-[#351f78] hover:text-white"
            }`}
          >
            Over 800 EUR
          </button>
          <button
            onClick={() => setIncome("under")}
            className={`rounded-3xl border px-4 py-2 transition-colors duration-300 ${
              income === "under"
                ? "bg-[#351f78] text-white border-[#351f78]"
                : "text-[#351f78] border-[#351f78] hover:bg-[#351f78] hover:text-white"
            }`}
          >
            Under 800 EUR
          </button>
        </div>

        <div className="flex justify-center mt-12">
          <button 
          onClick={() => setStep(2)}
          className="rounded-3xl  bg-[#351f78] px-12 py-2 text-white ">
            Calculate
          </button>
        </div>
        </>
        )}

         {step === 2 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full mb-4 rounded-3xl flex items-center justify-center gap-24 border border-gray-300 shadow-lg pt-4">
            <h2 className="text-xl font-semibold text-gray-500 mb-4">
              Monthly Payment 
            </h2>
            <p className="text-xl font-bold text text-[#351f78] mb-4">915,33 EUR</p>
            </div>

            <div className="w-full my-4 flex items-center justify-center gap-24 ">
            <p className="text-gray-600">Monthly fee for current account</p>
            <p className="text-gray-600 text-xl font-bold">2.30 EUR</p>
            </div>

            <div className="w-full my-4 flex items-center justify-center gap-24 ">
            <p className="text-gray-600">Indicative variable interest rate</p>
            <p className="text-gray-600 text-xl font-bold">5.40 %</p>
            </div>

             <div className="w-full my-4 pt-18 flex items-center justify-center gap-24 ">
            <p className="text-gray-600">Total Amount Due</p>
            <p className="text-gray-600 text-xl font-bold">36 705.20 EUR</p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="rounded-3xl border border-[#351f78] px-8 py-2 text-[#351f78] hover:bg-[#351f78] hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="rounded-3xl bg-[#351f78] px-8 py-2 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

         {step === 3 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full mb-4 rounded-3xl flex items-center justify-center gap-24 border border-gray-300 shadow-lg pt-4">
            <h2 className="text-xl font-semibold text-gray-500 mb-4">
              Monthly Payment 
            </h2>
            <p className="text-xl font-bold text text-[#351f78] mb-4">915,33 EUR</p>
            </div>

            <div className="w-full mb-4 flex items-center justify-center gap-24">
            <Field label="First Name" />
            <Field label="Last Name" />
            </div>

               
            <div className="w-full mb-4 flex items-center justify-center gap-24">
            <Field label="Date of Birth" />
            <Field label="Work Experience" />
            </div>

              <div className="w-full mb-4 flex items-center justify-center gap-24">
            <div className="w-full mt-4">
              <p className="mb-4 font-light text-sm">Upload ID (front)</p>
            <button className="bg-[#351f78] text-white rounded-full px-6 py-2" > Choose File </button>
            </div>

            <div className="w-full mt-4">
              <p className="mb-4 font-light text-sm">Upload ID (back)</p>
            <button  className="bg-[#351f78] text-white rounded-full px-6 py-2" > Choose File </button>
            </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="rounded-3xl border border-[#351f78] px-8 py-2 text-[#351f78] hover:bg-[#351f78] hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleClose}
                className="rounded-3xl bg-[#351f78] px-8 py-2 text-white"
              >
                Finish
              </button>
            </div>
          </div>
        )}

       

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
