export default function ProfileTab() {
	return (
		<form className="space-y-6 p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<label className="block"><span className="block text-sm text-gray-600 mb-1">Full Name</span><input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm" /></label>
				<label className="block"><span className="block text-sm text-gray-600 mb-1">Date of Birth</span><input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm" /></label>
				<label className="block"><span className="block text-sm text-gray-600 mb-1">Email Address</span><input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm" defaultValue="example1@gmail.com" /></label>
				<label className="block"><span className="block text-sm text-gray-600 mb-1">Position</span><input type="text" className="w-full h-10 rounded-full border border-gray-200 px-4 text-sm" defaultValue="Loan Officer" /></label>
			</div>
			<button type="button" className="px-8 h-11 rounded-full text-white font-medium shadow bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9] hover:opacity-95">Update</button>
		</form>
	);
} 