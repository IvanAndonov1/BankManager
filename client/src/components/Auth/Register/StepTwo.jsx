export default function StepTwo({ values = {}, onChange }) {
	return (
		<div className="space-y-5">
			<label className="block text-sm text-white/90">
				<span className="block mb-2">EGN</span>
				<input value={values.egn || ""} onChange={(e) => onChange?.({ egn: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Country</span>
				<input value={values.country || ""} onChange={(e) => onChange?.({ country: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">City</span>
				<input value={values.city || ""} onChange={(e) => onChange?.({ city: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Home Address</span>
				<input value={values.address || ""} onChange={(e) => onChange?.({ address: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
		</div>
	);
}