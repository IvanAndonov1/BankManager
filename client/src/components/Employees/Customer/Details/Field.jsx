function Field({ label, defaultValue }) {
	return (
		<label className="block">
			<span className="block text-sm text-gray-600 mb-1">{label}</span>
			<input
				type="text"
				defaultValue={defaultValue}
				className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm
				   focus:outline-none focus:ring-2 focus:ring-[#6a1ea1]/50 focus:border-[#6a1ea1]"
			/>
		</label>
	);
}

export default Field;