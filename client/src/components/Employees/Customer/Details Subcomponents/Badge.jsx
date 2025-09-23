function Badge({ children, color = "bg-gray-700" }) {
	return (
		<span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white ${color}`}>
			{children}
		</span>
	);
}

export default Badge;