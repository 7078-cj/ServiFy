import { STATUS_OPTIONS } from "./utils/booking";



export default function StatusFilterBar({ selected, onChange }) {
    return (
        <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium mr-1">Status:</span>
            {["all", ...STATUS_OPTIONS].map((status) => (
                <button
                    key={status}
                    onClick={() => onChange(status)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                        selected === status
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
    );
}