import Card from "../Cards";
import { useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";
import { getAllCardsData, getBalanceData } from "../../../services/cardService";


export default function LoanCards({className = ""}) {

  const [cards, setCards] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
  
    useEffect(() => {
      const fetchCards = async () => {
        try {
          const response = await getAllCardsData(user.id, user.token);
          if (!response.ok) throw new Error("Failed to fetch cards");
  
          const data = await response.json();
          setCards(data)
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
       const fetchBalanceData = async () => {
        try {
          const response = await getBalanceData(user.id, user.token);
          if (!response.ok) throw new Error("Failed to fetch cards");
  
          const data = await response.json();
          setBalanceData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

  
      fetchCards();
      fetchBalanceData();
    }, [user]);


    
    if (loading) return <p>Loading cards...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
 console.log(cards);
  return (
    <div className={`w-3/4 h-32 rounded-2xl border border-gray-300 shadow-xl  bg-gradient-to-br from-[#351F78]/10 to-[#0B82BE]/10 text-white relative overflow-hidden ${className}`}>
      <div className="h-full overflow-y-auto  p-4 space-y-4 text-black opacity-100">
        {cards.map((obj, i) => {
                      return { ...obj, ...balanceData[i] };
                }).map(card => (
                            <div className=" rounded-2xl py-4 px-6 flex justify-between items-center hover:scale-105 transition-transform duration-300">
             <div className=" origin-left ">
           
            {
                    card.cardType == 'Debit Visa' ?
                        <Card width="w-32" height="h-20" textSize="text-[5px]" logoSize="w-4 h-2"
                        size="py-2 px-2" margin="mt-2" {...card}></Card>
                        :
                       <Card width="w-32" height="h-20" textSize="text-[5px]" logoSize="w-4 h-2"
                        size="py-2 px-2" margin="mt-2" {...card}></Card>
                }
          </div>
          <div>
            <p className="text-normal font-semibold">{card.cardType}</p>
            
            <p size className="font-2xs mt-2">
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
