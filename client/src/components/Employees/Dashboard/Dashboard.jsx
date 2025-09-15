import UserHeader from "../../common/UserHeader";
import FilterCard from "../../common/FilterCard";
import Sidebar from "../../common/Sidebar";
import EmployeeTableRow from "./EmployeeTableRow";
import DataTable from "../../common/DataTable";
import { use, useEffect, useState } from "react";
import { getAllCustomers } from "../../../services/employeeService";
import { AuthContext } from "../../../contexts/AuthContext";

export default function EmployeeDashboard() {
	const { user } = use(AuthContext);
	const [customers, setCustomers] = useState([]);

	useEffect(() => {
		getAllCustomers(user.token)
			.then(result => {
				setCustomers(result);
			});
	}, []);

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Accounts" email="employee_1@company.com" />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard />
				</div>

				<DataTable headers={["Customer", "Date", "Status", "Details"]}>
					{customers.map(x => (
						<EmployeeTableRow {...x} key={x.id} detailsTo="/customer-details/1" />
					))}
				</DataTable>
			</div>
		</div>
	);
}
