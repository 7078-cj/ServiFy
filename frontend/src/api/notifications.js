import { getRequest, postRequest, deleteRequest } from "../utils/reqests/requests";
import { requireToken } from "./access";

const NOTIFICATIONS_BASE = "user/notifications/";

export function fetchNotifications() {
    const access = requireToken();
    return getRequest(NOTIFICATIONS_BASE, access);
}

export function deleteNotification(notificationId) {
    const access = requireToken();
    return deleteRequest(`${NOTIFICATIONS_BASE}${notificationId}/`, access);
}

export function markAllNotificationsRead() {
    const access = requireToken();
    return postRequest(`${NOTIFICATIONS_BASE}mark-all-read/`, {}, access);
}