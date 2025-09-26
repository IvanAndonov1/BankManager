import { Link } from "react-router";

function ProfileCard({ 
	avatar = null, 
	title, 
	subtitle, 
	footerActionLabel, 
	employee, 
	promoteAccount, 
	demoteAccount 
}) {
	employee = { ...employee, createdAt: employee.createdAt?.substr(0, 10) };
	return (
		<div className="w-96 shrink-0 bg-white rounded-2xl shadow-md p-6">
			<div className="flex flex-col items-center text-center">
				{avatar ?? <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />}
				<div className="space-y-0.5">
					<h3 className="text-gray-900 font-semibold">{title}</h3>
					{subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
				</div>
			</div>

			<div className="mt-6 space-y-3 text-sm">
				{Object.entries(employee).map(([label, value], idx) => (
					<div key={idx} className="flex items-center justify-between">
						<span className="text-gray-500">{label}</span>
						<span className="text-gray-800">{value}</span>
					</div>
				))}
			</div>

			{footerActionLabel && (
				<>
					<div className="mt-6 pt-6 border-t text-center">
						<button
							className="cursor-pointer text-[#e11d48] font-medium hover:underline"
							type="button"
							onClick={demoteAccount}
						>
							{footerActionLabel}
						</button>
					</div>

					<div className="mt-6 pt-6 border-t text-center">
						<button
							className="cursor-pointer text-green-500 font-medium hover:underline"
							type="button"
							onClick={promoteAccount}
						>
							Promote Account
						</button>
					</div>
				</>

			)}
		</div>
	);
}

export default ProfileCard; 