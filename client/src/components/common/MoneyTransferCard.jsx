import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router";

export default function MoneyTransferCard({onClick}) {
    return (
        <div 
        onClick={onClick}
        className="max-w-2xs h-20 bg-gradient-to-br from-[#351F78] to-[#0B82BE] rounded-3xl flex gap-4 justify-center p-6">
            <h1 className="text-xl font-semibold  text-white">Between Your Cards</h1>
            <button className="bg-white w-8 h-8 rounded-full">
                <Link to="">
                <div className="flex justify-center items-center  stroke-2 h-full text-black">
                <IoIosArrowForward />
                </div>
                </Link>
            </button>
            </div>
    )
}
                