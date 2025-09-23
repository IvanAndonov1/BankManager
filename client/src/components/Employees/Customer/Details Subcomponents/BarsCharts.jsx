import { hslForScore } from "../../../../utils/utils";

function BarsChart({ criteria, totalLabel }) {
	return (
		<div className="mt-8">
			<div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Score Breakdown</div>

			<div className="grid grid-cols-[48px_1fr] gap-2">
				<div className="flex flex-col justify-between h-64 text-xs text-gray-400 select-none py-2">
					<span>100</span>
					<span>75</span>
					<span>50</span>
					<span>25</span>
					<span>0</span>
				</div>

				<div
					className="h-64 border border-gray-200 rounded-xl p-4 flex items-end gap-6 relative overflow-hidden"
					style={{
						backgroundImage:
							"repeating-linear-gradient(to top, rgba(229,231,235,.6) 0 1px, transparent 1px 32px)",
					}}
				>
					{criteria.map((c) => (
						<div key={c.key} className="flex-1 flex flex-col items-center justify-end h-full">
							<div className="relative w-12 h-full flex items-end justify-center">
								<div
									className="w-12 rounded-t-xl shadow-sm transition-[height] duration-500"
									style={{
										height: `${c.value}%`,
										background: `linear-gradient(to top, ${hslForScore(c.value)} 0%, ${hslForScore(
											Math.min(100, c.value + 20)
										)} 100%)`,
									}}
									title={`${c.label}: ${c.value}/100`}
								/>
								<div className="absolute -bottom-6 text-xs font-semibold text-gray-700">{c.value}</div>
							</div>
							<div className="mt-4 text-xs text-center text-gray-600 leading-tight">{c.label}</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-3 text-sm text-gray-600">
				Total: <span className="font-semibold">{totalLabel}</span>
			</div>
		</div>
	);
}

export default BarsChart;