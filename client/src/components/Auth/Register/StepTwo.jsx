export default function StepTwo({ values = {}, onChange, errors = {} }) {
	return (
		<div className="space-y-5">
			<label className="block text-sm text-white/90">
				<span className="block mb-2">EGN</span>
				<input
					value={values.egn || ""}
					onChange={(e) => onChange?.({ egn: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
				/>
				{errors.egn && <p className="mt-1 text-xs text-red-200">{errors.egn}</p>}
			</label>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Date of Birth</span>
				<input
					type="date"
					value={values.dateOfBirth || ""}
					onChange={(e) => onChange?.({ dateOfBirth: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
				/>
				{errors.dateOfBirth && <p className="mt-1 text-xs text-red-200">{errors.dateOfBirth}</p>}
			</label>

			<label className="block text-sm text-white/90">
				<span className="block mb-2">Home Address</span>
				<input
					value={values.address || ""}
					onChange={(e) => onChange?.({ address: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
				/>
				{errors.address && <p className="mt-1 text-xs text-red-200">{errors.address}</p>}
			</label>
		</div>
	);
}