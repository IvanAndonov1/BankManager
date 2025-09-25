import { use, useState } from 'react';
import { X } from 'lucide-react';
import { getAllEmployees, registerEmployee } from '../../../services/adminService';
import { AuthContext } from '../../../contexts/AuthContext';

function EmployeeRegisterModal({ isOpen, onClose, setter }) {
	const { user } = use(AuthContext);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		firstName: '',
		lastName: '',
		email: '',
		dateOfBirth: '',
		phoneNumber: '',
		homeAddress: '',
		egn: '',
		salary: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();


		registerEmployee(user.token, formData)
			.then(() => {
				getAllEmployees(user.token).then(setter).catch(() => setter([]));
			})
			.finally(() => onClose());
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-gray-800/70 to-purple-900/70 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
				<div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: '#351f78' }}>
					<h2 className="text-xl font-semibold text-white">Register Employee</h2>
					<button
						onClick={onClose}
						className="cursor-pointer text-white hover:text-gray-200 transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Username *
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Password *
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								First Name *
							</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Last Name *
							</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email *
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Date of Birth *
							</label>
							<input
								type="date"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Phone Number *
							</label>
							<input
								type="tel"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								placeholder="+359888111222"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								EGN *
							</label>
							<input
								type="text"
								name="egn"
								value={formData.egn}
								onChange={handleChange}
								maxLength={10}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Home Address *
							</label>
							<input
								type="text"
								name="homeAddress"
								value={formData.homeAddress}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Salary *
							</label>
							<input
								type="number"
								name="salary"
								value={formData.salary}
								onChange={handleChange}
								step="0.01"
								min="0"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 mt-6">
						<button
							onClick={onClose}
							className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="cursor-pointer px-4 py-2 rounded-md text-white transition-colors"
							style={{ backgroundColor: '#351f78' }}
							onMouseOver={(e) => e.target.style.backgroundColor = '#2a1860'}
							onMouseOut={(e) => e.target.style.backgroundColor = '#351f78'}
						>
							Register
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EmployeeRegisterModal;