import React from "react";
import { Calendar, MessageSquare, Star, Info } from "lucide-react";

const typeConfig = {
    booking: { Icon: Calendar, iconClass: "text-blue-600 bg-blue-50" },
    message: { Icon: MessageSquare, iconClass: "text-violet-600 bg-violet-50" },
    review: { Icon: Star, iconClass: "text-amber-600 bg-amber-50" },
    system: { Icon: Info, iconClass: "text-gray-600 bg-gray-100" },
};

export default function NotificationItem({ notification }) {
    const { title, body, timeLabel, unread, type } = notification;
    const { Icon, iconClass } = typeConfig[type] || typeConfig.system;

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
                    {unread && (
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" title="Unread" />
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{body}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {timeLabel}
                </p>
            </div>
        </article>
    );
}
