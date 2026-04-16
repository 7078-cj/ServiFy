import React from "react";
import { Calendar, MessageSquare, Bell, Building2, Trash2 } from "lucide-react";

const typeConfig = {
    booking: { Icon: Calendar, iconClass: "text-blue-600 bg-blue-50" },
    message: { Icon: MessageSquare, iconClass: "text-violet-600 bg-violet-50" },
    reminder: { Icon: Bell, iconClass: "text-amber-600 bg-amber-50" },
    chat: { Icon: MessageSquare, iconClass: "text-indigo-600 bg-indigo-50" },
    business: { Icon: Building2, iconClass: "text-emerald-600 bg-emerald-50" },
};

export default function NotificationItem({ notification, onDelete, deleting = false }) {
    const { title, body, timeLabel, unread, type } = notification;
    const { Icon, iconClass } = typeConfig[type] || typeConfig.reminder;

    return (
        <article
            className={`flex gap-3 rounded-xl px-3 py-3 transition-colors ${
                unread ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-gray-50"
            }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                aria-hidden
            >
                <Icon size={18} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug">{title}</h4>
                    <div className="flex items-center gap-2">
                        {unread && (
                            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" title="Unread" />
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(notification.id)}
                                disabled={deleting}
                                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:text-gray-300"
                                aria-label="Delete notification"
                                title="Delete notification"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{body}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {timeLabel}
                </p>
            </div>
        </article>
    );
}
