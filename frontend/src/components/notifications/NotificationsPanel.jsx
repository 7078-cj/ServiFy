import React from "react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import NotificationItem from "./NotificationItem";

export default function NotificationsPanel({
    notifications,
    onMarkAllRead,
    onDeleteNotification,
    loading = false,
    deletingIds = [],
    markingAllRead = false,
    connectionStatus = "disconnected",
}) {
    const hasUnread = notifications.some((n) => n.unread);
    const statusTone =
        connectionStatus === "connected"
            ? "bg-emerald-100 text-emerald-700"
            : connectionStatus === "connecting"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600";
    const statusLabel =
        connectionStatus === "connected"
            ? "Connected"
            : connectionStatus === "connecting"
                ? "Connecting..."
                : "Offline";

    return (
        <div className="flex max-h-[min(70vh,28rem)] flex-col">
            <div className="shrink-0 border-b border-gray-100 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                    <DialogTitle className="text-base font-semibold text-gray-900">Notifications</DialogTitle>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone}`}>
                        {statusLabel}
                    </span>
                </div>
                <DialogDescription className="mt-0.5 text-xs text-gray-500">
                    {loading
                        ? "Loading notifications..."
                        : `${notifications.length} update${notifications.length === 1 ? "" : "s"}`}
                </DialogDescription>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {loading ? (
                    <p className="px-3 py-10 text-center text-sm text-gray-500">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p className="px-3 py-10 text-center text-sm text-gray-500">You&apos;re all caught up.</p>
                ) : (
                    <ul className="flex flex-col gap-0.5">
                        {notifications.map((n) => (
                            <li key={n.id}>
                                <NotificationItem
                                    notification={n}
                                    onDelete={onDeleteNotification}
                                    deleting={deletingIds.includes(n.id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {onMarkAllRead && notifications.length > 0 && !loading && (
                <div className="shrink-0 border-t border-gray-100 px-4 py-3">
                    <button
                        type="button"
                        disabled={!hasUnread || markingAllRead}
                        onClick={onMarkAllRead}
                        className="w-full rounded-lg py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        {markingAllRead ? "Marking all as read..." : "Mark all as read"}
                    </button>
                </div>
            )}
        </div>
    );
}
