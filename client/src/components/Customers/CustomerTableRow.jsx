

function CustomerTableRow(props) {
	return (
		<tr className="text-[#707070] font-medium">
			<td className="py-3 ">{props.name}</td>
			<td className="py-3 text-[#5A7555]">{props.amount}</td>
			<td className="py-3">{props.date}</td>
            <td className="py-3">{props.time}</td>
            <td className="py-3">{props.card}</td>
			
		</tr>
	);
}

export default CustomerTableRow;