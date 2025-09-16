import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validate } from "../../../utils/validations";
import { handleChange } from "../../../utils/handleChange";
import { registerUser } from "../../../services/userService";

export default function Register() {
	const [values, setValues] = useState({
		firstName: "",
		lastName: "",
		email: "",
		username: "",
		password: ""
	});

	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");
	const [rePass, setRePass] = useState('');
	const navigate = useNavigate();

	function handleSubmit(e) {
		e.preventDefault();
		try {
			const validationErrors = validate({ ...values, rePass });
			setErrors(validationErrors);

			if (Object.keys(validationErrors).length === 0) {
				setMessage("Registration submitted.");

				if (values.password == rePass) {
					registerUser(values)
						.then(() => {
							navigate('/login');
						})
				} else {
					setMessage("Passwords don\'t match!");
				}

				console.log("Register submit values:", values);
			} else {
				setMessage("Please fix the highlighted errors.");
			}
		} catch (err) {

		}
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center py-8"
			style={{ background: "linear-gradient(135deg, #5b1d77 0%, #0b82be 100%)" }}
		>
			<div className="w-full max-w-3xl">
				<div className="text-white text-3xl font-semibold text-center mb-6">
					Register
				</div>

				<div className="relative mt-6">
					<form
						onSubmit={handleSubmit}
						className="mx-auto rounded-xl bg-white/15 backdrop-blur-md shadow-xl text-white p-8 w-[680px] max-w-[90vw] border border-white/20 max-h-[85vh] overflow-y-auto"
						noValidate
					>
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<label className="block text-sm text-white/90">
									<span className="block mb-2">First Name</span>
									<input
										value={values.firstName}
										onChange={(e) => handleChange("firstName", e.target.value, setValues)}
										className={`w-full bg-transparent border-b h-10 px-1 outline-none ${errors.firstName ? "border-red-400" : "border-white/40"
											}`}
									/>
									{errors.firstName && (
										<p className="text-xs text-red-300 mt-1">{errors.firstName}</p>
									)}
								</label>
								<label className="block text-sm text-white/90">
									<span className="block mb-2">Last Name</span>
									<input
										value={values.lastName}
										onChange={(e) => handleChange("lastName", e.target.value, setValues)}
										className={`w-full bg-transparent border-b h-10 px-1 outline-none ${errors.lastName ? "border-red-400" : "border-white/40"
											}`}
									/>
									{errors.lastName && (
										<p className="text-xs text-red-300 mt-1">{errors.lastName}</p>
									)}
								</label>
							</div>

							<label className="block text-sm text-white/90">
								<span className="block mb-2">Email Address</span>
								<input
									value={values.email}
									onChange={(e) => handleChange("email", e.target.value, setValues)}
									className={`w-full bg-transparent border-b h-10 px-1 outline-none ${errors.email ? "border-red-400" : "border-white/40"
										}`}
								/>
								{errors.email && (
									<p className="text-xs text-red-300 mt-1">{errors.email}</p>
								)}
							</label>

							<label className="block text-sm text-white/90">
								<span className="block mb-2">Username</span>
								<input
									value={values.username}
									onChange={(e) => handleChange("username", e.target.value, setValues)}
									className={`w-full bg-transparent border-b h-10 px-1 outline-none ${errors.username ? "border-red-400" : "border-white/40"
										}`}
									autoComplete="username"
								/>
								{errors.username && (
									<p className="text-xs text-red-300 mt-1">{errors.username}</p>
								)}
							</label>

							<label className="block text-sm text-white/90">
								<span className="block mb-2">Password</span>
								<input
									type="password"
									autoComplete="new-password"
									value={values.password}
									onChange={(e) => handleChange("password", e.target.value, setValues)}
									className={`w-full bg-transparent border-b h-10 px-1 outline-none ${errors.password ? "border-red-400" : "border-white/40"
										}`}
								/>
								{errors.password && (
									<p className="text-xs text-red-300 mt-1">{errors.password}</p>
								)}
							</label>
							<label className="block text-sm text-white/90">
								<span className="block mb-2">Confirm Password</span>
								<input
									type="password"
									autoComplete="new-password"
									value={rePass}
									onChange={(e) => setRePass(e.target.value)}
									className={`w-full bg-transparent border-b h-10 px-1 outline-none ${errors.rePassword ? "border-red-400" : "border-white/40"
										}`}
								/>
								{errors.rePassword && (
									<p className="text-xs text-red-300 mt-1">{errors.rePassword}</p>
								)}
							</label>
						</div>

						{message && (
							<p className="mt-4 text-sm text-center">
								<span
									className={
										Object.keys(errors).length ? "text-red-300" : "text-emerald-300"
									}
								>
									{message}
								</span>
							</p>
						)}

						<div className="mt-6 flex items-center justify-end">
							<button
								type="submit"
								className="px-6 h-10 rounded-full bg-[#351F78] hover:opacity-95 text-white font-medium"
							>
								Register
							</button>
						</div>

						<div className="mt-6 text-center text-white/90 text-sm">
							Already have an account?{" "}
							<Link className="underline" to="/login">
								Login
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}