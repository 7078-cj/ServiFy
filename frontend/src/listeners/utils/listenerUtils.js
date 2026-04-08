export function handleMessage(data,set) {
    console.log("Received booking event:", data)
    if (data.type === "created") {
        set((prev) => [...prev, data])
    } else if (data.type === "updated") {
        set((prev) =>
            prev.map((b) => (b.id === data.id ? data : b))
        )
    } else if (data.type === "deleted") {
        set((prev) => prev.filter((b) => b.id !== data))
    }
}