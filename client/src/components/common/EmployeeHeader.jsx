import { use } from "react";
import { AuthContext } from '../../contexts/AuthContext';

function EmployeeHeader() {
	const { user } = use(AuthContext);

	return (
		<>
			<div className="flex justify-between items-center">
				<p className="text-sm text-gray-600">
					Logged as <span className="font-medium">{user.username}</span>
				</p>
				<button className="cursor-pointer p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
					</svg>
				</button>
			</div>
			<div className="bg-white rounded-lg shadow p-0 w-full">
				<button
					className="px-6 py-2 text-white font-medium rounded-tl-lg rounded-bl-lg"
					style={{ backgroundColor: "#351f78" }}
				>
					Accounts
				</button>
			</div>
		</>
	);
}

export default EmployeeHeader;