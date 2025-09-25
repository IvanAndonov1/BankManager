import FilterCard from "./FilterCard";

/**
 * Този wrapper подава банкови полета и връща стойности едновременно:
 * - в стария ти формат { accountType, username, email, egn, idNumber }
 * - плюс банкови: { accountNumber, minBalance, maxBalance, currency }
 *
 * Така можеш да пуснеш същия buildPredicate / onApply логика,
 * без да променяш другаде кода. Ако старият код игнорира
 * допълнителните ключове — нищо не се чупи.
 */
export default function BankFilterCard({
	initial = {
		accountType: "ALL",
		username: "",
		email: "",
		egn: "",
		idNumber: "",
		accountNumber: "",
		minBalance: "",
		maxBalance: "",
		currency: "",
	},
	onApply,
	onReset,
}) {
	const fields = [
		{ key: "accountType", label: "Account type", type: "radio", options: ["ALL", "DEBIT", "CREDIT"] },
		{ key: "accountNumber", label: "Account number", type: "text", placeholder: "IBAN" },
		{ key: "minBalance", label: "Min balance", type: "number", placeholder: "Min balance" },
		{ key: "maxBalance", label: "Max balance", type: "number", placeholder: "Max balance" },
		// По избор: валута, ако я поддържаш
		{ key: "currency", label: "Currency", type: "select", options: ["", "EUR", "BGN", "USD", "GBP"] },

		// Оставям и user полетата, ако ги ползваш другаде (back-compat)
		{ key: "username", label: "Username", type: "text", placeholder: "Username" },
		{ key: "email", label: "Email", type: "text", placeholder: "Email" },
		{ key: "egn", label: "EGN", type: "text", placeholder: "EGN" },
		{ key: "idNumber", label: "ID Number", type: "text", placeholder: "ID Number" },
	];

	const handleApply = (values) => {
		// Връщаме смесения формат за обратна съвместимост
		const payload = {
			accountType: values.accountType ?? "ALL",
			username: values.username?.trim() ?? "",
			email: values.email?.trim() ?? "",
			egn: values.egn?.trim() ?? "",
			idNumber: values.idNumber?.trim() ?? "",

			// банкови
			accountNumber: values.accountNumber?.trim() ?? "",
			minBalance: values.minBalance !== "" ? Number(values.minBalance) : "",
			maxBalance: values.maxBalance !== "" ? Number(values.maxBalance) : "",
			currency: values.currency ?? "",
		};

		onApply?.(payload);
	};

	return (
		<FilterCard
			fields={fields}
			initialValues={initial}
			onApply={handleApply}
			onReset={onReset}
		/>
	);
}
