import { AuthContext } from "../../../contexts/AuthContext";
import { getLoanQuote, submitLoanApplication } from "../../../services/loanService";
import LineSlider from "./LineSlider";
import { use, useEffect, useState } from "react";

export default function LoanModal({ isOpen, onClose }) {
	const { user } = use(AuthContext);
	const [step, setStep] = useState(1);
	const [selectedLoan, setSelectedLoan] = useState("Customer");

	const [requestedAmount, setRequestedAmount] = useState(5000);
	const [termMonths, setTermMonths] = useState(24);

	const [loanResult, setLoanResult] = useState(null);

	const [currentJobStartDate, setCurrentJobStartDate] = useState("");
	const [netSalary, setNetSalary] = useState("");
	const [targetAccountNumber, setTargetAccountNumber] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const onEsc = (e) => e.key === "Escape" && handleClose();
		document.addEventListener("keydown", onEsc);
		return () => document.removeEventListener("keydown", onEsc);
	}, []);

	const handleClose = () => {
		setStep(1);
		setSelectedLoan("Customer");

		setRequestedAmount(5000);
		setTermMonths(24);

		setLoanResult(null);

		setCurrentJobStartDate("");
		setNetSalary("");
		setTargetAccountNumber("");

		setLoading(false);
		setError(null);
		onClose?.();
	};

	const calculateLoan = async () => {
		setLoading(true);
		setError(null);

		const payload = {
			requestedAmount,
			termMonths,
		};

		try {
			const response = await getLoanQuote(payload, user.token);
			setLoanResult(response);
			setStep(2);
		} catch (err) {
			console.error(err);
			setError(err.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	const isProbablyBGIban = (val) => /^BG[0-9A-Z]{20,30}$/i.test((val || "").replace(/\s+/g, ""));

	const handleFinalSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!currentJobStartDate) {
			setError("Please enter your current job start date.");
			return;
		}
		if (!netSalary || Number(netSalary) <= 0) {
			setError("Please enter a valid net salary.");
			return;
		}
		if (!targetAccountNumber || !isProbablyBGIban(targetAccountNumber)) {
			setError("Please enter a valid target account IBAN (e.g., BG80...).");
			return;
		}

		const fullPayload = {
			requestedAmount: Number(requestedAmount),
			termMonths: Number(termMonths),
			currentJobStartDate,
			netSalary: Number(netSalary),
			targetAccountNumber: targetAccountNumber.replace(/\s+/g, ""),
		};

		try {
			setLoading(true);
			await submitLoanApplication(fullPayload, user.token);
			handleClose();
		} catch (err) {
			setError(err.message || "Failed to submit the loan application.");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div
				className="absolute inset-0 bg-black opacity-50"
				onClick={handleClose}
			></div>

			<div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[500px]">
				<button
					className="absolute mr-2 top-2 right-2 text-gray-600 hover:text-black"
					onClick={handleClose}
					aria-label="Close"
					title="Close"
				>
					✕
				</button>

				{step === 1 && (
					<>
						<div className="w-full flex justify-center gap-12">
							<button
								onClick={() => setSelectedLoan("Customer")}
								className={`text-lg rounded-2xl font-semibold border-2 px-6 py-4 mb-4 text-center transition-colors duration-300 ${selectedLoan === "Customer"
									? "bg-[#351f78] text-white border-[#351f78]"
									: "text-[#351f78] border-[#351f78] hover:bg-[#351f78] hover:text-white"
									}`}
							>
								Customer Loan
							</button>
							<button
								onClick={() => setSelectedLoan("Other")}
								className={`text-lg rounded-2xl font-semibold border-2 px-6 py-4 mb-4 text-center transition-colors duration-300 ${selectedLoan === "Other"
									? "bg-[#351f78] text-white border-[#351f78]"
									: "text-[#351f78] border-[#351f78] hover:bg-[#351f78] hover:text-white"
									}`}
							>
								Other Loan
							</button>
						</div>

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

				{step === 3 && (
					<div className="flex flex-col items-center justify-center h-full">
						<h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

						<form className="w-full max-w-md" onSubmit={handleFinalSubmit}>
							<div className="mb-4">
								<label className="block text-gray-700 mb-2" htmlFor="jobStart">
									Current Job Start Date
								</label>
								<input
									id="jobStart"
									type="date"
									value={currentJobStartDate}
									onChange={(e) => setCurrentJobStartDate(e.target.value)}
									className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#351f78]"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 mb-2" htmlFor="netSalary">
									Net Salary (EUR)
								</label>
								<input
									id="netSalary"
									type="number"
									min="0"
									step="0.01"
									placeholder="e.g., 2000.00"
									value={netSalary}
									onChange={(e) => setNetSalary(e.target.value)}
									className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#351f78]"
									required
								/>
							</div>

							<div className="mb-2">
								<label className="block text-gray-700 mb-2" htmlFor="iban">
									Target Account Number (IBAN)
								</label>
								<input
									id="iban"
									type="text"
									placeholder="BG80BNBG96614314017626"
									value={targetAccountNumber}
									onChange={(e) => setTargetAccountNumber(e.target.value)}
									className="w-full border rounded-xl px-4 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#351f78]"
									required
								/>
							</div>

							<p className="text-xs text-gray-500 mb-4">
								We'll use your job start date and salary to assess your eligibility. Make sure the IBAN is correct to receive the funds.
							</p>

							{error && (
								<p className="text-red-500 text-center mb-3">{error}</p>
							)}

							<div className="flex gap-4 justify-center mt-2">
								<button
									type="button"
									onClick={() => setStep(2)}
									className="rounded-3xl border border-[#351f78] px-8 py-2 text-[#351f78] hover:bg-[#351f78] hover:text-white"
								>
									Back
								</button>
								<button
									type="submit"
									disabled={loading}
									className="rounded-3xl bg-[#351f78] px-8 py-2 text-white disabled:opacity-70"
								>
									{loading ? "Submitting..." : "Submit Application"}
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
