import Credi from "../../assets/Credi-bot.png";
import { useState } from "react";

export default function AiChatBot() {
  
        const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @keyframes zoomIn {
            0% {
              transform: scale(0.2);
              opacity: 0;
            }
            80% {
              transform: scale(1.05);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .chat-bubble-zoom {
            animation: zoomIn 0.5s ease-out forwards;
          }
        `}
      </style>

      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
     
        {isOpen && (
          <div className="mb-4 w-80 h-96 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col chat-bubble-zoom">
          
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#9B2AAF] to-[#0CA6F3] rounded-t-xl">
              <h2 className="text-white font-semibold text-sm">Credi Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white font-bold hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

   
            <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700">
              <p className="text-gray-500 italic">👋 Hi, I'm Credi! How can I help you today?</p>
            </div>

       
            <div className="p-3 border-t border-gray-200 flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9B2AAF]"
              />
              <button className="ml-2 px-4 py-2 bg-[#4D3E8D] text-white rounded-lg text-sm font-medium">
                Send
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
            className="
              p-4 w-16 h-16 
              bg-gradient-to-b from-[#9B2AAF] to-[#0CA6F3] 
              rounded-full shadow-md 
              hover:scale-110 hover:shadow-lg 
              transition-transform duration-300 ease-in-out 
              chat-bubble-zoom
            "
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



