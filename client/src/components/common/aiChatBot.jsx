import Credi from "../../assets/Credi-bot.png";
import { useState } from "react";
import { chatWithAi } from "../../services/aiService";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { IoIosArrowDown } from "react-icons/io";

export default function AiChatBot() {

  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi, I'm Credi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

const suggestions = [
  { value: "1", label: "Show my account balances" },
  { value: "2", label: "Show my last 3 transactions" },
  { value: "3", label: "Show my active loans" },
  { value: "4", label: "Show my credit score" },
  { value: "5", label: "Show my loan applications" },
  { value: "6", label: "Do I have late payments?" },
  { value: "7", label: "Show bank overview (employees/admins only)" },
  { value: "8", label: "Show my cards" },
  { value: "9", label: "Show my profile" },
];

const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatWithAi(user?.token, { prompt: text }); 
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes zoomIn {
            0% { transform: scale(0.2); opacity: 0; }
            80% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .chat-bubble-zoom { animation: zoomIn 0.5s ease-out forwards; }
        `}
      </style>

      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
        {isOpen && (
          <div className="mb-4 w-96 h-96 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col chat-bubble-zoom">
          
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#9B2AAF] to-[#0CA6F3] rounded-t-xl">
              <h2 className="text-white font-semibold text-sm">Credi Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white font-bold hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

           
            <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "bot"
                      ? "bg-gray-100 text-gray-800 self-start"
                      : "bg-[#4D3E8D] text-white self-end ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 text-xs italic self-start">
                  Thinking...
                </div>
              )}
            </div>

      <div className="px-3 pb-2">
  <div className="flex items-center justify-between mb-2">
  
    <button
      onClick={() => setShowSuggestions(prev => !prev)}
      className="text-gray-500 hover:text-gray-700 transition-transform"
    >
      {showSuggestions ? <IoIosArrowDown className="transform rotate-180"/> : <IoIosArrowDown/>} 
    </button>
  </div>

  {showSuggestions && (
    <div className="flex gap-2 flex-wrap">
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => {
          handleSend(s.value);
          setShowSuggestions(false); 
          }}
          disabled={loading}
          className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
        >
          {s.label} 
        </button>
      ))}
    </div>
  )}
</div>
           
            <div className="p-3 border-t border-gray-200 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9B2AAF]"
                disabled={loading}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={loading}
                className="ml-2 px-4 py-2 bg-[#4D3E8D] text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        )}

    
        {!isOpen && (
          <div className="fixed bottom-6 right-6 flex items-center z-50">
            <div className="flex items-center gap-2">
              <div className="ml-4 mb-6 chat-bubble-zoom">
                <div className="w-32 h-8 rounded-3xl bg-gray-200 border border-gray-300 flex items-center justify-center">
                  <p className="text-sm text-gray-700">Chat with Credi</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="p-4 w-16 h-16 
                  bg-gradient-to-b from-[#9B2AAF] to-[#0CA6F3] 
                  rounded-full shadow-md 
                  hover:scale-110 hover:shadow-lg 
                  transition-transform duration-300 ease-in-out 
                  chat-bubble-zoom"
              >
                <img src={Credi} alt="Chat Bot" className="w-10 h-10 pb-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
