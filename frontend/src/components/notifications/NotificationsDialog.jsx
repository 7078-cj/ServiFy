import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MOCK_NOTIFICATIONS } from "../../data/mockNotifications";
import NotificationsPanel from "./NotificationsPanel";

/**
 * Notification center dialog. Uses mock data locally until an API is wired.
 * Pass `notifications` + `onMarkAllRead` later for a controlled mode.
 *
 * Default bell uses Radix’s own trigger (no `asChild`) so open/close works reliably.
 * Pass a custom `trigger` only if it uses React.forwardRef and spreads props to a DOM node.
 */
export default function NotificationsDialog({ trigger, notifications: controlled, onMarkAllRead }) {
    const [internal, setInternal] = useState(MOCK_NOTIFICATIONS);

    const isControlled = controlled != null;
    const items = isControlled ? controlled : internal;

    const unreadCount = items.filter((n) => n.unread).length;

    const handleMarkAllReadInternal = () => {
        setInternal((prev) => prev.map((n) => ({ ...n, unread: false })));
    };

    const handleMarkAllRead = isControlled ? onMarkAllRead : handleMarkAllReadInternal;

    return (
        <Dialog>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : (
                <DialogTrigger
                    className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500",
                        "transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                    )}
                    title={
                        unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"
                    }
                >
                    <Bell size={22} strokeWidth={1.8} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2 w-2" aria-hidden>
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
                        </span>
                    )}
                </DialogTrigger>
            )}
            <DialogContent
                showCloseButton
                className={cn(
                    "gap-0 p-0 sm:max-w-lg",
                    "border border-gray-200 bg-white text-gray-900 shadow-xl"
                )}
            >
                <NotificationsPanel
                    notifications={items}
                    onMarkAllRead={isControlled && !onMarkAllRead ? undefined : handleMarkAllRead}
                />
            </DialogContent>
        </Dialog>
    );
}
