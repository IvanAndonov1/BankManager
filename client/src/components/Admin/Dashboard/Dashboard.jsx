import Sidebar from "../../common/Sidebar";
import UserHeader from "../../common/UserHeader";
import FilterCard from "../../common/FilterCard";
import DataTable from "../../common/DataTable";
import AdminTableRow from "./AdminTableRow";
import { use, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getAllEmployees } from "../../../services/adminService";

export default function AdminDashboard() {
	const { user } = use(AuthContext);
	const [employees, setEmployees] = useState([]);

	useEffect(() => {
		getAllEmployees(user.token)
			.then(result => setEmployees(result));
	}, [user.token]);

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Admin" email="admin@company.com" />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard />
				</div>

				<DataTable headers={["User", "Date", "Status", "Details"]}>
					{employees.length > 0
						?
						employees.map(x => (
							<AdminTableRow key={x.id} {...x} />
						))
						:
						<h1>No data available!</h1>
					}
				</DataTable>
			</div>
		</div>
	);
} 