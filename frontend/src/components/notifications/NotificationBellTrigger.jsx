import React, { forwardRef } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bell button for use as `trigger` on NotificationsDialog (`asChild`).
 * Must forward ref so Radix DialogTrigger can attach behavior.
 */
const NotificationBellTrigger = forwardRef(function NotificationBellTrigger(
    { unreadCount = 0, className = "", ...props },
    ref
) {
    return (
        <button
            ref={ref}
            type="button"
            title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
            className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500",
                "transition-all duration-200 hover:bg-blue-50 hover:text-blue-600",
                className
            )}
            {...props}
        >
            <Bell size={22} strokeWidth={1.8} />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
                </span>
            )}
        </button>
    );
});

export default NotificationBellTrigger;
