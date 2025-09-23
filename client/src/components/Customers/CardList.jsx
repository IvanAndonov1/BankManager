import { useEffect, useState } from "react";
import Cards from "./Cards"; 
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { getAllCardsData } from "../../services/cardService";

export default function CardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await getAllCardsData(user.id, user.token);
        if (!response.ok) throw new Error("Failed to fetch cards");

        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user]);

  if (loading) return <p className="text-[#351f78] font-bold">Loading cards...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-cols-1 sm:flex-cols-2 gap-16">
      {cards.map((card, index) => (
        <Cards
          
          key={index}
          cardNumber={card.cardNumber}
          expiration={card.expiration}
          cardType={card.cardType}
        />
      ))}
    </div>
  );
}
