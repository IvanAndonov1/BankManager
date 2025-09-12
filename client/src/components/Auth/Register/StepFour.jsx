export default function StepFour({ values = {}, onChange }) {
	return (
		<div className="space-y-6">
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Username</span>
				<input value={values.username || ""} onChange={(e) => onChange?.({ username: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Password</span>
				<input type="password" autoComplete="mew-password" value={values.password || ""} onChange={(e) => onChange?.({ password: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Confirm Password</span>
				<input type="password" autoComplete="mew-password" value={values.confirmPassword || ""} onChange={(e) => onChange?.({ confirmPassword: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="flex items-center gap-3 text-white/90 text-sm">
				<input type="checkbox" checked={!!values.terms} onChange={(e) => onChange?.({ terms: e.target.checked })} />
				<span>I agree to the Terms & Conditions</span>
			</label>
			<label className="flex items-center gap-3 text-white/90 text-sm">
				<input type="checkbox" checked={!!values.newsletter} onChange={(e) => onChange?.({ newsletter: e.target.checked })} />
				<span>Subscribe to our Newsletter and notifications</span>
			</label>
		</div>
	);
} 