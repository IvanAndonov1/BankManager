import { use, useState } from "react";
import { useActionState } from "react";
import { loginUser } from "../../../services/userService";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../contexts/AuthContext.jsx";

const initialState = {
	username: "",
	password: "",
	remember: false,
	message: ""
};

const roles = {
	'CUSTOMER': '/customer-dashboard',
	'EMPLOYEE': '/employee',
	'ADMIN': '/admin'
};

export default function Login() {
	const { userLogin } = use(AuthContext);
	const [showPass, setShowPass] = useState(false);
	const navigate = useNavigate();

	const formHandler = async (previousState, formData) => {
		try {
			const username = (formData.get("username") || "").toString().trim();
			const password = (formData.get("password") || "").toString().trim();
			const remember = Boolean(formData.get("remember"));

			if (!username || !password) {
				return {
					...previousState,
					username,
					password: "",
					remember,
					message: "All fields are required!",
				};
			}

			loginUser({ username, password })
				.then(user => {
					userLogin(user);
					navigate(roles[user.role]);
				});

			return {
				...previousState,
				username,
				password: "",
				remember,
				message: "Successfull login.",
			};
		} catch (err) {

		}
	};

	const [state, formAction, isPending] = useActionState(formHandler, initialState);

	return (
		<main className="fixed inset-0 overflow-hidden">
			<div className="relative h-full w-full bg-gradient-to-br from-[#6a1ea1] via-[#3a4fb6] to-[#0b84b9]">
				<div
					className="pointer-events-none absolute inset-0 opacity-25"
					style={{
						backgroundImage:
							"repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0px, rgba(255,255,255,.08) 2px, transparent 2px, transparent 36px)",
					}}
				/>
				<div className="absolute top-6 left-6 text-white/90 font-semibold">
					Logo
				</div>

				<div className="relative z-10 w-full max-w-xl mx-auto pt-24 px-4 text-white">
					<h1 className="text-4xl md:text-5xl font-bold text-center">
						Banking You Want To Use
					</h1>

					<section
						className="mt-10 md:mt-12 rounded-2xl
              bg-white/12 backdrop-blur-md ring-1 ring-white/25
              shadow-[0_30px_60px_-12px_rgba(0,0,0,.45)]
              p-6 md:p-8 text-white/90 relative"
					>
						<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/30" />

						<form action={formAction} className="relative">
							<label className="block mb-6">
								<span className="block text-sm text-white/85">Username</span>
								<input
									type="text"
									name="username"
									className="mt-2 w-full bg-transparent outline-none border-b border-white/50 focus:border-white placeholder-white/60 pb-2"
									defaultValue={state.username}
									autoComplete="username"
								/>
							</label>

							<label className="block">
								<span className="block text-sm text-white/85">Password</span>
								<div className="mt-2 flex items-center border-b border-white/50 focus-within:border-white pb-2">
									<input
										type={showPass ? "text" : "password"}
										name="password"
										className="w-full bg-transparent outline-none placeholder-white/60"
										defaultValue=""
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPass((s) => !s)}
										className="ml-3 text-white/80 hover:text-white"
										aria-label={showPass ? "Hide password" : "Show password"}
										title={showPass ? "Hide password" : "Show password"}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											className="w-5 h-5 fill-none stroke-current"
											strokeWidth="1.8"
										>
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
							</label>

							<div className="mt-4 flex items-center justify-between text-xs md:text-sm text-white/80">
								<label className="inline-flex items-center gap-2 cursor-pointer select-none">
									<input
										type="checkbox"
										name="remember"
										defaultChecked={state.remember}
										className="w-4 h-4 rounded-[4px] text-[#6a1ea1] focus:ring-0"
									/>
									<span>Remember me</span>
								</label>
								<a className="cursor-pointer hover:underline">Forgot Password?</a>
							</div>

							{state.message && (
								<p
									role="status"
									aria-live="polite"
									className="mt-3 text-sm  text-red-600"
								>
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
						<a href="/register" className="text-[#351F78] hover:underline ">
							Register
						</a>
					</p>
				</div>
			</div>
		</main>
	);
}