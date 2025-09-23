function LoadingSkeleton() {
	return (
		<div className="p-8 animate-pulse">
			<div className="h-7 w-48 bg-gray-200 rounded mb-6" />
			<div className="h-10 w-full bg-gray-200 rounded mb-6" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2 space-y-4">
					<div className="h-5 w-56 bg-gray-200 rounded" />
					<div className="h-40 w-full bg-gray-200 rounded" />
					<div className="h-32 w-full bg-gray-200 rounded" />
				</div>
				<div className="h-44 w-full bg-gray-200 rounded" />
			</div>
		</div>
	);
}

export default LoadingSkeleton;