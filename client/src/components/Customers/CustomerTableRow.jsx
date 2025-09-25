function CustomerTableRow({ type, amount, dateTime, description, cardType }) {
	const isNegative = amount.toString().startsWith('-');

	const dateObj = new Date(dateTime);
	const date = dateObj.toLocaleDateString();
	const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

	return (
		<tr className="text-[#707070] font-medium">
			<td className="py-3">{type}</td>
			<td className={`py-3 ${isNegative ? "text-red-500" : "text-[#299425]"}`}>
				{amount}
			</td>
			<td className="py-3">{date}</td>
			<td className="py-3">{time}</td>
			<td className="py-3">{description}</td>
			<td className="py-3">{cardType}</td>
		</tr>
	);
}

export default CustomerTableRow;
