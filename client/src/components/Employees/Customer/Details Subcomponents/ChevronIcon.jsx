function ChevronIcon({ className = "", ...props }) {
	return (
		<svg viewBox="0 0 24 24" className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
			<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export default ChevronIcon;