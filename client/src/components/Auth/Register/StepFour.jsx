export default function StepFour({ values = {}, onChange, errors = {} }) {
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
					value={values.password || ""}
					onChange={(e) => onChange?.({ password: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
					autoComplete="new-password"
				/>
				{errors.password && <p className="mt-1 text-xs text-red-200">{errors.password}</p>}
			</label>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Confirm Password</span>
				<input
					type="password"
					value={values.confirmPassword || ""}
					onChange={(e) => onChange?.({ confirmPassword: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
					autoComplete="new-password"
				/>
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