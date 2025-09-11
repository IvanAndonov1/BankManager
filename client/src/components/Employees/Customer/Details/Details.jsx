import { useState } from "react";
import Sidebar from "../../../common/Sidebar";
import UserHeader from "../../../common/UserHeader";
import ProfileCard from "../../../common/ProfileCard";
import Tabs from "../../../common/Tabs";
import Balance from "./Balance";
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

	const info = [
		{ label: "Date of Birth", value: customer.dob },
		{ label: "Email Address", value: customer.email },
		{ label: "Phone Number", value: customer.phone },
		{ label: "Home Address", value: customer.address },
	];

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Accounts" email="employee_1@company.com" />

				<div className="flex gap-6">
					<div>
						<ProfileCard title={customer.fullName} subtitle={customer.username} info={info} footerActionLabel="Request Report" />

						<div className="my-6 border-t" />

						<div className="space-y-6">
							<Balance title="Balance - Debit" value={customer.balances.debit} valueClass="text-[#351F78]" />
							<Balance title="Balance - Credit" value={customer.balances.credit} valueClass="text-[#3a4fb6]" />
						</div>
					</div>

					<div className="flex-1 min-w-0 bg-white rounded-2xl shadow-md overflow-hidden">
						<Tabs
							items={[
								{ key: "profile", label: "Profile" },
								{ key: "loans", label: "Loans" },
								{ key: "requests", label: "Loan Requests" },
							]}
							activeKey={tab}
							onChange={setTab}
						/>
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