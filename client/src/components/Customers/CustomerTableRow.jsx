function CustomerTableRow({ name, amount, date, time, card }) {
  return (
    <tr className="text-[#707070] font-medium">
      <td className="py-3">{name}</td>
      <td className="py-3 text-[#5A7555]">{amount}</td>
      <td className="py-3">{date}</td>
      <td className="py-3">{time}</td>
      <td className="py-3">{card}</td>
    </tr>
  );
}

export default CustomerTableRow;
