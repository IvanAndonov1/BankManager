import { useState } from "react";

export default function SalaryTab({ value = 1500 }) {
	const [salary, setSalary] = useState(value);
	return (
		<div className="p-10 flex flex-col items-center gap-10">
			<div className="flex items-center justify-center gap-16 mt-10">
				<button type="button" aria-label="decrease" onClick={() => setSalary((s) => Math.max(0, s - 50))} className="w-12 h-12 rounded-full ring-2 ring-[#351F78] text-[#351F78] text-3xl flex items-center justify-center">−</button>
				<div className="text-3xl">{salary} EUR</div>
				<button type="button" aria-label="increase" onClick={() => setSalary((s) => s + 50)} className="w-12 h-12 rounded-full ring-2 ring-[#351F78] text-[#351F78] text-3xl flex items-center justify-center">+</button>
			</div>
			<button type="button" className="px-8 h-11 rounded-full text-white font-medium shadow bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9] hover:opacity-95">Update</button>
		</div>
	);
} 