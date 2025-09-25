import Card from "../Cards";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getAllCardsData } from "../../../services/cardService";
import { getUserAccounts } from "../../../services/userService";

export default function LoanCards({ className = "", onSelect }) {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchAccounts = async () => {
			try {
				const data = await getUserAccounts(user.token);
				setAccounts(Array.isArray(data) ? data : []);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchAccounts();
	}, [user]);

	useEffect(() => {
		if (accounts.length > 0) {
			const fetchCards = async () => {
				try {
					const data = await getAllCardsData(user.token);
					setCards(Array.isArray(data) ? data : []);
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};

			fetchCards();
		}
	}, [accounts.length, user.token]);

	if (loading) return <p>Loading cards...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div
			className={`w-full h-full rounded-2xl border border-gray-300 shadow-xl text-white relative overflow-hidden ${className}`}
		>
			<div className="h-full p-4 space-y-4 text-black opacity-100">
				{cards
					.map((obj, i) => ({ ...obj, ...accounts[i] }))
					.map((card) => (
						<div
							key={card.accountNumber}
							className="rounded-2xl py-4 px-2 gap-4 flex justify-between items-center hover:scale-105 transition-transform duration-300 cursor-pointer"
							onClick={() => onSelect?.(card)} 
						>
							<div className="origin-left">
								{card.cardType === "Debit Visa" ? (
									<Card
										width="w-32"
										height="h-20"
										textSize="text-[5px]"
										logoSize="w-4 h-2"
										size="py-2 px-2"
										margin="mt-2"
										className="bg-gradient-to-br from-[#351F78]/10 to-[#0B82BE]/10 border border-gray-300"
										{...card}
									/>
								) : (
									<Card
										width="w-32"
										height="h-20"
										textSize="text-[5px]"
										logoSize="w-4 h-2"
										size="py-2 px-2"
										margin="mt-2"
										{...card}
									/>
								)}
							</div>
							<div>
								<p className="text-normal font-semibold">{card.cardType}</p>
								<p className="font-2xs mt-2">{card.accountNumber}</p>
								<p className="font-medium">
									{card.cardNumber} | {card.expiration}
								</p>
							</div>

							<div className="text-right border-l-2 border-gray-300 pl-6">
								<p className="text-lg text-black font-normal text-left">Balance</p>
								<p className="text-xl text-gray-600 font-semibold mt-2 text-left">
									{card.balance} EUR
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}