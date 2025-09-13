import UserHeader from "../../common/UserHeader";
import FilterCard from "../../common/FilterCard";
import Sidebar from "../../common/Sidebar";
import EmployeeTableRow from "./EmployeeTableRow";
import DataTable from "../../common/DataTable";
import { useEffect, useOptimistic, useState } from "react";
import { getAllCustomers } from "../../../services/employeeService";

export default function EmployeeDashboard() {
	const [customers, setCustomers] = useState([]);

	const [optimisticCustomers, setOptimisticCustomers] = useOptimistic(customers);

	useEffect(() => {
		getAllCustomers()
			.then(result => {
				setOptimisticCustomers(result);
				setCustomers(result);
			});
	}, []);

	console.log(customers);


	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Accounts" email="employee_1@company.com" />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard />
				</div>

				<DataTable headers={["Customer", "Date", "Status", "Details"]}>
					{optimisticCustomers.map(x => (
						<EmployeeTableRow {...x} key={x.id} detailsTo="/customer-details/1" />
					))}
				</DataTable>
			</div>
		</div>
	);
}
