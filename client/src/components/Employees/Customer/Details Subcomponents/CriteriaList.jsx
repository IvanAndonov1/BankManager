import Badge from "./Badge";
import CheckIcon from "./CheckIcon";
import XIcon from "./XIIcon";

function CriteriaList({ criteria, passThreshold = 50 }) {
	return (
		<div>
			<div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Eligibility Criteria</div>
			<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{criteria.map((c) => (
					<li key={c.key} className="flex items-center gap-2 text-gray-700">
						{c.value >= passThreshold ? (
							<Badge color="bg-green-600">
								<CheckIcon strokeWidth={3} className="w-4 h-4" />
							</Badge>
						) : (
							<Badge color="bg-red-600">
								<XIcon strokeWidth={3} className="w-4 h-4" />
							</Badge>
						)}
						<span className="font-medium">{c.label}</span>
						<span className="ml-auto text-sm text-gray-500">{c.value}/100</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default CriteriaList;