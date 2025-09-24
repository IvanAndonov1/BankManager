import { use, useMemo, useState } from "react";
import { useParams } from "react-router";

import LoanHeader from "../Details Subcomponents/LoanHeader";
import CriteriaList from "../Details Subcomponents/CriteriaList";
import BarsChart from "../Details Subcomponents/BarsCharts";
import LoanFacts from "../Details Subcomponents/LoanFacts";
import ScoreRing from "../Details Subcomponents/ScoreRing";
import LoadingSkeleton from "../Details Subcomponents/LoadingSkeleton";
import EmptyState from "../Details Subcomponents/EmptyState";
import DeclineCreditModal from "../Details Subcomponents/DeclineCreditModal";

import { clamp0to100 } from "../../../../utils/utils.js";
import { approveCreditHandler, declineCreditHandler, getAllLoanDetails } from "../../../../services/employeeService.js";
import { AuthContext } from "../../../../contexts/AuthContext.jsx";

export default function RequestsPlaceholder({
	applications,
	applicationDetails,
	isLoading = false,
	customerId,
	changeTab,
	changeLoans
}) {
	const params = useParams?.() || {};
	const urlUserId = Number(params?.userId);
	const { user } = use(AuthContext);

	const apps = useMemo(() => {
		const src =
			(Array.isArray(applications) && applications.length > 0
				? applications
				: Array.isArray(applicationDetails)
					? applicationDetails.filter(x => x.status == 'PENDING')
					: []) || [];
		return src;
	}, [applications, applicationDetails]);

	const currentCustomerId = useMemo(() => {
		if (Number.isFinite(customerId)) return Number(customerId);
		if (Number.isFinite(urlUserId)) return urlUserId;
		return undefined;
	}, [customerId, urlUserId]);

	const [open, setOpen] = useState(false);
	const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
	const [isDeclineLoading, setIsDeclineLoading] = useState(false);

	const application = useMemo(() => {
		if (!apps || !apps.length || !Number.isFinite(currentCustomerId)) return undefined;
		const list = apps.filter(
			(x) => Number(x.customerId) === Number(currentCustomerId)
		);
		if (!list.length) return undefined;
		return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
	}, [apps, currentCustomerId]);

	const percent = clamp0to100(
		application?.percentageOfMax ?? application?.composite ?? 0
	);

	const pointsStr = application
		? `${application.accumulatedPoints}/${application.maxPossiblePoints}`
		: "";

	const criteria = useMemo(() => {
		if (!application) return [];
		return [
			{ key: "tenureScore", label: "Job Tenure", value: clamp0to100(application.tenureScore) },
			{ key: "dtiScore", label: "Debt-to-Income", value: clamp0to100(application.dtiScore) },
			{ key: "accountAgeScore", label: "Account Age", value: clamp0to100(application.accountAgeScore) },
			{ key: "cushionScore", label: "Cash Cushion", value: clamp0to100(application.cushionScore) },
			{ key: "recentDebtScore", label: "Recent Debt", value: clamp0to100(application.recentDebtScore) },
		];
	}, [application]);

	const showLoading = isLoading;
	const showNoData = !showLoading && (!apps || apps.length === 0);
	const showNoCustomerId = !showLoading && !showNoData && !Number.isFinite(currentCustomerId);
	const showNoApplication =
		!showLoading && !showNoData && Number.isFinite(currentCustomerId) && !application;

	const showHeader =
		!showLoading &&
		!showNoData &&
		Number.isFinite(currentCustomerId) &&
		!!application;

	function approveCredit(e) {
		e.preventDefault();
		approveCreditHandler(application.id, user.token, { "approve": true })
			.then(() => {
				getAllLoanDetails(user.token, urlUserId)
					.then((result) => {
						changeLoans(result);
						changeTab('loans');
					});
			});
	}

	function showDeclineModal(e) {
		e.preventDefault();
		setIsDeclineModalOpen(true);
	}

	function handleDeclineCredit(reasons) {
		setIsDeclineLoading(true);

		declineCreditHandler(application.id, user.token, {
			"approve": false,
			reasons: reasons
		})
			.then(() => {
				getAllLoanDetails(user.token, urlUserId)
					.then((result) => {
						changeLoans(result);
						changeTab('loans');
						setIsDeclineModalOpen(false);
					});
			})
			.finally(() => {
				setIsDeclineLoading(false);
			});
	}

	function closeDeclineModal() {
		if (!isDeclineLoading) {
			setIsDeclineModalOpen(false);
		}
	}

	return (
		<div className="space-y-8">
			{showHeader && (
				<LoanHeader
					title="Customer Loan"
					open={open}
					onToggle={() => setOpen((v) => !v)}
					approveCredit={approveCredit}
					declineCredit={showDeclineModal}
				/>
			)}

			{showLoading && <LoadingSkeleton />}

			{showNoData && <EmptyState text="No loan applications data." />}

			{showNoCustomerId && (
				<EmptyState text="Missing customer id (no :userId in URL and no customerId prop)." />
			)}

			{showNoApplication && (
				<EmptyState text="No loan applications found for this customer." />
			)}

			{!showLoading && !showNoData && !showNoCustomerId && application && open && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-4">
					<div className="md:col-span-2">
						<CriteriaList criteria={criteria} passThreshold={50} />
						<BarsChart criteria={criteria} totalLabel={pointsStr} />
						<LoanFacts application={application} />
					</div>

					<div className="flex md:justify-center">
						<ScoreRing percent={percent} />
					</div>
				</div>
			)}

			<DeclineCreditModal
				isOpen={isDeclineModalOpen}
				onClose={closeDeclineModal}
				onDecline={handleDeclineCredit}
				isLoading={isDeclineLoading}
			/>
		</div>
	);
}