import { useState } from "react";
import Sidebar from "../../../common/Sidebar";
import UserHeader from "../../../common/UserHeader";
import ProfileCard from "../../../common/ProfileCard";
import Tabs from "../../../common/Tabs";
import ProfileTab from "./ProfileTab";
import SalaryTab from "./SalaryTab";
import SalaryHistoryTab from "./SalaryHistoryTab";

export default function AdminEmployeeDetails() {
	const [tab, setTab] = useState("profile");
	const employee = {
		fullName: "Full Name",
		username: "Username",
		dob: "4/09/2003",
		email: "example1@gmail.com",
		phone: "+359 123 456 789",
		address: "Main Street 123",
		position: "Loan Officer",
		employeeFrom: "12/07/2022",
		salary: "1500 EUR",
	};

	const info = [
		{ label: "Date of Birth", value: employee.dob },
		{ label: "Email Address", value: employee.email },
		{ label: "Phone Number", value: employee.phone },
		{ label: "Home Address", value: employee.address },
		{ label: "Position", value: employee.position },
		{ label: "Employee from", value: employee.employeeFrom },
		{ label: "Salary", value: employee.salary },
	];

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />
			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Admin" email="admin@company.com" />
				<div className="flex gap-6">
					<ProfileCard title={employee.fullName} subtitle={employee.username} info={info} footerActionLabel="Remove Account" />
					<div className="flex-1 min-w-0 bg-white rounded-2xl shadow-md overflow-hidden">
						<Tabs items={[{ key: "profile", label: "Profile" }, { key: "salary", label: "Salary" }, { key: "history", label: "Salary History" }]} activeKey={tab} onChange={setTab} />
						<div className="mt-3 border-t" />
						{tab === "profile" && <ProfileTab />}
						{tab === "salary" && <SalaryTab value={1500} />}
						{tab === "history" && <SalaryHistoryTab />}
					</div>
				</div>
			</div>
		</div>
	);
} 