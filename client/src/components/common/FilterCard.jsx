import { useState } from "react";

export default function FilterCard({
	initialValues = {
		accountType: "ALL",
		username: "",
		email: "",
		egn: "",
		idNumber: "",
	},
	onApply,
	onReset,
}) {
	const [values, setValues] = useState(initialValues);
	const setField = (k, v) => setValues(p => ({ ...p, [k]: v }));

	const handleReset = () => {
		setValues(initialValues);
		onReset?.();
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-medium text-gray-700">
					<span style={{ color: "#351f78" }}>Filter</span>
				</div>

				<div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-black/10 bg-white">
					{["ALL", "DEBIT", "CREDIT"].map(type => (
						<label key={type} className="cursor-pointer">
							<input
								type="radio"
								name="accountType"
								className="hidden peer"
								checked={values.accountType === type}
								onChange={() => setField("accountType", type)}
							/>
							<span className="px-4 h-9 inline-flex items-center justify-center rounded-full text-sm font-medium text-gray-800 bg-white peer-checked:bg-[#351F78] peer-checked:text-white">
								{type === "ALL" ? "All" : type[0] + type.slice(1).toLowerCase()}
							</span>
						</label>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<input
					placeholder="Username"
					value={values.username}
					onChange={e => setField("username", e.target.value)}
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
				<input
					placeholder="Email"
					value={values.email}
					onChange={e => setField("email", e.target.value)}
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
				<input
					placeholder="EGN"
					value={values.egn}
					onChange={e => setField("egn", e.target.value)}
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
				<input
					placeholder="ID Number"
					value={values.idNumber}
					onChange={e => setField("idNumber", e.target.value)}
					className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
				/>
			</div>

			<div className="flex items-center justify-end gap-2">
				<button
					type="button"
					onClick={handleReset}
					className="px-5 py-2 rounded-full text-[#351F78] ring-1 ring-[#351F78] bg-white"
				>
					Reset
				</button>
				<button
					type="button"
					onClick={() => onApply?.(values)}
					className="px-5 py-2 rounded-full text-white shadow"
					style={{ backgroundColor: "#351F78" }}
				>
					Filter
				</button>
			</div>
		</>
	);
}