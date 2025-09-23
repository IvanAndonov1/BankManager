import LineSlider from "./LineSlider";
import { useEffect, useState } from "react";
import { getLoanQuote } from "../../../services/loanService";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export default function LoanModal({ onClose }) {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState("Customer");
  const [loanResult, setLoanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [requestedAmount, setRequestedAmount] = useState(5000);
  const [termMonths, setTermMonths] = useState(24);
  const [income, setIncome] = useState("over");

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const calculateLoan = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = {
        customerId: 1, 
        requestedAmount: Number(requestedAmount),
        termMonths: Number(termMonths),
        currentJobStartDate: "2020-01-01", 
        netSalary: income === "over" ? 1500 : 700
      };

      const result = await getLoanQuote(data, user.token); 
      setLoanResult(result);
      setStep(2); 
    } catch (err) {
      setError(err.message || "Failed to calculate loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[500px]"
      onClick={e => e.stopPropagation()} >
        {/* STEP 1 - Loan selection */}
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

            {/* Loan Amount */}
            <LineSlider
              sliderName="Loan Amount"
              details="EUR"
              min={500}
              max={50000}
              value={requestedAmount}
              onChange={(val) => setRequestedAmount(val)}
            />
            <div className="w-full flex justify-between items-center">
              <p className="text-sm">500 EUR</p>
              <p className="text-sm text-right">50 000 EUR</p>
            </div>

            {/* Loan Term */}
            <LineSlider
              sliderName="Loan Term"
              details="months"
              min={6}
              max={120}
              value={termMonths}
              onChange={(val) => setTermMonths(val)}
            />
            <div className="w-full flex justify-between items-center">
              <p className="text-sm">6 month</p>
              <p className="text-sm text-right">120 month</p>
            </div>

            {/* Monthly Income */}
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

            {/* Calculate Button */}
            <div className="flex justify-center mt-12">
              <button
                onClick={calculateLoan}
                className="rounded-3xl bg-[#351f78] px-12 py-2 text-white"
              >
                Calculate
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
          </>
        )}

        {/* STEP 2 - Loan results */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center h-full">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : loanResult ? (
              <>
                <div className="w-full mb-4 rounded-3xl flex items-center justify-center gap-24 border border-gray-300 shadow-lg pt-4">
                  <h2 className="text-xl font-semibold text-gray-500 mb-4">
                    Monthly Payment
                  </h2>
                  <p className="text-xl font-bold text-[#351f78] mb-4">
                    {loanResult.monthlyPayment.toFixed(2)} {loanResult.currency}
                  </p>
                </div>

                <div className="w-full my-4 flex items-center justify-center gap-24">
                  <p className="text-gray-600">Monthly fee for current account</p>
                  <p className="text-gray-600 text-xl font-bold">2.30 EUR</p>
                </div>

                <div className="w-full my-4 flex items-center justify-center gap-24">
                  <p className="text-gray-600">Indicative variable interest rate</p>
                  <p className="text-gray-600 text-xl font-bold">
                    {(loanResult.annualRate * 100).toFixed(2)} %
                  </p>
                </div>

                <div className="w-full my-4 pt-18 flex items-center justify-center gap-24">
                  <p className="text-gray-600">Total Amount Due</p>
                  <p className="text-gray-600 text-xl font-bold">
                    {loanResult.totalPayable.toFixed(2)} {loanResult.currency}
                  </p>
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
                    Continue
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* STEP 3 - Personal info (left as in your code) */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <form className="w-full max-w-md">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label> 
                </div>
                </form>
          </div>
        )}

        {/* Close button */}
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
