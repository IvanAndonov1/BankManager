import { Link, NavLink } from "react-router-dom";

function CustomerSidebar() {
	const glassEffect = "bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] before:absolute before:inset-0  before:rounded-3xl before:bg-gradient-to-t before:from-white/20 before:to-transparent  before:border-t before:border-white/40  overflow-hidden";
	return (
		<div className="w-48 min-h-screen bg-gradient-to-b from-[#351F78] to-[#0B82BE] rounded-r-3xl">
			<div className="flex flex-col text-white items-center py-12">
				<div className="container w-24 h-24 rounded-full bg-white p-4" />
				<h1 className="text-3xl font-semibold mt-4">Name</h1>
				<h4 className="text-md font-semibold">Username</h4>

				<ul className="p-4 text-xl space-y-4 my-12">
					<li>
						<NavLink
							to="/customer-dashboard"
							className={({ isActive }) =>
								`block px-6 py-2 rounded-full transition-all duration-300 ${isActive
									? glassEffect
									: "hover:bg-white/5"
								}`
							}
						>
							Home
						</NavLink>
					</li>

					<li>
						<NavLink
							to="/customer-transactions"
							className={({ isActive }) =>
								`block px-6 py-2 rounded-full transition-all duration-300 ${isActive
									? glassEffect
									: "hover:bg-white/5"
								}`
							}
						>
							Transactions
						</NavLink>
					</li>

					<li>
						<NavLink
							to="/customer-loans"
							className={({ isActive }) =>
								`block px-6 py-2 rounded-full transition-all duration-300 ${isActive
									? glassEffect
									: "hover:bg-white/5"
								}`
							}
						>
							Loans
						</NavLink>
					</li>
				</ul>

				<Link to="/logout" className="cursor-pointer text-xl text-left font-extrabold absolute bottom-[5%] mr-8">
					Log out
				</Link>
			</div>
		</div>
	);
}

export default CustomerSidebar;
