function RequestsPlaceholder() {
	const requests = [{ id: "REQ-001", title: "Customer Loan" }];

	return (
		<div className="space-y-10">
			{requests.map((r) => (
				<div key={r.id}>
					<div className="flex items-center justify-between p-10">
						<div className="text-gray-700 font-medium text-2xl">{r.title}</div>

						<div className="flex items-center gap-4">
							<button
								type="button"
								aria-label="Approve"
								className="w-8 h-8 rounded-full ring-1 ring-gray-300 flex items-center justify-center
                           text-green-600 hover:bg-green-50"
							>
								<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>

							<button
								type="button"
								aria-label="Reject"
								className="w-8 h-8 rounded-full ring-1 ring-gray-300 flex items-center justify-center
                           text-red-600 hover:bg-red-50"
							>
								<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</div>
					</div>

					<div className="mt-4 border-t" />
				</div>
			))}

			<div className="flex justify-center">
				<button
					type="button"
					className="px-8 h-11 rounded-full text-white font-medium shadow
                     bg-gradient-to-r from-[#351F78] via-[#3a4fb6] to-[#0b84b9]
                     hover:opacity-95"
				>
					Update
				</button>
			</div>
		</div>
	);
}

export default RequestsPlaceholder;