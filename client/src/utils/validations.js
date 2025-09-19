export function validateCredentials({ username, password }) {
	const errors = { username: "", password: "" };

	if (!username?.trim()) errors.username = "Username is required.";
	if (!password?.trim()) errors.password = "Password is required.";

	const hasErrors = Boolean(errors.username || errors.password);
	return { errors, hasErrors };
}

export function validate(vals) {
	const errs = {};

	if (!vals.firstName?.trim()) errs.firstName = "First name is required.";
	if (!vals.lastName?.trim()) errs.lastName = "Last name is required.";

	if (!vals.email?.trim()) errs.email = "Email is required.";

	if (!vals.username?.trim()) errs.username = "Username is required.";
	if (!vals.password) errs.password = "Password is required.";

	if (!vals.confirmPassword) errs.confirmPassword = "Confirm password is required.";
	else if (vals.password !== vals.confirmPassword)
		errs.confirmPassword = "Passwords do not match.";

	if (!vals.egn?.trim()) errs.egn = "EGN is required.";
	if (!vals.dateOfBirth) errs.dateOfBirth = "Date of Birth is required.";
	if (!vals.address?.trim()) errs.address = "Address is required.";

	if (!vals.terms) errs.terms = "You must accept the Terms.";

	return errs;
}

export function validateRegister(vals = {}) {
	const e = {};

	if (!vals.firstName?.trim()) e.firstName = "First name is required.";
	if (!vals.lastName?.trim()) e.lastName = "Last name is required.";
	if (!vals.phoneNumber?.trim()) e.phoneNumber = "Phone number is required.";
	if (!vals.email?.trim()) e.email = "Email is required.";

	if (!vals.egn?.trim()) e.egn = "EGN is required.";
	if (!vals.dateOfBirth) e.dateOfBirth = "Date of Birth is required.";
	if (!vals.homeAddress?.trim()) e.homeAddress = "Address is required.";

	if (!vals.username?.trim()) e.username = "Username is required.";
	if (!vals.password) e.password = "Password is required.";
	if (!vals.confirmPassword) e.confirmPassword = "Confirm password is required.";
	else if (vals.password !== vals.confirmPassword) e.confirmPassword = "Passwords do not match.";
	if (!vals.terms) e.terms = "You must accept the Terms.";

	return e;
}

export function validateStep(vals = {}, stepKey = "one") {
	const e = {};
	if (stepKey === "one") {
		if (!vals.firstName?.trim()) e.firstName = "First name is required.";
		if (!vals.lastName?.trim()) e.lastName = "Last name is required.";
		if (!vals.phoneNumber?.trim()) e.phoneNumber = "Phone number is required.";
		if (!vals.email?.trim()) e.email = "Email is required.";
	} else if (stepKey === "two") {
		if (!vals.egn?.trim()) e.egn = "EGN is required.";
		if (!vals.dateOfBirth) e.dateOfBirth = "Date of Birth is required.";
		if (!vals.homeAddress?.trim()) e.homeAddress = "Address is required.";
	} else if (stepKey === "four") {
		if (!vals.username?.trim()) e.username = "Username is required.";
		if (!vals.password) e.password = "Password is required.";
		if (!vals.confirmPassword) e.confirmPassword = "Confirm password is required.";
		else if (vals.password !== vals.confirmPassword) e.confirmPassword = "Passwords do not match.";
		if (!vals.terms) e.terms = "You must accept the Terms.";
	}

	return { errors: e, hasErrors: Object.keys(e).length > 0 };
}
