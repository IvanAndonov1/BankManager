function Tab({ label, active, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`relative pb-3 font-medium ${active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
				}`}
		>
			{label}
			<span
				className={`absolute left-0 -bottom-[1px] h-0.5 rounded-full transition-all ${active ? "w-full bg-[#6a1ea1]" : "w-0 bg-transparent"
					}`}
			/>
		</button>
	);
}

export default Tab;