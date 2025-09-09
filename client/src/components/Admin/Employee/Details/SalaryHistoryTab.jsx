export default function SalaryHistoryTab() {
	const history = [
		{ date: "12/06/2025", amount: 1500 },
		{ date: "12/07/2025", amount: 1430 },
		{ date: "12/08/2025", amount: 1650 },
		{ date: "12/09/2025", amount: 1500 },
	];
	return (
		<div className="p-8">
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead>
						<tr className="text-gray-600">
							<th className="py-3">Date</th>
							<th className="py-3">Salary</th>
							<th className="py-3">More information</th>
						</tr>
					</thead>
					<tbody>
						{history.map((h, idx) => (
							<tr key={idx} className="border-t">
								<td className="py-4">{h.date}</td>
								<td className="py-4">
									<span className={`${h.amount > 1500 ? "text-green-600" : h.amount < 1500 ? "text-red-500" : "text-gray-800"}`}>{h.amount} EUR</span>
								</td>
								<td className="py-4 text-gray-500">—</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
} 