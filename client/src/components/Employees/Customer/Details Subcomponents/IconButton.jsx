function IconButton({ children, ariaLabel, color = "text-gray-700", ring = true, hoverBg = "", onClick }) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			onClick={(e) => onClick(e)}
			className={`w-8 h-8 rounded-full ${ring ? "ring-1 ring-gray-300" : ""} flex items-center justify-center ${color} ${hoverBg}`}
		>
			{children}
		</button>
	);
}


export default IconButton;