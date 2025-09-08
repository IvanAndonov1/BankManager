import EmployeeHeader from "../../common/EmployeeHeader";
import FilterCard from "../../common/FilterCard";
import Sidebar from "../../common/Sidebar";
import EmployeeTableRow from "./EmployeeTableRow";

export default function Dashboard() {
	let data = { name: 'Name 1', date: '04/12/2020', status: 'active' };

	return (
		<div className="min-h-screen flex bg-gray-100">
			<Sidebar />

			<div className="flex-1 p-6 space-y-6">
				<EmployeeHeader />

				<div className="bg-white rounded-xl shadow p-6 space-y-6">
					<FilterCard />
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
							<EmployeeTableRow {...data} />
							<EmployeeTableRow {...data} />
							<EmployeeTableRow {...data} />
							<EmployeeTableRow {...data} />
							<EmployeeTableRow {...data} />
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
