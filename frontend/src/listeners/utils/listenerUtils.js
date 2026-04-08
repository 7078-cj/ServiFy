export function handleMessage(message, set) {

    const { type, data } = message

    if (type === "created") {
        set((prev) => {
            const exists = prev.some((item) => item.id === data.id)
            if (exists) {
                return prev.map((item) => (item.id === data.id ? data : item))
            }
            return [...prev, data]
        })

    } else if (type === "updated") {
        set((prev) =>
            prev.map((b) => (b.id === data.id ? data : b))
        )

    } else if (type === "deleted") {
        set((prev) =>
            prev.filter((b) => b.id !== data.id
    )
        )
    }
}