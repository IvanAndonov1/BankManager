import Sidebar from "../../common/Sidebar";
import UserHeader from "../../common/UserHeader";
import FilterCard from "../../common/FilterCard";
import DataTable from "../../common/DataTable";
import EmployeeTableRow from "../../Employees/Dashboard/EmployeeTableRow";

export default function AdminDashboard() {
	let data = { name: 'Admin User', date: '05/01/2021', status: 'active' };

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Admin" email="admin@company.com" />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard />
				</div>

				<DataTable headers={["User", "Date", "Status", "Details"]}>
					<EmployeeTableRow {...data} detailsTo="/admin/employee/1" />
					<EmployeeTableRow {...data} detailsTo="/admin/employee/2" />
					<EmployeeTableRow {...data} detailsTo="/admin/employee/3" />
				</DataTable>
			</div>
		</div>
	);
} 