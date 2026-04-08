export function handleMessage(message, set) {

    const { type, data } = message

    if (type === "created") {
        set((prev) => [...prev, data])

    } else if (type === "updated") {
        set((prev) =>
            prev.map((b) => (b.id === data.id ? data : b))
        )

    } else if (type === "deleted") {
        set((prev) =>
            prev.filter((b) => b.id !== data)
        )
    }
}