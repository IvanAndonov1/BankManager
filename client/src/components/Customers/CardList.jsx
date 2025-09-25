import { useEffect, useState, useContext } from "react";
import Cards from "./Cards";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllCardsData } from "../../services/cardService";

export default function CardList() {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user.id && user.token) {
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
	}, [user.id, user.token]);

	if (loading) return <p className="text-[#351f78] font-bold">Loading cards...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (!cards.length) return <p className="text-[#351f78]">No cards found.</p>;

	return (
		<div className="flex flex-wrap gap-60">
			{cards.map((card, index) => (
				<Cards
					key={index}
					cardNumber={card.maskedNumber || card.cardNumber}
					expiration={card.expiration}
					cardType={card.type || card.cardType}
				/>
			))}
		</div>
	);
}