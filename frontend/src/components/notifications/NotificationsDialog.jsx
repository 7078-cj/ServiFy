import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import NotificationBellTrigger from "./NotificationBellTrigger";
import NotificationsPanel from "./NotificationsPanel";
import { useNotificationListener } from "../../listeners/notificationListener";
import {
    deleteNotification,
    fetchNotifications,
    markAllNotificationsRead,
} from "../../api/notifications";

const SUPPORTED_TYPES = new Set(["booking", "message", "review", "reminder", "chat", "system", "business"]);

const getRelativeTimeLabel = (value) => {
    if (!value) return "Just now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    return date.toLocaleDateString();
};

const normalizeNotifications = (payload) => {
    const items = Array.isArray(payload)
        ? payload
        : payload?.results
            ? payload.results
            : payload?.data
                ? [payload.data]
                : payload
                    ? [payload]
                    : [];

    return items.map((item) => {
        const type = String(item?.type || item?.notification_type || "system").toLowerCase();
        const createdAt = item?.created_at || item?.createdAt || item?.timestamp || null;

        return {
            id: item?.id ?? crypto.randomUUID(),
            type: SUPPORTED_TYPES.has(type) ? type : "system",
            title: item?.title || "Notification",
            body: item?.body || item?.message || item?.description || "",
            timeLabel: item?.time_label || getRelativeTimeLabel(createdAt),
            unread: item?.unread ?? !(item?.read ?? true),
            createdAt,
        };
    });
};

export default function NotificationDialog({ trigger, notifications: controlled, onMarkAllRead }) {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    const [internal, setInternal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAllRead, setMarkingAllRead] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);

    const isControlled = controlled != null;
    const items = isControlled ? controlled : internal;
    const unreadCount = useMemo(() => items.filter((n) => n.unread).length, [items]);

    const loadNotifications = useCallback(async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const res = await fetchNotifications();
            setInternal(normalizeNotifications(res));
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (!isControlled) loadNotifications();
    }, [isControlled, loadNotifications]);

    const { connectionStatus } = useNotificationListener(currentUserId, setInternal, loadNotifications, normalizeNotifications);

    const handleMarkAllReadInternal = useCallback(() => {
        setMarkingAllRead(true);
        setInternal((prev) => prev.map((item) => ({ ...item, unread: false })));
        markAllNotificationsRead().catch((error) => {
            console.error("Failed to mark all notifications as read:", error);
            loadNotifications();
        }).finally(() => {
            setMarkingAllRead(false);
        });
    }, [loadNotifications]);

    const handleDeleteNotification = useCallback(async (notificationId) => {
        if (!notificationId) return;
        setDeletingIds((prev) => (prev.includes(notificationId) ? prev : [...prev, notificationId]));
        setInternal((prev) => prev.filter((item) => item.id !== notificationId));

        try {
            await deleteNotification(notificationId);
        } catch (error) {
            console.error("Failed to delete notification:", error);
            loadNotifications();
        } finally {
            setDeletingIds((prev) => prev.filter((id) => id !== notificationId));
        }
    }, [loadNotifications]);

    const handleMarkAllRead = isControlled ? onMarkAllRead : handleMarkAllReadInternal;

    return (
        <Dialog>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <NotificationBellTrigger unreadCount={unreadCount} />
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
                    loading={!isControlled && loading}
                    deletingIds={deletingIds}
                    markingAllRead={markingAllRead}
                    connectionStatus={connectionStatus}
                    onDeleteNotification={isControlled ? undefined : handleDeleteNotification}
                    onMarkAllRead={isControlled && !onMarkAllRead ? undefined : handleMarkAllRead}
                />
            </DialogContent>
        </Dialog>
    );
}
