
export default function MapLegend() {
    return (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-gray-100 flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Business
            </span>
            <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Customer
            </span>
            <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-blue-400 inline-block rounded" />
                Route
            </span>
        </div>
    );
}