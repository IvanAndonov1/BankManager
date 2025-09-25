import { use, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useParams } from "react-router";
import { editEmployeeInformation } from "../../../../services/adminService";

export default function ProfileTab({ employee, setter }) {
	const { user } = use(AuthContext);
	const { employeeId } = useParams();

	const [formData, setFormData] = useState({
		fullName: `${employee.firstName} ${employee.lastName}`,
		dateOfBirth: employee.dateOfBirth || "",
		email: employee.email || "",
		username: employee.username || "",
	});

	const [formKey, setFormKey] = useState(0);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const parts = (formData.fullName || "").trim().split(/\s+/);
		const firstName = parts[0] || "";
		const lastName = parts.slice(1).join(" ") || "";

		try {
			const result = await editEmployeeInformation(
				employeeId,
				user.token,
				{ ...formData, firstName, lastName }
			);

			setter(result);

			setFormKey((k) => k + 1);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form key={formKey} className="space-y-6 p-6" onSubmit={handleSubmit}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<label className="block">
					<span className="block text-sm text-gray-600 mb-1">Full Name</span>
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm"
					/>
				</label>

				<label className="block">
					<span className="block text-sm text-gray-600 mb-1">Date of Birth</span>
					<input
						type="text"
						name="dateOfBirth"
						value={formData.dateOfBirth}
						onChange={handleChange}
						className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm"
					/>
				</label>

				<label className="block">
					<span className="block text-sm text-gray-600 mb-1">Email Address</span>
					<input
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm"
					/>
				</label>

				<label className="block">
					<span className="block text-sm text-gray-600 mb-1">Username</span>
					<input
						type="text"
						name="username"
						value={formData.username}
						onChange={handleChange}
						className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm"
					/>
				</label>
			</div>

			<button
				type="submit"
				className="p-3 px-8 h-11 rounded-full text-white font-medium shadow bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9] hover:opacity-95"
			>
				Update
			</button>
		</form>
	);
}