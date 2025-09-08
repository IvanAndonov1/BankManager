function InfoRow({ label, value }) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-gray-500">{label}</span>
			<span className="text-gray-800">{value}</span>
		</div>
	);
}

export default InfoRow;