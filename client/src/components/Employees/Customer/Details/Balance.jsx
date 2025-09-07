function Balance({ title, value, valueClass }) {
	return (
		<div className="text-center">
			<p className="text-gray-500 mb-2">{title}</p>
			<p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
		</div>
	);
}

export default Balance;