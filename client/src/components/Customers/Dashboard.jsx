import CustomerSidebar from "../common/CustomerSidebar";
import CustomerTableRow from "./CustomerTableRow";
import Card from "./Cards";

let data = {
	name: "Name 1",
	amount: "+ 1200 EUR",
	date: "04/09/2025",
	time: "10:30 AM",
	card: "Debit",
};

export default function Dashboard() {
	return (
		<div className="min-h-screen flex bg-white">
			<CustomerSidebar />


			<div className="flex-1 p-8 ml-12 flex flex-col gap-12">


				<div>
					<h1 className="text-2xl font-bold mb-4">Your Cards</h1>


					<div className="grid grid-cols-2 gap-6">
						<Card className="w-96 h-56" />
						<Card className="w-96 h-56" />

					</div>


					<div className="grid grid-cols-2 gap-6 mt-6">
						<div className="w-96 h-20 rounded-2xl border-2 border-[#351F78] flex flex-col justify-center">
							<div className="text-[#351F78] text-2xl text-center">Balance: 5087,67 EUR</div>
							<div className="text-[#351F78] text-sm text-center">IBAN: BG00 XXXX XXXX XXXX XXXX 00</div>
						</div>
						<div className="w-96 h-20 bg-[#351F78] rounded-2xl border-2 border-[#351F78] flex flex-col justify-center">
							<div className="text-white text-2xl text-center">Balance: 2034,62 EUR</div>
							<div className="text-white text-sm text-center">IBAN: BG00 XXXX XXXX XXXX XXXX 11</div>
						</div>
					</div>
				</div>


				<div className="w-full">
					<h1 className="text-xl font-bold mb-6 text-[#351f78]">
						Recent Transactions
					</h1>
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
							<CustomerTableRow {...data} />
							<CustomerTableRow {...data} />
							<CustomerTableRow {...data} />
							<CustomerTableRow {...data} />
						</tbody>
					</table>
				</div>

			</div>
		</div>
	);
}
