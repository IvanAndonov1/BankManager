import UserHeader from "../../common/UserHeader";
import FilterCard from "../../common/FilterCard";
import Sidebar from "../../common/Sidebar";
import EmployeeTableRow from "./EmployeeTableRow";
import DataTable from "../../common/DataTable";

export default function EmployeeDashboard() {
	let data = { name: 'Name 1', date: '04/12/2020', status: 'active' };

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Accounts" email="employee_1@company.com" />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard />
				</div>

				<DataTable headers={["Customer", "Date", "Status", "Details"]}>
					<EmployeeTableRow {...data} detailsTo="/customer-details/1" />
					<EmployeeTableRow {...data} detailsTo="/customer-details/2" />
					<EmployeeTableRow {...data} detailsTo="/customer-details/3" />
					<EmployeeTableRow {...data} detailsTo="/customer-details/4" />
					<EmployeeTableRow {...data} detailsTo="/customer-details/5" />
				</DataTable>
			</div>
		</div>
	);
}
