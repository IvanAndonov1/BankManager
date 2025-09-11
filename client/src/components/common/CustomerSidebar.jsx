import { Link } from "react-router";

function CustomerSidebar() {
    return (
        <div className="w-42 bg-[#351F78] shadow-xl" >
            <div className="flex flex-col text-white items-center py-12 ">
                <div className="container w-24 h-24 rounded-full bg-white p-4"/>
            <h1 className=" text-3xl font-semibold mt-4">Name</h1>
            <h4 className=" text-md font-semibold">Username</h4>
         <ul className=" p-4 text-xl space-y-4 my-12 hover:cursor-pointer ">
           <li>
            <Link to="/customer-dashboard">
                Home
            </Link>
            </li>
            <li>
            <Link to ="/customer-transactions">
                Transactions
            </Link>
                </li>
                <li>
            <Link to ="/customer-loans">
                Loans
            </Link>
                </li>
            </ul>
            <h4 className="text-xl text-left font-extrabold absolute bottom-[5%] mr-8">Log out</h4>
        </div>
        </div>
        
        
        
    )
}
export default CustomerSidebar;