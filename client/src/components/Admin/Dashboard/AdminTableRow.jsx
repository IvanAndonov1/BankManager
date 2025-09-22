import { Link } from 'react-router-dom';

function AdminTableRow(props) {
	return (
		<tr className="hover:bg-gray-50">
			<td className="py-3">{props.name}</td>
			<td className="py-3">{props.created_at ? props.created_at.substr(0, 10) : 'date'}</td>
			<td className="py-3 text-green-600">{props.active ? 'active' : 'disabled'}</td>
			<td className="py-3">
				<Link to={`/admin/employee/${props.id}`} className="cursor-pointer px-4 py-1 rounded-full text-white" style={{ backgroundColor: "#351f78" }}>
					Show more
				</Link>
			</td>
		</tr>
	);
}

export default AdminTableRow;