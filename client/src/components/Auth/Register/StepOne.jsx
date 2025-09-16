
export default function StepOne({ values = {}, onChange }) {
	return (
		<div className="space-y-5">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<label className="block text-sm text-white/90">
					<span className="block mb-2">First Name</span>
					<input value={values.firstName || ""} onChange={(e) => onChange?.({ firstName: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
				</label>
				<label className="block text-sm text-white/90">
					<span className="block mb-2">Last Name</span>
					<input value={values.lastName || ""} onChange={(e) => onChange?.({ lastName: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
				</label>
			</div>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Phone Number</span>
				<input value={values.phone || ""} placeholder="+359" onChange={(e) => onChange?.({ phone: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
			<label className="block text-sm text-white/90">
				<span className="block mb-2">Email Address</span>
				<input value={values.email || ""} onChange={(e) => onChange?.({ email: e.target.value })} className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none" />
			</label>
		</div>
	);
} 