import { useState } from "react";
import { Link } from "react-router-dom";
import { handleChange } from "../../../utils/handleChange";

export default function Register() {
	const [values, setValues] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		email: "",
		dateOfBirth: "",
		phoneNumber: "",
		homeAddress: "",
		egn: ""
	});
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");

	function setFieldError(field, msg) {
		setErrors((e) => ({ ...e, [field]: msg }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setErrors({});
		setFormError("");

		const req = [
			"username", "password", "confirmPassword", "firstName", "lastName",
			"email", "dateOfBirth", "phoneNumber", "homeAddress", "egn"
		];
		let hasErr = false;

		for (const k of req) {
			if (!values[k]?.toString().trim()) {
				setFieldError(k, "This field is required.");
				hasErr = true;
			}
		}

		if (!hasErr && values.password !== values.confirmPassword) {
			setFieldError("confirmPassword", "Passwords do not match.");
			hasErr = true;
		}

		if (!hasErr && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			setFieldError("email", "Invalid email address.");
			hasErr = true;
		}

		if (!hasErr && !/^\d{10}$/.test(values.egn)) {
			setFieldError("egn", "EGN must be exactly 10 digits.");
			hasErr = true;
		}

		if (!hasErr && !/^(\+359|0)\d{8,9}$/.test(values.phoneNumber.replace(/\s+/g, ""))) {
			setFieldError("phoneNumber", "Invalid phone number.");
			hasErr = true;
		}

		if (hasErr) {
			setFormError("Please fix the errors below and try again.");
			return;
		}

		const { confirmPassword, username, ...rest } = values;
		const payload = { ...rest, name: username };

		try {
			console.log("Submitting payload:", payload);
		} catch (err) {
			setFormError(err?.message || "Registration failed. Please try again.");
		}
	}

	return (
		<div
			className="min-h-screen flex items-start justify-center pt-8"
			style={{ background: "linear-gradient(135deg, #5b1d77 0%, #0b82be 100%)" }}
		>
			<div className="w-full max-w-3xl">
				<div className="text-white text-3xl font-semibold text-center mb-6">Register</div>

				<form
					onSubmit={handleSubmit}
					className="mx-auto rounded-xl bg-white/15 backdrop-blur-md shadow-xl text-white p-8 w-[720px] max-w-[92vw] border border-white/20"
				>
					{formError && (
						<div className="mb-4 rounded-lg bg-red-500/20 border border-red-400/40 px-4 py-2 text-sm">
							{formError}
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">Username</label>
							<input
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.username}
								onChange={(e) => handleChange("username", e.target.value, setValues)}
								placeholder="john123"
								autoComplete="username"
							/>
							{errors.username && <p className="mt-1 text-xs text-red-200">{errors.username}</p>}
						</div>
						<div>
							<label className="block text-sm mb-1">Password</label>
							<input
								type="password"
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.password}
								onChange={(e) => handleChange("password", e.target.value, setValues)}
								placeholder="••••••••"
								autoComplete="new-password"
							/>
							{errors.password && <p className="mt-1 text-xs text-red-200">{errors.password}</p>}
						</div>
						<div>
							<label className="block text-sm mb-1">Confirm Password</label>
							<input
								type="password"
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.confirmPassword}
								onChange={(e) => handleChange("confirmPassword", e.target.value, setValues)}
								placeholder="••••••••"
								autoComplete="new-password"
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-xs text-red-200">{errors.confirmPassword}</p>
							)}
						</div>
						<div>
							<label className="block text-sm mb-1">First Name</label>
							<input
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.firstName}
								onChange={(e) => handleChange("firstName", e.target.value, setValues)}
								placeholder="John"
							/>
							{errors.firstName && <p className="mt-1 text-xs text-red-200">{errors.firstName}</p>}
						</div>
						<div>
							<label className="block text-sm mb-1">Last Name</label>
							<input
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.lastName}
								onChange={(e) => handleChange("lastName", e.target.value, setValues)}
								placeholder="Doe"
							/>
							{errors.lastName && <p className="mt-1 text-xs text-red-200">{errors.lastName}</p>}
						</div>
						<div>
							<label className="block text-sm mb-1">Email</label>
							<input
								type="email"
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.email}
								onChange={(e) => handleChange("email", e.target.value, setValues)}
								placeholder="john.doe@example.com"
							/>
							{errors.email && <p className="mt-1 text-xs text-red-200">{errors.email}</p>}
						</div>
						<div>
							<label className="block text-sm mb-1">Date of Birth</label>
							<input
								type="date"
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.dateOfBirth}
								onChange={(e) => handleChange("dateOfBirth", e.target.value, setValues)}
							/>
							{errors.dateOfBirth && (
								<p className="mt-1 text-xs text-red-200">{errors.dateOfBirth}</p>
							)}
						</div>
						<div>
							<label className="block text-sm mb-1">Phone Number</label>
							<input
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.phoneNumber}
								onChange={(e) => handleChange("phoneNumber", e.target.value, setValues)}
								placeholder="+359888123456"
							/>
							{errors.phoneNumber && (
								<p className="mt-1 text-xs text-red-200">{errors.phoneNumber}</p>
							)}
						</div>
						<div>
							<label className="block text-sm mb-1">EGN</label>
							<input
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.egn}
								onChange={(e) => handleChange("egn", e.target.value, setValues)}
								placeholder="0015151234"
							/>
							{errors.egn && <p className="mt-1 text-xs text-red-200">{errors.egn}</p>}
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm mb-1">Home Address</label>
							<input
								className="w-full h-11 px-3 rounded-lg bg-white/20 outline-none"
								value={values.homeAddress}
								onChange={(e) => handleChange("homeAddress", e.target.value, setValues)}
								placeholder="123 Main St, Sofia"
							/>
							{errors.homeAddress && (
								<p className="mt-1 text-xs text-red-200">{errors.homeAddress}</p>
							)}
						</div>
					</div>
					<div className="mt-6 flex items-center justify-between">
						<button
							type="submit"
							className="px-6 h-10 rounded-full bg-[#351F78] hover:opacity-95 text-white font-medium"
						>
							Register
						</button>
						<div className="text-sm text-white/90">
							Already have an account? <Link className="underline" to="/login">Login</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}