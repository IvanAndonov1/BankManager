export default function StepThree({ values = {}, onChange }) {
	return (
		<div className="space-y-6">
			<label className="block text-sm text-white/90">
				<span className="block mb-2">ID Type</span>
				<select value={values.idType || ""} onChange={(e) => onChange?.({ idType: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none">
					<option value="" className="text-black">Select...</option>
					<option value="id" className="text-black">ID Card</option>
					<option value="passport" className="text-black">Passport</option>
				</select>
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">ID Number</span>
				<input value={values.idNumber || ""} onChange={(e) => onChange?.({ idNumber: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Valid Date</span>
				<input type="date" value={values.validDate || ""} onChange={(e) => onChange?.({ validDate: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<label className="block text-sm text-white/90">
					<span className="block mb-2">Upload ID (front)</span>
					<input type="file" onChange={(e) => onChange?.({ idFront: e.target.files?.[0] })} className="block text-white" />
				</label>
				<label className="block text-sm text-white/90">
					<span className="block mb-2">Upload ID (back)</span>
					<input type="file" onChange={(e) => onChange?.({ idBack: e.target.files?.[0] })} className="block text-white" />
				</label>
			</div>
		</div>
	);
} 