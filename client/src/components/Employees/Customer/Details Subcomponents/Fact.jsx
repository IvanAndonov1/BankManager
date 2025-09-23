function Fact({ label, value }) {
	return (
		<div className="rounded-lg border border-gray-200 px-3 py-2 bg-white/60">
			<div className="text-gray-500 text-xs uppercase tracking-wide">{label}</div>
			<div className="text-gray-800 font-medium break-words">{value ?? "—"}</div>
		</div>
	);
}

export default Fact;