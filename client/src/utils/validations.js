export function validateCredentials({ username, password }) {
	const errors = { username: "", password: "" };

	const u = username.trim();
	const p = password.trim();

	if (!u) errors.username = "Username is required.";
	else if (u.length < 3) errors.username = "Username must be at least 3 characters.";
	else if (!/^[A-Za-z0-9._-]{3,30}$/.test(u))
		errors.username = "Only letters, digits, dot, underscore and dash (3-30 chars).";

	if (!p) errors.password = "Password is required.";

	const hasErrors = Boolean(errors.username || errors.password);
	return { errors, hasErrors };
}

export function validate(vals) {
	const errs = {};

	if (!vals.firstName.trim()) errs.firstName = "First name is required.";
	if (!vals.lastName.trim()) errs.lastName = "Last name is required.";

	if (!vals.email.trim()) errs.email = "Email is required.";
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
		errs.email = "Invalid email format.";

	if (!vals.username.trim()) errs.username = "Username is required.";
	else if (vals.username.length < 3)
		errs.username = "Username must be at least 3 characters.";

	if (!vals.password) errs.password = "Password is required.";

	if (!vals.rePass) errs.rePass = "Confirm password is required.";
	else if (vals.password !== vals.rePass)
		errs.rePass = "Passwords do not match.";

	return errs;
}