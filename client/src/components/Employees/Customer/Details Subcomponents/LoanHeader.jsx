import CheckIcon from "./CheckIcon";
import ChevronIcon from "./ChevronIcon";
import IconButton from "./IconButton";
import XIcon from "./XIIcon";

function LoanHeader({ title, open, onToggle }) {
	return (
		<div className="flex items-center justify-between p-8">
			<div className="text-gray-700 font-medium text-2xl">{title}</div>

			<div className="flex items-center gap-4">
				<IconButton ariaLabel="Approve" color="text-green-600" ring hoverBg="hover:bg-green-50">
					<CheckIcon />
				</IconButton>
				<IconButton ariaLabel="Reject" color="text-red-600" ring hoverBg="hover:bg-red-50">
					<XIcon />
				</IconButton>
				<IconButton
					ariaLabel={open ? "Collapse" : "Expand"}
					color="text-gray-600"
					ring
					hoverBg="hover:bg-gray-50"
					onClick={onToggle}
				>
					<ChevronIcon className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
				</IconButton>
			</div>
		</div>
	);
}

export default LoanHeader;