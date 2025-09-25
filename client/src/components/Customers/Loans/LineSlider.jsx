import { useMemo } from "react";

export default function LineSlider({
	sliderName,
	details,
	min,
	max,
	value,
	onChange,
	step = 1,
}) {
	const percent = useMemo(() => {
		const v = Number(value);
		const lo = Number(min);
		const hi = Number(max);
		if (Number.isNaN(v) || hi <= lo) return 0;
		return ((v - lo) / (hi - lo)) * 100;
	}, [value, min, max]);

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			<div className="w-full flex justify-between items-center">
				<h2 className="text-xl font-light">{sliderName}</h2>
				<span className="text-lg px-6 py-2 rounded-3xl border-2 border-[#351F78] font-medium text-[#351F78]">
					{value} {details}
				</span>
			</div>

			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full h-3 rounded-lg appearance-none cursor-pointer"
				style={{
					background: `linear-gradient(to right, #D6CAFF 0%, #96D8FF ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`,
				}}
				aria-label={sliderName}
			/>
		</div>
	);
}