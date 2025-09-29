import { useMemo } from "react";

function egnFormatOK(v = "") { return /^\d{10}$/.test(v); }

export default function StepTwo({ values = {}, onChange, errors = {} }) {
	const egnValid = useMemo(() => egnFormatOK(values.egn || ""), [values.egn]);

	return (
		<div className="space-y-5">
			<label className="block text-sm text-white/90">
				<span className="block mb-2">EGN</span>
				<input
					value={values.egn || ""}
					onChange={(e) => onChange?.({ egn: e.target.value })}
					className={`w-full bg-transparent border-b h-10 px-1 text-white outline-none ${values.egn
							? (egnValid ? "border-emerald-300" : "border-red-300")
							: "border-white/40"
						}`}
				/>
				<p className={`mt-1 text-xs ${!values.egn ? "text-white/60" : (egnValid ? "text-emerald-200" : "text-red-200")
					}`}>
					Exactly 10 digits; numbers only.
				</p>
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
					value={values.homeAddress || ""}
					onChange={(e) => onChange?.({ homeAddress: e.target.value })}
					className="w-full bg-transparent border-b border-white/40 h-10 px-1 text-white outline-none"
				/>
				{errors.homeAddress && <p className="mt-1 text-xs text-red-200">{errors.homeAddress}</p>}
			</label>
		</div>
	);
}