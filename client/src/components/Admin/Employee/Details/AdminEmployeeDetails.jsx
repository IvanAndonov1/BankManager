import { use, useEffect, useState } from "react";
import Sidebar from "../../../common/Sidebar";
import UserHeader from "../../../common/UserHeader";
import ProfileCard from "../../../common/ProfileCard";
import Tabs from "../../../common/Tabs";
import ProfileTab from "./ProfileTab";
import SalaryTab from "./SalaryTab";
import SalaryHistoryTab from "./SalaryHistoryTab";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router";
import { fireEmployee, getEmployeeById, promoteEmployee } from "../../../../services/adminService";

export default function AdminEmployeeDetails() {
	const navigate = useNavigate();
	const { employeeId } = useParams();
	const [tab, setTab] = useState("profile");
	const { user } = use(AuthContext);
	const [employee, setEmployeeDetails] = useState({});

	useEffect(() => {
		getEmployeeById(employeeId, user.token)
			.then(result => setEmployeeDetails(result));
	}, [employeeId, user.token]);

	function promoteAccount() {
		promoteEmployee(employeeId, user.token)
			.then(() => navigate('/admin'));
	}

	function demoteAccount() {
		fireEmployee(employeeId, user.token)
			.then(() => navigate('/admin'));
	}

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />
			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Admin" email={user.username} />
				<div className="flex gap-6">
					<ProfileCard
						title={employee.fullName}
						subtitle={employee.username}
						footerActionLabel="Remove Account"
						employee={employee}
						promoteAccount={promoteAccount}
						demoteAccount={demoteAccount}
					/>
					<div className="flex-1 min-w-0 bg-white rounded-2xl shadow-md overflow-hidden">
						<Tabs items={[{ key: "profile", label: "Profile" }, { key: "salary", label: "Salary" }]} activeKey={tab} onChange={setTab} />
						<div className="mt-3 border-t" />
						{tab === "profile" && <ProfileTab key={employee.username} employee={employee} setter={setEmployeeDetails} />}
						{tab === "salary" && <SalaryTab value={employee.salary} employee={employee} setter={setEmployeeDetails} />}
						{/* {tab === "history" && <SalaryHistoryTab />} */}
					</div>
				</div>
			</div>
		</div>
	);
} 