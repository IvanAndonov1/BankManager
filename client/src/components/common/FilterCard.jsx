function FilterCard() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-medium text-gray-700">
					<span style={{ color: "#351f78" }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							fill="none" stroke="currentColor" strokeWidth="1.5"
							className="w-5 h-5">
							<path strokeLinecap="round" strokeLinejoin="round"
								d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
						</svg>
					</span>
					<span>Filter</span>
				</div>

				<div className="inline-flex items-center rounded-full p-1 shadow-sm ring-1 ring-black/10 bg-white">
					<label className="cursor-pointer">
						<input type="radio" name="accountType" defaultChecked className="hidden peer" />
						<span
							className="
        px-3 h-9 inline-flex items-center justify-center rounded-full text-sm font-medium
        text-gray-800 ring-1 ring-gray-300 bg-white
        peer-checked:bg-[#351F78] peer-checked:text-white peer-checked:ring-0 peer-checked:shadow
      "
						>
							Debit
						</span>
					</label>

					<div className="w-2" />

					<label className="cursor-pointer">
						<input type="radio" name="accountType" className="hidden peer" />
						<span
							className="
        px-3 h-9 inline-flex items-center justify-center rounded-full text-sm font-medium
        text-gray-800 ring-1 ring-gray-300 bg-white
        peer-checked:bg-[#351F78] peer-checked:text-white peer-checked:ring-0 peer-checked:shadow
      "
						>
							Credit
						</span>
					</label>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<input
					type="text" placeholder="First Name"
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
				<input
					type="text" placeholder="Last Name"
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
				<input
					type="text" placeholder="EGN"
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
				<input
					type="text" placeholder="ID Number"
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
			</div>

			<div className="flex items-center justify-end">
				<button className="cursor-pointer px-5 py-2 rounded-full text-white shadow"
					style={{ backgroundColor: "#351F78" }}>
					Filter
				</button>
			</div>
		</>
	);
}

export default FilterCard;


