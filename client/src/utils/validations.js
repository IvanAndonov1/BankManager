export function validateCredentials({ username, password }) {
	const errors = { username: "", password: "" };

	const u = username.trim();
	const p = password.trim();

	if (!u) errors.username = "Username is required.";
	else if (u.length < 3) errors.username = "Username must be at least 3 characters.";
	else if (!/^[A-Za-z0-9._-]{3,30}$/.test(u))
		errors.username = "Only letters, digits, dot, underscore and dash (3-30 chars).";

	if (!p) errors.password = "Password is required.";
	else if (p.length < 5) errors.password = "Password must be at least 8 characters.";

	const hasErrors = Boolean(errors.username || errors.password);
	return { errors, hasErrors };
}