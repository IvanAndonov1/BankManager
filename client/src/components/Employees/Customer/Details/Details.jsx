import { use, useEffect, useState } from "react";
import Sidebar from "../../../common/Sidebar";
import EmployeeHeader from "../../../common/EmployeeHeader";
import InfoRow from "./InfoRow";
import Balance from "./Balance";
import Tab from "./Tab";
import ProfileForm from "./ProfileForm";
import LoansPlaceholder from "./LoansPlaceholder";
import RequestsPlaceholder from "./RequestPlaceholder";
import { AuthContext } from "../../../../contexts/AuthContext";
import { getUserAccount, getUserDetails } from "../../../../services/userService";
import { Link, useParams } from "react-router";
import { getAllLoanDetails } from "../../../../services/employeeService";

export default function CustomerMoreInfo() {
	const { userId } = useParams();
	const [tab, setTab] = useState("profile");
	const { user } = use(AuthContext);
	const [userDetails, setUserDetails] = useState({});
	const [userAccount, setUserAccount] = useState([]);
	const [loanDetails, setLoanDetails] = useState([]);

	useEffect(() => {
		getUserDetails(user.token, userId)
			.then(result => setUserDetails(result));

		getUserAccount(userId, user.token)
			.then(result => setUserAccount(result));


		getAllLoanDetails(user.token)
			.then(result => setLoanDetails(result));
	}, [user]);

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<EmployeeHeader />

				<div className="flex gap-6">
					<div className="w-96 shrink-0 bg-white rounded-2xl shadow-md p-6">
						<div className="flex flex-col items-center text-center">
							<div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
							<div className="space-y-0.5">
								<h3 className="text-gray-900 font-semibold">{userDetails.firstName} {userDetails.lastName}</h3>
								<p className="text-gray-500 text-sm">{userDetails.username}</p>
							</div>
						</div>

						<div className="mt-6 space-y-3 text-sm">
							<InfoRow label="Date of Birth" value={userDetails.dateOfBirth} />
							<InfoRow label="Email Address" value={userDetails.email} />
							<InfoRow label="Phone Number" value={userDetails.phoneNumber} />
							<InfoRow label="Home Address" value={userDetails.homeAddress} />
						</div>

						<div className="my-6 border-t" />

						<div className="space-y-6">
							{userAccount.length
								?
								userAccount.map(x => (
									<Balance
										key={x.accountNumber}
										title="Balance - Debit"
										value={`${x.balance} EUR`}
										valueClass="text-[#351F78]"
									/>
								))
								: null
							}
						</div>

						<div className="mt-6 pt-6 border-t text-center">
							<Link
								to={`/request/report/${userId}`}
								className="text-[#e11d48] font-medium hover:underline"
								type="button"
							>
								Request Report
							</Link>
						</div>
					</div>

					<div className="flex-1 min-w-0 bg-white rounded-2xl shadow-md overflow-hidden">
						<div className="px-6 pt-4">
							<div className="flex gap-8 text-sm">
								<Tab label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
								<Tab label="Loans" active={tab === "loans"} onClick={() => setTab("loans")} />
								<Tab
									label="Loan Requests"
									active={tab === "requests"}
									onClick={() => setTab("requests")}
								/>
							</div>
						</div>
						<div className="mt-3 border-t" />

						<div className="p-6">
							{tab === "profile" && <ProfileForm key={userDetails.id} customer={userDetails} />}
							{tab === "loans" && <LoansPlaceholder loanDetails={loanDetails} />}
							{tab === "requests" && <RequestsPlaceholder applicationDetails={loanDetails} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}