function PasswordChecklist({ password = "" }) {
	const hasUpper = /[A-Z]/.test(password);
	const hasDigit = /\d/.test(password);

	const Item = ({ ok, text }) => (
		<div className={`text-xs mt-1 flex items-center gap-2 ${ok ? "text-emerald-300" : "text-red-200"}`}>
			<span className={`inline-block w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-300" : "bg-red-300"}`} />
			{text}
		</div>
	);

	return (
		<div className="mt-2">
			<Item ok={hasUpper} text="Contains at least one uppercase letter" />
			<Item ok={hasDigit} text="Contains at least one digit" />
		</div>
	);
}

export default function StepFour({ values = {}, onChange, errors = {} }) {
	const pwd = values.password || "";
	const confirm = values.confirmPassword || "";
	const match = !!pwd && !!confirm && pwd === confirm;

	return (
		<div className="space-y-6">
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Username</span>
				<input
					value={values.username || ""}
					onChange={(e) => onChange?.({ username: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
					autoComplete="username"
				/>
				{errors.username && <p className="mt-1 text-xs text-red-200">{errors.username}</p>}
			</label>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Password</span>
				<input
					type="password"
					value={pwd}
					onChange={(e) => onChange?.({ password: e.target.value })}
					className={`w-full bg-transparent border-b h-10 px-1 text-white outline-none ${pwd ? (/[A-Z]/.test(pwd) && /\d/.test(pwd) ? "border-emerald-300" : "border-red-300") : "border-white/40"
						}`}
					autoComplete="new-password"
				/>
				<PasswordChecklist password={pwd} />
				{errors.password && <p className="mt-1 text-xs text-red-200">{errors.password}</p>}
			</label>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Confirm Password</span>
				<input
					type="password"
					value={confirm}
					onChange={(e) => onChange?.({ confirmPassword: e.target.value })}
					className={`w-full bg-transparent border-b h-10 px-1 text-white outline-none ${confirm ? (match ? "border-emerald-300" : "border-red-300") : "border-white/40"
						}`}
					autoComplete="new-password"
				/>
				{!match && confirm && (
					<p className="mt-1 text-xs text-red-200">Passwords do not match.</p>
				)}
				{errors.confirmPassword && (
					<p className="mt-1 text-xs text-red-200">{errors.confirmPassword}</p>
				)}
			</label>

			<label className="flex items-center gap-3 text-white/90 text-sm">
				<input
					type="checkbox"
					checked={!!values.terms}
					onChange={(e) => onChange?.({ terms: e.target.checked })}
				/>
				<span>I agree to the Terms & Conditions</span>
			</label>
			{errors.terms && <p className="text-xs text-red-200">{errors.terms}</p>}
		</div>
	);
}