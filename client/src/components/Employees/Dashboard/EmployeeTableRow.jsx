import { Link } from "react-router-dom";

function EmployeeTableRow(props) {
	const pending = props.pendingCount;

	return (
		<tr className="hover:bg-gray-50">
			<td className="py-3">{props.username}</td>
			<td className="py-3 text-center">{props?.createdAt?.substr(0, 10)}</td>
			<td className={`py-3 text-center ${props.active ? "text-green-600" : "text-gray-500"}`}>
				{props.active ? "active" : "disabled"}
			</td>

			<td className="py-3 text-center">
				{pending == null ? (
					<span className="text-gray-400">—</span>
				) : pending > 0 ? (
					<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-semibold">
						{pending}
					</span>
				) : (
					<span className="text-gray-400">0</span>
				)}
			</td>

			<td className="py-3 text-center">
				<Link
					to={`/customer-details/${props.id}`}
					className="cursor-pointer px-4 py-1 rounded-full text-white"
					style={{ backgroundColor: "#351f78" }}
				>
					Show more
				</Link>
			</td>
		</tr>
	);
}

export default EmployeeTableRow;