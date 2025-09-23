import { fmtMoney } from "../../../../utils/utils";
import Fact from "./Fact";

function LoanFacts({ application }) {
	return (
		<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
			<Fact label="Status" value={application.status} />
			<Fact label="Recommendation" value={application.recommendation} />
			<Fact label="Credit Score" value={application.creditScore} />
			<Fact label="Requested Amount" value={fmtMoney(application.requestedAmount, application.currency)} />
			<Fact label="Term" value={`${application.termMonths} months`} />
			<Fact label="Nominal APR" value={`${(application.nominalAnnualRate * 100).toFixed(1)}%`} />
			<Fact label="Monthly Payment" value={fmtMoney(application.monthlyPayment, application.currency)} />
			<Fact label="Total Payable" value={fmtMoney(application.totalPayable, application.currency)} />
			<Fact label="Target Account" value={application.targetAccountNumber} />
			<Fact label="Net Salary" value={fmtMoney(application.netSalary, application.currency)} />
			<Fact label="Decided At" value={new Date(application.decidedAt).toLocaleString()} />
			<Fact label="Disbursed At" value={new Date(application.disbursedAt).toLocaleString()} />
		</div>
	);
}

export default LoanFacts;