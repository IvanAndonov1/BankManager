function DataTable({ headers = [], children }) {
	return (
		<div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead className="text-gray-600">
					<tr>
						{headers.map((header, idx) => (
							<th key={idx} className="py-2">{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{children}
				</tbody>
			</table>
		</div>
	);
}

export default DataTable; 