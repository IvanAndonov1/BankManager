import LineSlider from "./LineSlider";
import { useEffect } from "react";

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

      <div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[500px]">
        <div className="w-full flex justify-center gap-12">
          <button className="text-lg text-white rounded-2xl font-semibold bg-[#351f78] hover:bg-white px-6 py-4 mb-4 text-center transition-colors duration-300">
            Customer Loan
          </button>
          <button className="text-lg text-[#351f78] rounded-2xl font-semibold px-6 py-4 mb-4 text-center border-2 border-[#351f78] hover:bg-[#351f78]">
            Other Loan
          </button>
        </div>

        <LineSlider />
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">500 EUR</p>
          <p className="text-sm text-right">100 000 EUR</p>
        </div>
        <LineSlider />
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">6 month</p>
          <p className="text-sm text-right">120 month</p>
        </div>

        <div className="w-full flex justify-between items-center mt-8">
          <h3 className="font-normal ml-6 ">Monthly Income</h3>
          <button className="rounded-3xl bg-[#351f78] text-white px-4 py-2 hover:bg-white hover:text-[#351f78]">
            Over 800 EUR
          </button>
          <button className="rounded-3xl border border-[#351F78] px-4 py-2 text-[#351f78] ">
            Under 800 EUR
          </button>
        </div>

        <div className="flex justify-center mt-12">
          <button className="rounded-3xl  bg-[#351f78] px-12 py-2 text-white ">
            Calculate
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
