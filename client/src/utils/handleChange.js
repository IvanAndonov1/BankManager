export function handleChange(field, value, setter) {
	setter((prev) => ({ ...prev, [field]: value }));
}