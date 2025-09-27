import { NavLink, useNavigate, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getUserAccount, logoutUser } from "../../services/userService.js";
import logoWhite from "../../assets/logo.svg";

function CustomerSidebar() {
	const { user, userLogin, userLogout } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchUser() {
			try {
				const data = await getUserAccount(user.id, user.token);

				userLogin(data);
			} catch (err) {
				console.error("User not authenticated:", err);
				navigate("/login");
			}
		}

		if (!user) fetchUser();
	}, []);

	async function handleLogout() {
		try {
			await logoutUser();
			userLogout();
			navigate("/login");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	}

	const glassEffect =
		"bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-t before:from-white/20 before:to-transparent before:border-t before:border-white/40 overflow-hidden";

	return (
		
		<div className="w-52 min-h-screen bg-gradient-to-b from-[#351F78] to-[#0B82BE] rounded-r-3xl">
				<span className=" mt-8 ml-16 flex flex-col items-end z-50 h-12 w-18">
												  <img src={logoWhite} alt="logo" className=" object-cover " />
										</span>
			<div className="flex flex-col text-white items-center py-10 ">
				
				<h1 className="text-2xl font-semibold my-4 pr-4 max-w-52">👋Hi! &nbsp;
					{user?.firstName || "firstName"}
				</h1>
				<h4 className="text-md font-semibold">
					{user?.username || "Username"}
				</h4>
				<Link to="/customer-edit">
				<h4 className="text-md font-light">Edit Profile</h4>
				</Link>

				<ul className="p-4 text-xl space-y-4 my-12">
					<li>
						<NavLink
							to="/customer-dashboard"
							className={({ isActive }) =>
								`block px-6 py-2 rounded-full transition-all duration-300 ${isActive ? glassEffect : "hover:bg-white/5"
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
								`block px-6 py-2 rounded-full transition-all duration-300 ${isActive ? glassEffect : "hover:bg-white/5"
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
								`block px-6 py-2 rounded-full transition-all duration-300 ${isActive ? glassEffect : "hover:bg-white/5"
								}`
							}
						>
							Loans
						</NavLink>
					</li>
				</ul>

				<button
					onClick={handleLogout}
					className="text-xl font-extrabold absolute bottom-[5%] mr-8 hover:underline"
				>
					Log out
				</button>
			</div>
		</div>
	);
}

export default CustomerSidebar;
