import { useContext, useEffect, useMemo, useState } from "react";
import FilterCard from "../../common/FilterCard";
import { getAllCustomers, getAllLoanDetails } from "../../../services/employeeService";
import { AuthContext } from "../../../contexts/AuthContext";
import EmployeeHeader from "../../common/EmployeeHeader";
import Sidebar from "../../common/Sidebar";
import EmployeeTableRow from "./EmployeeTableRow";

const n = v => (v ?? "").toString().trim().toLowerCase();

const isEmpty = f =>
	!f || (!n(f.username) && !n(f.email) && !n(f.egn));

const get = (obj, ...keys) => {
	for (const k of keys) {
		const v = obj?.[k];
		if (v !== undefined && v !== null) return v;
	}
	return "";
};

const buildPredicate = f => c => {
	if (f.username && !n(get(c, "name", "username")).includes(n(f.username))) return false;
	if (f.email && !n(get(c, "email", "emailAddress")).includes(n(f.email))) return false;
	if (f.egn && !n(get(c, "egn")).includes(n(f.egn))) return false;
	return true;
};

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [allCustomers, setAllCustomers] = useState([]);
	const [filters, setFilters] = useState(null);

	const [pendingByCustomer, setPendingByCustomer] = useState({});
	const [view, setView] = useState("all");

	useEffect(() => {
		if (!user?.token) return;
		getAllCustomers(user.token).then(setAllCustomers).catch(() => setAllCustomers([]));
	}, [user?.token]);

	useEffect(() => {
		if (!user?.token || allCustomers.length === 0) return;

		let cancelled = false;

		(async () => {
			const tasks = allCustomers.map(c =>
				getAllLoanDetails(user.token, c.id)
					.then(list => {
						const arr = Array.isArray(list) ? list : [];
						const cnt = arr.filter(a => (a?.status || "").toString().toUpperCase() === "PENDING").length;
						return { id: c.id, count: cnt };
					})
					.catch(() => ({ id: c.id, count: 0 }))
			);

			const results = await Promise.allSettled(tasks);
			if (cancelled) return;

			const map = {};
			for (const r of results) {
				if (r.status === "fulfilled" && r.value) {
					map[r.value.id] = r.value.count;
				}
			}
			setPendingByCustomer(map);
		})();

		return () => { cancelled = true; };
	}, [user?.token, allCustomers]);

	const filtered = useMemo(() => {
		if (!filters) return allCustomers;
		return allCustomers.filter(buildPredicate(filters));
	}, [allCustomers, filters]);

	const withRequestsCount = useMemo(() => {
		return filtered.reduce((acc, c) => acc + ((pendingByCustomer[c.id] ?? 0) > 0 ? 1 : 0), 0);
	}, [filtered, pendingByCustomer]);

	const visible = useMemo(() => {
		if (view === "with") {
			return filtered.filter(c => (pendingByCustomer[c.id] ?? 0) > 0);
		}
		return filtered;
	}, [filtered, pendingByCustomer, view]);

	// 👉 филтърът съдържа САМО username, email, egn
	const filterFields = [
		{ key: "username", label: "Username", type: "text", placeholder: "Username" },
		{ key: "email", label: "Email", type: "text", placeholder: "Email" },
		{ key: "egn", label: "EGN", type: "text", placeholder: "EGN" },
	];

	const initialFilterValues = {
		username: "",
		email: "",
		egn: "",
	};

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-[#0B82BE]/10 to-[#351F78]/10 overflow-hidden">
			<Sidebar />
			<div className="flex-1 p-6 space-y-6">
				<EmployeeHeader />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard
						fields={filterFields}
						initialValues={initialFilterValues}
						onApply={(f) => setFilters(isEmpty(f) ? null : f)}
						onReset={() => setFilters(null)}
					/>
				</div>

				<div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
					<div className="mb-4 flex items-center justify-end gap-2">
						<button
							onClick={() => setView("all")}
							className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium ${view === "all" ? "bg-[#351F78] text-white" : "bg-gray-100 text-gray-700"}`}
						>
							All
						</button>
						<button
							onClick={() => setView("with")}
							className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${view === "with" ? "bg-[#351F78] text-white" : "bg-gray-100 text-gray-700"}`}
						>
							With loan requests
							<span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-semibold bg-red-600 text-white">
								{withRequestsCount}
							</span>
						</button>
					</div>

					<table className="w-full text-left text-sm">
						<thead className="text-gray-600">
							<tr>
								<th className="py-2">Customer</th>
								<th className="py-2 text-center">Date</th>
								<th className="py-2 text-center">Status</th>
								<th className="py-2 text-center">Waiting requests</th>
								<th className="py-2 text-center">Details</th>
							</tr>
						</thead>
						<tbody>
							{visible.length > 0 ? (
								visible.map(x => (
									<EmployeeTableRow
										key={x.id}
										{...x}
										pendingCount={pendingByCustomer[x.id]}
									/>
								))
							) : (
								<tr>
									<td colSpan={5} className="py-6 text-center text-gray-500">
										{view === "with" ? "No customers with pending requests." : "No data available!"}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
