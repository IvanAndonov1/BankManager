import CustomerSidebar from "../../common/CustomerSidebar";
import LoansSection from "./LoansSection";
import { use, useEffect, useState, useCallback } from "react";
import Modal from "./LoanModal";
import { AuthContext } from "../../../contexts/AuthContext";
import { getLoanApplications } from "../../../services/loanService";
import AiChatBot from "../../common/aiChatBot";

const fmtMoney = (n, cur = "EUR") =>
	typeof n === "number"
		? `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`
		: "—";
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

function Fact({ label, value }) {
	return (
		<div className="rounded-lg border border-gray-200 px-3 py-2 bg-white/60">
			<div className="text-gray-500 text-xs uppercase tracking-wide">{label}</div>
			<div className="text-gray-800 font-medium break-words">{value ?? "—"}</div>
		</div>
	);
}

const calculateMonthlyPayment = (principal, termMonths, annualRate = 0.12) => {
	if (!principal || !termMonths) return null;
	const monthlyRate = annualRate / 12;
	const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
		(Math.pow(1 + monthlyRate, termMonths) - 1);
	return payment;
};

const addMonths = (date, months) => {
	const result = new Date(date);
	result.setMonth(result.getMonth() + months);
	return result.toISOString();
};

export default function Loans() {
	const { user } = use(AuthContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loans, setLoans] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchLoans = useCallback(async () => {
		if (!user?.token) return;
		try {
			setLoading(true);
			const res = await getLoanApplications(user.token);
			setLoans(Array.isArray(res) ? res : []);
		} finally {
			setLoading(false);
		}
	}, [user?.token]);

	useEffect(() => {
		fetchLoans();
	}, [fetchLoans]);

	return (
		<div className="min-h-screen flex bg-white">
			<CustomerSidebar />
			<AiChatBot />
			<div className="flex-1 items-center justify-center p-12 space-y-12 ml-24">
				<div className="w-full flex justify-between items-center">
					<h2 className="text-2xl font-bold mb-4">Your Credits</h2>
					<button
						className="bg-[#351f78] text-white px-10 py-2 rounded-3xl"
						onClick={() => setIsModalOpen(true)}
						disabled={loans.some((l) => l.status === "PENDING")}
					>
						Request Loan
					</button>
					<Modal
						isOpen={isModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							fetchLoans();
						}}
					/>
				</div>

				{loading ? (
					<div className="rounded-2xl border p-6 text-gray-500">Loading…</div>
				) : loans.length === 0 ? (
					<div className="rounded-2xl border p-6 text-gray-500">
						No loan applications yet.
					</div>
				) : (
					loans
						.sort(
							(a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
						)
						.map((loan, idx) => {
							const currency = loan.currency || "EUR";

							const monthlyPayment = loan.status === "APPROVED" ?
								calculateMonthlyPayment(loan.requestedAmount, loan.termMonths) : null;

							const totalPayable = monthlyPayment ?
								monthlyPayment * loan.termMonths : null;

							const remainingAmount = loan.status === "APPROVED" ?
								loan.requestedAmount : null;

							const nextPaymentDate = loan.status === "APPROVED" ?
								addMonths(loan.createdAt, 1) : null;

							const summary = {
								productName: "Consumer Loan",
								remainingAmount,
								currency,
								nextPaymentDate,
								nextPaymentAmount: monthlyPayment,
								creditAmount: loan.requestedAmount,
								contractNo: `${String(loan.requestedAmount).slice(-3)}-${loan.termMonths}`,
								termMonths: loan.termMonths,
								createdAt: loan.createdAt
							};

							return (
								<div key={idx} className="space-y-4">
									<LoansSection
										summary={summary}
										loading={loading}
										status={loan.status}
									/>

									{loan.status === "APPROVED" || loan.status === "PENDING" ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
											<Fact label="Status" value={loan.status} />
											<Fact
												label="Requested Amount"
												value={fmtMoney(loan.requestedAmount, currency)}
											/>
											<Fact
												label="Term"
												value={`${loan.termMonths} months`}
											/>
											{monthlyPayment && (
												<Fact
													label="Monthly Payment"
													value={fmtMoney(monthlyPayment, currency)}
												/>
											)}
											{totalPayable && (
												<Fact
													label="Total Payable"
													value={fmtMoney(totalPayable, currency)}
												/>
											)}
											<Fact label="Created At" value={fmtDate(loan.createdAt)} />
											<Fact label="Updated At" value={fmtDate(loan.updatedAt)} />
											{loan.evaluation?.creditScore && (
												<Fact
													label="Credit Score"
													value={loan.evaluation.creditScore}
												/>
											)}
											{loan.evaluation?.percentageOfMax && (
												<Fact
													label="Approval %"
													value={`${loan.evaluation.percentageOfMax}%`}
												/>
											)}
										</div>
									) : (
										<div className="w-2/3 rounded-2xl border border-red-300 bg-red-50 p-4">
											<h3 className="text-lg font-semibold text-red-600 mb-2">
												Decline Reasons
											</h3>
											<ul className="list-disc list-inside text-red-700 space-y-1">
												{(loan.reasons || []).map((r, i) => (
													<li key={i}>{r}</li>
												))}
											</ul>
											<p className="text-xs text-gray-500 mt-2">
												Updated at {fmtDate(loan.updatedAt)}
											</p>
										</div>
									)}
								</div>
							);
						})
				)}
			</div>
		</div>
	);
}