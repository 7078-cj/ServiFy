import useWebSocket from "../hooks/useWebsocket";

export function useNotificationListener(userId, set, onRefresh, normalize) {
    const normalizeSingle = (item) => {
        if (!normalize || item == null) return item;
        const [normalized] = normalize(item);
        return normalized;
    };

    return useWebSocket(
        `ws/notification/${userId}/`,
        {
            onOpen: () => console.log("Connected to notification"),
            onRefresh,
            onClose: () => console.log("Disconnected from notification"),
            onMessage: (data) => {
                if (!data || typeof data !== "object") return;
                const eventType = data.type;
                const payload = data.data;

                if (eventType === "created") {
                    const normalized = normalizeSingle(payload);
                    if (!normalized) return;
                    set((prev) => {
                        const exists = prev.some((item) => item.id === normalized.id);
                        if (exists) {
                            return prev.map((item) => (item.id === normalized.id ? normalized : item));
                        }
                        return [normalized, ...prev];
                    });
                    return;
                }

                if (eventType === "updated" || eventType === "read") {
                    const normalized = normalizeSingle(payload);
                    if (!normalized) return;
                    set((prev) => prev.map((item) => (item.id === normalized.id ? normalized : item)));
                    return;
                }

                if (eventType === "deleted") {
                    const deletedId = payload?.id;
                    if (deletedId == null) return;
                    set((prev) => prev.filter((item) => item.id !== deletedId));
                }
            },
        }
    );
}