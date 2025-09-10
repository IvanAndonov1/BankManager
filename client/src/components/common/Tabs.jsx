function Tabs({ items = [], activeKey, onChange }) {
	return (
		<div className="px-6 pt-4">
			<div className="flex gap-8 text-sm">
				{items.map((item) => {
					const isActive = item.key === activeKey;
					return (
						<button
							key={item.key}
							type="button"
							onClick={() => onChange?.(item.key)}
							className={`relative pb-3 font-medium ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
						>
							{item.label}
							<span
								className={`absolute left-0 -bottom-[1px] h-0.5 rounded-full transition-all ${isActive ? "w-full bg-[#6a1ea1]" : "w-0 bg-transparent"}`}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Tabs; 