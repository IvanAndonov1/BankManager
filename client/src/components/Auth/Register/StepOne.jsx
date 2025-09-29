import { useMemo } from "react";

function phoneFormatOK(v = "") {
	const plus = /^\+359\d{9}$/;
	const zero = /^0\d{9}$/;
	return plus.test(v) || zero.test(v);
}

function emailOK(v = "") {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function StepOne({ values = {}, onChange, errors = {} }) {
	const emailValid = useMemo(() => emailOK(values.email || ""), [values.email]);
	const phoneValid = useMemo(() => phoneFormatOK(values.phoneNumber || ""), [values.phoneNumber]);

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<label className="block text-sm text-white/90">
					<span className="block mb-2">First Name</span>
					<input
						value={values.firstName || ""}
						onChange={(e) => onChange?.({ firstName: e.target.value })}
						className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
					/>
					{errors.firstName && <p className="mt-1 text-xs text-red-200">{errors.firstName}</p>}
				</label>

				<label className="block text-sm text-white/90">
					<span className="block mb-2">Last Name</span>
					<input
						value={values.lastName || ""}
						onChange={(e) => onChange?.({ lastName: e.target.value })}
						className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
					/>
					{errors.lastName && <p className="mt-1 text-xs text-red-200">{errors.lastName}</p>}
				</label>
			</div>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Phone Number</span>
				<input
					value={values.phoneNumber || ""}
					placeholder="+359XXXXXXXXX or 0XXXXXXXXX"
					onChange={(e) => onChange?.({ phoneNumber: e.target.value })}
					className={`w-full bg-transparent border-b h-10 px-1 text-white outline-none ${values.phoneNumber
							? (phoneValid ? "border-emerald-300" : "border-red-300")
							: "border-white/40"
						}`}
				/>
				<p className={`mt-1 text-xs ${!values.phoneNumber ? "text-white/60" : (phoneValid ? "text-emerald-200" : "text-red-200")
					}`}>
					Must start with +359 and 9 more digits, or start with 0 and 9 more digits.
				</p>
				{errors.phoneNumber && <p className="mt-1 text-xs text-red-200">{errors.phoneNumber}</p>}
			</label>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Email Address</span>
				<input
					value={values.email || ""}
					onChange={(e) => onChange?.({ email: e.target.value })}
					className={`w-full bg-transparent border-b h-10 px-1 text-white outline-none ${values.email
							? (emailValid ? "border-emerald-300" : "border-red-300")
							: "border-white/40"
						}`}
				/>
				<p className={`mt-1 text-xs ${!values.email ? "text-white/60" : (emailValid ? "text-emerald-200" : "text-red-200")
					}`}>
					Must contain “@” and a valid domain.
				</p>
				{errors.email && <p className="mt-1 text-xs text-red-200">{errors.email}</p>}
			</label>
		</div>
	);
}