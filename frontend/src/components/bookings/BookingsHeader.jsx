
export default function BookingsHeader({ count, selectedStatus, realtimeStatus }) {
    const statusLabel = {
        connected: "Live",
        connecting: "Connecting...",
    }[realtimeStatus] ?? "Offline";

    const statusColor = {
        connected: "text-emerald-600",
        connecting: "text-amber-600",
    }[realtimeStatus] ?? "text-gray-500";

    return (
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h1 className="text-lg font-semibold text-gray-900">Business Bookings</h1>
            <p className="text-xs text-gray-500 mt-0.5">
                {count} booking{count === 1 ? "" : "s"}
                {selectedStatus !== "all" && ` · ${selectedStatus}`}
            </p>
            <p className="text-xs font-medium text-gray-500 mt-1">
                Realtime updates:{" "}
                <span className={statusColor}>{statusLabel}</span>
            </p>
        </div>
    );
}