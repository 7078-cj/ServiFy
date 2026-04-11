import React from "react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import NotificationItem from "./NotificationItem";

export default function NotificationsPanel({ notifications, onMarkAllRead }) {
    const hasUnread = notifications.some((n) => n.unread);

    return (
        <div className="flex max-h-[min(70vh,28rem)] flex-col">
            <div className="shrink-0 border-b border-gray-100 px-5 py-4">
                <DialogTitle className="text-base font-semibold text-gray-900">Notifications</DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-gray-500">
                    {notifications.length} update{notifications.length === 1 ? "" : "s"} — mock data for now
                </DialogDescription>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {notifications.length === 0 ? (
                    <p className="px-3 py-10 text-center text-sm text-gray-500">You&apos;re all caught up.</p>
                ) : (
                    <ul className="flex flex-col gap-0.5">
                        {notifications.map((n) => (
                            <li key={n.id}>
                                <NotificationItem notification={n} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {onMarkAllRead && notifications.length > 0 && (
                <div className="shrink-0 border-t border-gray-100 px-4 py-3">
                    <button
                        type="button"
                        disabled={!hasUnread}
                        onClick={onMarkAllRead}
                        className="w-full rounded-lg py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
}
