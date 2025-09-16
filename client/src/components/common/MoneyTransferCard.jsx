import { IoIosArrowForward } from "react-icons/io";


export default function MoneyTransferCard({transfer,onClick}) {
    return (
        <div 
        onClick={onClick}
        className="max-w-xs h-20 bg-gradient-to-br from-[#351F78] to-[#0B82BE] rounded-3xl flex gap-4 justify-center p-6 shadow-lg">
            <h1 className="text-xl font-semibold  text-white">{transfer}</h1>
            <button className=" w-8 h-8 rounded-full bg-white/10 
            backdrop-blur-xl 
            border border-white/20 
            shadow-[0_0_20px_rgba(255,255,255,0.2)] 
            before:absolute before:inset-0 
            before:rounded-3xl 
            before:bg-gradient-to-t before:from-white/20 before:to-transparent 
            before:border-t before:border-white/40 
            overflow-hidden ">
                
                
                <div className="flex justify-center items-center stroke-4 h-full text-white">
                <IoIosArrowForward />
                </div>
                
            </button>
            </div>
    )
}
                