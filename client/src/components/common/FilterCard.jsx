import { useEffect, useMemo, useState } from "react";

/**
 * Props:
 * - fields?: Array<{
 *     key: string;
 *     label: string;
 *     type: "text" | "number" | "select" | "radio";
 *     placeholder?: string;
 *     options?: string[]; // for select/radio
 *   }>
 * - initialValues?: Record<string, any>
 * - onApply?: (values) => void
 * - onReset?: () => void
 *
 * Ако НЕ подадеш `fields`, компонентът работи в стар режим:
 *  { accountType, username, email, egn, idNumber }
 */
export default function FilterCard({
	initialValues = {},
	onApply,
	onReset,
	fields = null,
}) {
	const defaultFields = useMemo(
		() => [
			{
				key: "accountType",
				label: "Account type",
				type: "radio",
				options: ["ALL", "DEBIT", "CREDIT"],
			},
			{ key: "username", label: "Username", type: "text", placeholder: "Username" },
			{ key: "email", label: "Email", type: "text", placeholder: "Email" },
			{ key: "egn", label: "EGN", type: "text", placeholder: "EGN" },
			{ key: "idNumber", label: "ID Number", type: "text", placeholder: "ID Number" },
		],
		[]
	);

	const usedFields = Array.isArray(fields) && fields.length ? fields : defaultFields;

	const makeInitial = (srcInitial) =>
		usedFields.reduce((acc, f) => {
			const fallback = f.type === "radio" ? (f.options?.[0] ?? "") : "";
			acc[f.key] = srcInitial[f.key] ?? fallback;
			return acc;
		}, {});

	const [values, setValues] = useState(makeInitial(initialValues));

	useEffect(() => {
		setValues(makeInitial(initialValues));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(initialValues), JSON.stringify(usedFields)]);

	const setField = (k, v) => setValues((p) => ({ ...p, [k]: v }));

	const handleReset = () => {
		setValues(makeInitial(initialValues));
		onReset?.();
	};

	const handleApply = () => {
		onApply?.(values);
	};

	const hasAccountTypeRadio = usedFields.some(
		(f) => f.key === "accountType" && f.type === "radio"
	);
	const accountTypeField = usedFields.find(
		(f) => f.key === "accountType" && f.type === "radio"
	);

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-medium text-gray-700">
					<span style={{ color: "#351f78" }}>Filter</span>
				</div>

				{hasAccountTypeRadio && (
					<div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-black/10 bg-white">
						{accountTypeField.options.map((type) => (
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
				)}
			</div>

			{/* Grid inputs */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{usedFields
					.filter((f) => !(f.key === "accountType" && f.type === "radio"))
					.map((f) => {
						if (f.type === "select") {
							return (
								<select
									key={f.key}
									value={values[f.key] ?? ""}
									onChange={(e) => setField(f.key, e.target.value)}
									className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
								>
									<option value="">{f.placeholder ?? f.label}</option>
									{(f.options || []).map((o) => (
										<option key={o} value={o}>
											{o}
										</option>
									))}
								</select>
							);
						}

						const isNumber = f.type === "number";
						return (
							<input
								key={f.key}
								placeholder={f.placeholder ?? f.label}
								value={values[f.key] ?? ""}
								onChange={(e) => {
									const v = isNumber ? e.target.value.replace(/[^\d.-]/g, "") : e.target.value;
									setField(f.key, v);
								}}
								type="text"
								className="w-full rounded-full bg-gray-100 ring-1 ring-gray-200 px-4 py-2 outline-none"
							/>
						);
					})}
			</div>

			{/* Actions */}
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
					onClick={handleApply}
					className="px-5 py-2 rounded-full text-white shadow"
					style={{ backgroundColor: "#351F78" }}
				>
					Filter
				</button>
			</div>
		</div>
	);
}
