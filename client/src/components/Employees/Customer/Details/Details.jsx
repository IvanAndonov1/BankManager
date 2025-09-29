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
import { useParams } from "react-router";
import { getAllLoanDetails } from "../../../../services/employeeService";
import { depositMoney, withdrawMoney } from "../../../../services/transferService";

export default function CustomerMoreInfo() {
	const { userId } = useParams();
	const [tab, setTab] = useState("profile");
	const { user } = use(AuthContext);
	const [userDetails, setUserDetails] = useState({});
	const [userAccount, setUserAccount] = useState([]);
	const [loanDetails, setLoanDetails] = useState([]);
	const [amount, setAmount] = useState(50);
	const [v, setV] = useState(0);
	const [pendingBalances, setPendingBalances] = useState([]);


	useEffect(() => {
		getUserDetails(user.token, userId)
			.then((result) => setUserDetails(result));

		getUserAccount(userId, user.token).then((accounts) => {
			setUserAccount(accounts);
			setPendingBalances(accounts.map(acc => ({ ...acc })));
		});

		getAllLoanDetails(user.token, userId).then((result) =>
			setLoanDetails(result)

		);
	}, [user]);

	const handleIncrement = (accountNumber) => {
		setPendingBalances(prev =>
			prev.map(acc =>
				acc.accountNumber === accountNumber
					? { ...acc, balance: acc.balance + amount }
					: acc
			)
		);
	};


	const handleDecrement = (accountNumber) => {
		setPendingBalances(prev =>
			prev.map(acc =>
				acc.accountNumber === accountNumber
					? { ...acc, balance: acc.balance - amount }
					: acc
			)
		);
	};


	const handleUpdate = async () => {
		try {
			for (let i = 0; i < userAccount.length; i++) {
				const original = userAccount[i];
				const pending = pendingBalances[i];
				const diff = pending.balance - original.balance;

				if (diff > 0) {
					depositMoney(original.accountNumber, user.token, diff, "Employee deposit");
				} else if (diff < 0) {
					withdrawMoney(original.accountNumber, user.token, -diff, "Employee withdraw");
				}
			}

			const updated = await getUserAccount(userId, user.token);
			console.log(updated);
			
			setUserAccount(updated);
			setPendingBalances(updated.map(acc => ({ ...acc })));
			alert("Balances updated successfully");

			setV(x => x + 1);
		} catch (err) {
			console.error(err);
			alert(err.message || "Update failed");
		}
	};

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
								<h3 className="text-gray-900 font-semibold">
									{userDetails.firstName} {userDetails.lastName}
								</h3>
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
							<div className="flex flex-col items-center justify-center gap-16 mt-10">

								{pendingBalances.length
									? pendingBalances.map(x => (
										<div key={x.accountNumber} className="flex items-center gap-6">
											<button
												type="button"
												aria-label="decrease"
												onClick={() => handleDecrement(x.accountNumber)}
												className="cursor-pointer w-12 h-12 pb-2 rounded-full ring-2 ring-[#351F78] 
                       text-[#351F78] text-3xl flex items-center justify-center"
											>
												-
											</button>
											<Balance

												title="Balance - Debit"
												value={`${x.balance} EUR`}
												valueClass="text-[#351F78]"
											/>
											<button
												type="button"
												aria-label="increase"
												onClick={() => handleIncrement(x.accountNumber)}
												className="cursor-pointer w-12 h-12 pb-2 rounded-full ring-2 ring-[#351F78] 
                       text-[#351F78] text-3xl flex items-center justify-center"
											>
												+
											</button>
										</div>
									))
									: null}
							</div>



							<button
								onClick={handleUpdate}
								className="w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl transition-colors duration-300">
								Update
							</button>
						</div>

						{/* <div className="mt-6 pt-6 border-t text-center">
							<Link
								to={`/request/report/${userId}`}
								className="text-[#e11d48] font-medium hover:underline"
								type="button"
							>
								Request Report
							</Link>
						</div> */}
					</div>

					<div key={v} className="flex-1 min-w-0 bg-white rounded-2xl shadow-md overflow-hidden">
						<div className="px-6 pt-4">
							<div className="flex gap-8 text-sm">
								<Tab
									label="Profile"
									active={tab === "profile"}
									onClick={() => setTab("profile")}
								/>
								<Tab
									label="Loans"
									active={tab === "loans"}
									onClick={() => setTab("loans")}
								/>
								<Tab
									label="Loan Requests"
									active={tab === "requests"}
									onClick={() => setTab("requests")}
								/>
							</div>
						</div>
						<div className="mt-3 border-t" />

						<div className="p-6">
							{tab === "profile" && (
								<ProfileForm
									key={userDetails.id}
									customer={userDetails}
									setUserDetails={setUserDetails}
								/>
							)}
							{tab === "loans" && (
								<LoansPlaceholder loanDetails={loanDetails} />
							)}
							{tab === "requests" && (
								<RequestsPlaceholder
									applicationDetails={loanDetails}
									changeTab={setTab}
									changeLoans={setLoanDetails}
									userDetails={userDetails}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
