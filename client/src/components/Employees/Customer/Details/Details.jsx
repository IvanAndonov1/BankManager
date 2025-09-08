import { useState } from "react";
import Sidebar from "../../../common/Sidebar";
import EmployeeHeader from "../../../common/EmployeeHeader";
import InfoRow from "./InfoRow";
import Balance from "./Balance";
import Tab from "./Tab";
import ProfileForm from "./ProfileForm";
import LoansPlaceholder from "./LoansPlaceholder";
import RequestsPlaceholder from "./RequestPlaceholder";

export default function CustomerMoreInfo() {
	const [tab, setTab] = useState("profile");

	const customer = {
		fullName: "Full Name",
		username: "Username",
		dob: "4.09.2003",
		email: "example1@gmail.com",
		phone: "+359 123 456 789",
		address: "Main Street 123",
		egn: "**********",
		balances: { debit: "5087,67 EUR", credit: "2034,62 EUR" },
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
								<h3 className="text-gray-900 font-semibold">{customer.fullName}</h3>
								<p className="text-gray-500 text-sm">{customer.username}</p>
							</div>
						</div>

						<div className="mt-6 space-y-3 text-sm">
							<InfoRow label="Date of Birth" value={customer.dob} />
							<InfoRow label="Email Address" value={customer.email} />
							<InfoRow label="Phone Number" value={customer.phone} />
							<InfoRow label="Home Address" value={customer.address} />
						</div>

						<div className="my-6 border-t" />

						<div className="space-y-6">
							<Balance
								title="Balance - Debit"
								value={customer.balances.debit}
								valueClass="text-[#351F78]"
							/>
							<Balance
								title="Balance - Credit"
								value={customer.balances.credit}
								valueClass="text-[#3a4fb6]"
							/>
						</div>

						<div className="mt-6 pt-6 border-t text-center">
							<button
								className="text-[#e11d48] font-medium hover:underline"
								type="button"
							>
								Request Report
							</button>
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
							{tab === "profile" && <ProfileForm customer={customer} />}
							{tab === "loans" && <LoansPlaceholder />}
							{tab === "requests" && <RequestsPlaceholder />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}