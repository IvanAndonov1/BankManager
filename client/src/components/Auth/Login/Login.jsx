import { use, useState } from "react";
import { loginUser } from "../../../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext.jsx";
import { validateCredentials } from "../../../utils/validations.js";
import redLine1 from "../../../assets/red-line1.svg";
import redLine2 from "../../../assets/red-line2.svg";
import logoWhite from "../../../assets/white-logo.svg";


const savedCreds = (() => {
	try {
		return JSON.parse(localStorage.getItem("rememberCreds")) || null;
	} catch {
		return null;
	}
})();

const initialState = {
	username: savedCreds?.username || "",
	password: "",
	remember: Boolean(localStorage.getItem("remember")),
	message: "",
	messageType: "neutral",
	errors: { username: "", password: "" },
};

const roles = {
	CUSTOMER: "/customer-dashboard",
	EMPLOYEE: "/employee",
	ADMIN: "/admin",
};

export default function Login() {
	const { userLogin } = use(AuthContext);
	const [showPass, setShowPass] = useState(false);
	const [state, setState] = useState(initialState);
	const [isPending, setIsPending] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isPending) return;

		const form = e.currentTarget;
		const formData = new FormData(form);
		const username = (formData.get("username") || "").toString().trim();
		const password = (formData.get("password") || "").toString().trim();
		const remember = Boolean(formData.get("remember"));

		const { errors, hasErrors } = validateCredentials({ username, password });
		if (hasErrors) {
			setState(s => ({
				...s,
				username,
				password: "",
				remember,
				errors,
				message: "Please fix the highlighted errors.",
				messageType: "error",
			}));
			return;
		}

		try {
			setIsPending(true);
			const user = await loginUser({ username, password });

			if (!user || user.toString().includes("Error")) {
				setState(s => ({
					...s,
					username,
					password: "",
					remember,
					errors: { username: "", password: "" },
					message: "Invalid username or password!",
					messageType: "error",
				}));
				return;
			}

			userLogin(user);

			if (remember) {
				try {
					localStorage.setItem(
						"rememberCreds",
						JSON.stringify({ username })
					);
					localStorage.setItem("remember", "1");
				} catch { }
			} else {
				try {
					localStorage.removeItem("rememberCreds");
					localStorage.removeItem("remember");
				} catch { }
			}

			const roleKey = user.role || "";
			const destination = roles[roleKey] || roles[user.role] || "/login";

			console.log(destination);
			

			navigate(destination);

			setState(s => ({
				...s,
				username,
				password: "",
				remember,
				errors: { username: "", password: "" },
				message: "Successful login.",
				messageType: "success",
			}));
		} catch (err) {
			const apiMsg =
				err?.response?.data?.message ||
				err?.message ||
				"Login failed. Please check your credentials and try again.";

			setState(s => ({
				...s,
				message: apiMsg,
				messageType: "error",
				password: "",
			}));
		} finally {
			setIsPending(false);
		}
	};

	const messageClasses =
		state.messageType === "error"
			? "text-red-300"
			: state.messageType === "success"
				? "text-emerald-300"
				: "text-white/85";

	return (
		<main className="fixed inset-0 overflow-hidden">
			<Link to="/">
			<span className="fixed top-6 left-6 flex flex-col items-end z-50 h-28 w-42">
							  <img src={logoWhite} alt="logo" className=" object-cover" />
					</span>
			</Link>
			<div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
			

				<img src={redLine1} alt="red lines" className="pointer-events-none w-5xl h-5xl absolute inset-0 object-cover " />
				<img src={redLine2} alt="red lines" className="pointer-events-none w-5xl h-3xl absolute inset-0 left-[40%] object-cover " />

				<div className="relative z-10 w-full max-w-2xl mx-auto pt-24 px-4 text-white">
					<h1 className="text-4xl md:text-5xl font-bold text-center">Banking You Want To Use</h1>

					<section className="mt-10 md:mt-12 rounded-2xl bg-white/12 backdrop-blur-md ring-1 ring-white/25 shadow-[0_30px_60px_-12px_rgba(0,0,0,.45)] p-6 md:p-8 text-white/90 relative">
						<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/30" />

						<form onSubmit={handleSubmit} className="relative" noValidate>
							<label className="block mb-6">
								<span className="block text-sm text-white/85">Username</span>
								<input
									type="text"
									name="username"
									className={`mt-2 w-full bg-transparent outline-none border-b ${state.errors.username ? "border-red-400" : "border-white/50"} focus:border-white placeholder-white/60 pb-2`}
									defaultValue={state.username}
									autoComplete="username"
									aria-invalid={Boolean(state.errors.username)}
									aria-describedby={state.errors.username ? "username-error" : undefined}
								/>
								{state.errors.username ? (
									<p id="username-error" className="mt-2 text-xs text-red-300">{state.errors.username}</p>
								) : null}
							</label>

							<label className="block">
								<span className="block text-sm text-white/85">Password</span>
								<div className={`mt-2 flex items-center border-b ${state.errors.password ? "border-red-400" : "border-white/50"} focus-within:border-white pb-2`}>
									<input
										type={showPass ? "text" : "password"}
										name="password"
										className="w-full bg-transparent outline-none placeholder-white/60"
										defaultValue=""
										autoComplete="current-password"
										aria-invalid={Boolean(state.errors.password)}
										aria-describedby={state.errors.password ? "password-error" : undefined}
									/>
									<button
										type="button"
										onClick={() => setShowPass(s => !s)}
										className="ml-3 text-white/80 hover:text-white"
										aria-label={showPass ? "Hide password" : "Show password"}
										title={showPass ? "Hide password" : "Show password"}
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
											{showPass ? (
												<>
													<path d="M3 3l18 18" />
													<path d="M10.7 6.1a8.7 8.7 0 0 1 9.3 5.9 8.7 8.7 0 0 1-2.9 3.7" />
													<path d="M6.9 7.5A10.8 10.8 0 0 0 2 12c2.2 4.3 6 7 10 7 1.2 0 2.4-.2 3.5-.6" />
													<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</>
											) : (
												<>
													<path d="M2 12c2.2-4.3 6-7 10-7s7.8 2.7 10 7c-2.2 4.3-6 7-10 7S4.2 16.3 2 12Z" />
													<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</>
											)}
										</svg>
									</button>
								</div>
								{state.errors.password ? (
									<p id="password-error" className="mt-2 text-xs text-red-300">{state.errors.password}</p>
								) : null}
							</label>

							<div className="mt-4 flex items-center justify-between text-xs md:text-sm text-white/80">
								<label className="inline-flex items-center gap-2 cursor-pointer select-none">
									<input type="checkbox" name="remember" defaultChecked={state.remember} className="w-4 h-4 rounded-[4px] text-[#6a1ea1] focus:ring-0" />
									<span>Remember me</span>
								</label>
								<Link to="/verify-code" className=" hover:underline ">
									Forgot Password?
								</Link>
							</div>

							{state.message && (
								<p role="status" aria-live="polite" className={`mt-3 text-sm ${messageClasses}`}>
									{state.message}
								</p>
							)}

							<div className="mt-6">
								<button
									type="submit"
									disabled={isPending}
									className="w-full bg-[#351F78] hover:bg-[#2a1760] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{isPending ? "Logging in..." : "Login"}
								</button>
							</div>
						</form>
					</section>

					<p className="mt-4 text-center text-white/85">
						Don't have an account?{" "}
						<Link to="/register" className="text-[#351F78] hover:underline ">
							Register
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}