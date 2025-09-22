import Field from './Field';

function ProfileForm({ customer }) {
	return (
		<form className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Field label="Full Name" defaultValue={`${customer.firstName} ${customer.lastName}`} />
				<Field label="Date of Birth" defaultValue={customer.dateOfBirth} />
				<Field label="Email Address" defaultValue={customer.email} />
				<Field label="Phone Number" defaultValue={customer.phoneNumber} />
				<Field label="Home Address" defaultValue={customer.homeAddress} />
				<Field label="EGN" defaultValue={customer.egn} />
			</div>

			<div className="pt-2">
				<button
					type="button"
					className="px-6 h-11 rounded-full text-white font-medium shadow
                     bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9]
                     hover:opacity-95"
				>
					Update
				</button>
			</div>
		</form>
	);
}

export default ProfileForm;