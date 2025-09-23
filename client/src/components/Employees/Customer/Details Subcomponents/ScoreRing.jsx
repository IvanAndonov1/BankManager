import { hslForScore } from "../../../../utils/utils";

function ScoreRing({ percent }) {
	const R = 42;
	const C = 2 * Math.PI * R;
	const dash = (percent / 100) * C;
	const ringColor = hslForScore(percent);

	return (
		<div className="relative w-44 h-44">
			<svg className="w-44 h-44 rotate-[-90deg]" viewBox="0 0 100 100">
				<circle cx="50" cy="50" r={R} stroke="#e5e7eb" strokeWidth="10" fill="none" />
				<circle
					cx="50"
					cy="50"
					r={R}
					stroke={ringColor}
					strokeWidth="10"
					strokeLinecap="round"
					fill="none"
					strokeDasharray={`${dash} ${C}`}
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="text-center">
					<div className="text-3xl font-semibold" style={{ color: ringColor }}>
						{Math.round(percent)}
					</div>
					<div className="text-sm text-gray-500">/ 100</div>
				</div>
			</div>
		</div>
	);
}

export default ScoreRing;