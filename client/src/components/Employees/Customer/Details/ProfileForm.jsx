import { useEffect, useState, useMemo, use } from "react";
import { editCustomerInfo } from "../../../../services/employeeService";
import { AuthContext } from "../../../../contexts/AuthContext";

function splitFullName(fullName = "") {
	const parts = fullName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return { firstName: "", lastName: "" };
	const firstName = parts[0];
	const lastName = parts.slice(1).join(" ");
	return { firstName, lastName };
}

function normalizePhone(p = "") {
	return p.toString().trim();
}

export default function ProfileForm({ customer = {}, setUserDetails }) {
	const { user } = use(AuthContext);
	const [fullName, setFullName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [homeAddress, setHomeAddress] = useState("");
	const [egn, setEgn] = useState("");

	useEffect(() => {
		const fn = (customer?.firstName ?? "").toString().trim();
		const ln = (customer?.lastName ?? "").toString().trim();
		const full = [fn, ln].filter(Boolean).join(" ");

		setFullName(full);
		setDateOfBirth((customer?.dateOfBirth ?? "").toString());
		setEmail((customer?.email ?? "").toString());
		setPhoneNumber((customer?.phoneNumber ?? "").toString());
		setHomeAddress((customer?.homeAddress ?? "").toString());
		setEgn((customer?.egn ?? "").toString());
	}, [customer?.id]);

	const isValid = useMemo(() => {
		const { firstName } = splitFullName(fullName);
		return (
			firstName.length >= 2 &&
			email.trim().length > 3 &&
			egn.trim().length >= 10
		);
	}, [fullName, email, egn]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const { firstName, lastName } = splitFullName(fullName);
		const id = customer?.id;

		const payload = {
			firstName,
			lastName,
			dateOfBirth: dateOfBirth?.trim() || null,
			email: email.trim(),
			phoneNumber: normalizePhone(phoneNumber),
			homeAddress: homeAddress.trim(),
			egn: egn.trim(),
		};

		editCustomerInfo(id, user.token, payload)
			.then(result => setUserDetails(result));
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col">
					<label className="text-sm text-gray-600 mb-1">Full Name</label>
					<input
						type="text"
						className="h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a4fb6]"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						placeholder="e.g. Ivan Petrov"
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm text-gray-600 mb-1">Date of Birth</label>
					<input
						type="date"
						className="h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a4fb6]"
						value={dateOfBirth || ""}
						onChange={(e) => setDateOfBirth(e.target.value)}
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm text-gray-600 mb-1">Email Address</label>
					<input
						type="email"
						className="h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a4fb6]"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="user@example.com"
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm text-gray-600 mb-1">Phone Number</label>
					<input
						type="tel"
						className="h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a4fb6]"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						placeholder="+359 88 123 4567"
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm text-gray-600 mb-1">Home Address</label>
					<input
						type="text"
						className="h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a4fb6]"
						value={homeAddress}
						onChange={(e) => setHomeAddress(e.target.value)}
						placeholder="Sofia, bul, Example 1"
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm text-gray-600 mb-1">EGN</label>
					<input
						type="text"
						className="h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a4fb6]"
						value={egn}
						onChange={(e) => setEgn(e.target.value)}
						placeholder="XXXXXXXXXX"
					/>
				</div>
			</div>

			<div className="pt-2">
				<button
					type="submit"
					disabled={!isValid}
					className={`px-6 h-11 rounded-full text-white font-medium shadow
            bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9]
            hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed`}
				>
					Update
				</button>
			</div>
		</form>
	);
}