import Sidebar from "../../common/Sidebar";
import UserHeader from "../../common/UserHeader";
import FilterCard from "../../common/FilterCard";
import DataTable from "../../common/DataTable";
import AdminTableRow from "./AdminTableRow";
import { use, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getAllEmployees } from "../../../services/adminService";

const n = (v) => (v ?? "").toString().trim().toLowerCase();

const get = (obj, ...keys) => {
	for (const k of keys) {
		const v = obj?.[k];
		if (v !== undefined && v !== null) return v;
	}
	return "";
};

const buildPredicate = (f) => (item) => {
	if (f.username && !n(get(item, "name", "username")).includes(n(f.username))) {
		return false;
	}
	if (f.email && !n(get(item, "email", "emailAddress")).includes(n(f.email))) {
		return false;
	}
	if (f.egn && !n(get(item, "egn")).includes(n(f.egn))) {
		return false;
	}
	return true;
};

export default function AdminDashboard() {
	const { user } = use(AuthContext);
	const [employees, setEmployees] = useState([]);
	const [filters, setFilters] = useState(null);

	useEffect(() => {
		if (!user?.token) return;
		getAllEmployees(user.token).then(setEmployees).catch(() => setEmployees([]));
	}, [user?.token]);

	const visible = useMemo(() => {
		if (!filters) return employees;
		return employees.filter(buildPredicate(filters));
	}, [employees, filters]);

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<UserHeader roleLabel="Admin" email="admin@company.com" />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard
						fields={[
							{ key: "username", label: "Username", type: "text", placeholder: "Username" },
							{ key: "email", label: "Email", type: "text", placeholder: "Email" },
							{ key: "egn", label: "EGN", type: "text", placeholder: "EGN" },
						]}
						initialValues={{ username: "", email: "", egn: "" }}
						onApply={(f) => setFilters(
							n(f.username) || n(f.email) || n(f.egn) ? f : null
						)}
						onReset={() => setFilters(null)}
					/>
				</div>

				<div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
					<DataTable headers={["User", "Date", "Status", "Details"]}>
						{visible.length > 0 ? (
							visible.map((x) => <AdminTableRow key={x.id ?? JSON.stringify(x)} {...x} />)
						) : (
							<tr>
								<td colSpan={4} className="py-6 text-center text-gray-500">
									No data available!
								</td>
							</tr>
						)}
					</DataTable>
				</div>
			</div>
		</div>
	);
}