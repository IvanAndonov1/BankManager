import { useState } from "react";
import XIcon from "./XIIcon";

function DeclineCreditModal({ isOpen, onClose, onDecline, isLoading = false }) {
	const [reasons, setReasons] = useState([""]);

	const addReason = () => {
		setReasons([...reasons, ""]);
	};

	const removeReason = (index) => {
		if (reasons.length > 1) {
			setReasons(reasons.filter((_, i) => i !== index));
		}
	};

	const updateReason = (index, value) => {
		const newReasons = [...reasons];
		newReasons[index] = value;
		setReasons(newReasons);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const filteredReasons = reasons.filter(reason => reason.trim() !== "");
		if (filteredReasons.length === 0) {
			alert("Моля въведете поне една причина за отказ");
			return;
		}
		onDecline(filteredReasons);
		setReasons([""]);
	};

	const handleClose = () => {
		setReasons([""]);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
				<div className="flex items-center justify-between p-6 border-b">
					<h3 className="text-lg font-semibold text-gray-900">
						Decline Credit Request
					</h3>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
						disabled={isLoading}
					>
						<XIcon className="w-5 h-5" />
					</button>
				</div>

				<div>
					<div className="p-6 space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Reasons:
							</label>
							{reasons.map((reason, index) => (
								<div key={index} className="flex gap-2 mb-3">
									<textarea
										value={reason}
										onChange={(e) => updateReason(index, e.target.value)}
										placeholder={`Reason ${index + 1}...`}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
										rows="2"
										disabled={isLoading}
									/>
									{reasons.length > 1 && (
										<button
											type="button"
											onClick={() => removeReason(index)}
											className="px-2 py-1 text-red-600 hover:text-red-800 transition-colors"
											disabled={isLoading}
										>
											<XIcon className="w-4 h-4" />
										</button>
									)}
								</div>
							))}
							<button
								type="button"
								onClick={addReason}
								className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
								disabled={isLoading}
							>
								+ Add new reason
							</button>
						</div>
					</div>

					<div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							disabled={isLoading}
						>
							{isLoading && (
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							)}
							Decline
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeclineCreditModal;