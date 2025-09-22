import { Link } from 'react-router-dom';

function EmployeeTableRow(props) {
	return (
		<tr className="hover:bg-gray-50">
			<td className="py-3">{props.username}</td>
			<td className="py-3">{props?.createdAt?.substr(0, 10)}</td>
			<td className="py-3 text-green-600">{props.active ? 'active' : 'disabled'}</td>
			<td className="py-3">
				<Link to={`/customer-details/${props.id}`} className="cursor-pointer px-4 py-1 rounded-full text-white" style={{ backgroundColor: "#351f78" }}>
					Show more
				</Link>
			</td>
		</tr>
	);
}

export default EmployeeTableRow;