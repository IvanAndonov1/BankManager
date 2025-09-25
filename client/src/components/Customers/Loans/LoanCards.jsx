import Card from "../Cards";
import { useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";
import { getAllCardsData } from "../../../services/cardService";
import { getUserAccounts } from "../../../services/userService";

export default function LoanCards({
	className = "",
	isSelectable = false,
	selectedCard = null,
	onCardSelect = null,
	excludeCard = null,
	displayMode = "scroll",
	cardSize = "normal"
}) {
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
	}, [accounts.length]);

	if (loading) return <p>Loading cards...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	const combinedCards = cards.map((obj, i) => {
		return { ...obj, ...accounts[i] }
	});

	if (displayMode === "grid") {
		return (
			<div className={`space-y-2 ${className}`}>
				{combinedCards.map(card => (
					<div
						key={card.accountNumber}
						className={`
							rounded-xl p-3 cursor-pointer transition-all duration-300 
							flex justify-between items-center
							${isSelectable && selectedCard?.accountNumber === card.accountNumber
								? "border-3 border-[#351F78] bg-purple-50/30 scale-102 shadow-md"
								: "border border-gray-200 hover:border-gray-300 hover:scale-101"
							}
						`}
						onClick={() => isSelectable && onCardSelect?.(card)}
					>
						<div className="flex items-center gap-4">
							<div className="flex-shrink-0">
								<Card
									width="w-20"
									height="h-12"
									textSize="text-[6px]"
									logoSize="w-3 h-2"
									size="py-1 px-2"
									margin="mt-1"
									{...card}
								/>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-800">
									{card.accountNumber}
								</p>
								<p className="text-xs text-gray-600">
									{card.cardNumber} | {card.expiration}
								</p>
							</div>
						</div>

						<div className="text-right">
							<p className="text-xs text-gray-600">Balance</p>
							<p className="text-lg font-semibold text-gray-800">
								{card.balance} EUR
							</p>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={`w-3/4 h-32 rounded-2xl border border-gray-300 shadow-xl bg-gradient-to-br from-[#351F78]/10 to-[#0B82BE]/10 text-white relative overflow-hidden ${className}`}>
			<div className="h-full overflow-y-auto p-4 space-y-4 text-black opacity-100">
				{combinedCards.map(card => (
					<div
						key={card.accountNumber}
						className={`
							rounded-2xl py-4 px-6 flex justify-between items-center transition-transform duration-300
							${isSelectable ? "cursor-pointer hover:scale-105" : "hover:scale-105"}
							${isSelectable && selectedCard?.accountNumber === card.accountNumber
								? "bg-purple-100 border-2 border-[#351F78]"
								: ""
							}
						`}
						onClick={() => isSelectable && onCardSelect?.(card)}
					>
						<div className="origin-left">
							{card.cardType == 'Debit Visa' ?
								<Card width="w-32" height="h-20" textSize="text-[5px]" logoSize="w-4 h-2"
									size="py-2 px-2" margin="mt-2" {...card}></Card>
								:
								<Card width="w-32" height="h-20" textSize="text-[5px]" logoSize="w-4 h-2"
									size="py-2 px-2" margin="mt-2" {...card}></Card>
							}
						</div>
						<div>
							<p className="text-normal font-semibold">{card.cardType}</p>
							<p size="py-2 px-2" className="font-2xs mt-2">
								{card.accountNumber}
							</p>
							<p className="font-medium">{card.cardNumber} | {card.expiration}</p>
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