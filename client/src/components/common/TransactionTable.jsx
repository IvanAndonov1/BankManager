import CustomerTableRow from "../Customers/CustomerTableRow";

export default function TransactionTable({ transactions = [] }) {
  if (!transactions.length) {
    return <p className="text-gray-500">No transactions found.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="text-[#707070]">
        <tr className="border-b border-gray-300">
          <th className="py-2 font-normal">Transaction Name</th>
          <th className="py-2 font-normal">Amount</th>
          <th className="py-2 font-normal">Date</th>
          <th className="py-2 font-normal">Time</th>
          <th className="py-2 font-normal">Card</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => {
          const [date, time] = tx.dateTime.split(" ");
          return (
            <CustomerTableRow
              key={tx.id}
              name={tx.description}
              amount={`${tx.type === "DEPOSIT" ? "+" : "-"} ${tx.amount} EUR`}
              date={date}
              time={time.slice(0, 5)} 
              card={tx.cardType}
            />
          );
        })}
      </tbody>
    </table>
  );
}

