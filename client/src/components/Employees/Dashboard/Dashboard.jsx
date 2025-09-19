import { useContext, useEffect, useMemo, useState } from "react";
import FilterCard from "../../common/FilterCard";
import { getAllCustomers } from "../../../services/employeeService";
import { AuthContext } from "../../../contexts/AuthContext";
import EmployeeHeader from "../../common/EmployeeHeader";
import Sidebar from "../../common/Sidebar";
import EmployeeTableRow from "./EmployeeTableRow";

const n = v => (v ?? "").toString().trim().toLowerCase();
const isEmpty = f =>
	!f ||
	(f.accountType === "ALL" || !f.accountType) &&
	!n(f.username) && !n(f.email) && !n(f.egn) && !n(f.idNumber);

const get = (obj, ...keys) => {
	for (const k of keys) {
		const v = obj?.[k];
		if (v !== undefined && v !== null) return v;
	}
	return "";
};

const buildPredicate = f => c => {
	if (f.accountType && f.accountType !== "ALL") {
		const accType = get(c, "accountType", "accountTypeName", "account?.type");
		if ((accType || "").toString().toUpperCase() !== f.accountType) return false;
	}
	if (f.username && !n(get(c, "name", "username")).includes(n(f.username))) return false;
	if (f.email && !n(get(c, "email", "emailAddress")).includes(n(f.email))) return false;
	if (f.egn && !n(get(c, "egn")).includes(n(f.egn))) return false;
	if (f.idNumber && !n(get(c, "idNumber", "id", "id_card")).includes(n(f.idNumber))) return false;
	return true;
};

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [allCustomers, setAllCustomers] = useState([]);
	const [filters, setFilters] = useState(null);

	useEffect(() => {
		if (!user?.token) return;
		getAllCustomers(user.token).then(setAllCustomers);
	}, [user?.token]);

	const visible = useMemo(() => {
		if (!filters) return allCustomers;
		return allCustomers.filter(buildPredicate(filters));
	}, [allCustomers, filters]);

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-[#0B82BE]/10 to-[#351F78]/10 overflow-hidden">
			<Sidebar />
			<div className="flex-1 p-6 space-y-6">
				<EmployeeHeader />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard
						initialValues={{ accountType: "ALL", username: "", email: "", egn: "", idNumber: "" }}
						onApply={(f) => setFilters(isEmpty(f) ? null : f)}
						onReset={() => setFilters(null)}
					/>
				</div>

				<div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="text-gray-600">
							<tr>
								<th className="py-2">Customer</th>
								<th className="py-2">Date</th>
								<th className="py-2">Status</th>
								<th className="py-2">Details</th>
							</tr>
						</thead>
						<tbody>
							{visible.length > 0 ? (
								visible.map(x => <EmployeeTableRow key={x.id} {...x} />)
							) : (
								<tr><td colSpan={4} className="py-6 text-center text-gray-500">No data available!</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}