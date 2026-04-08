export function handleMessage(data,set) {
    console.log("Received booking event:", data)
    if (data.type === "created") {
        set((prev) => [...prev, data.booking])
    } else if (data.type === "updated") {
        set((prev) =>
            prev.map((b) => (b.id === data.booking.id ? data.booking : b))
        )
    } else if (data.type === "deleted") {
        set((prev) => prev.filter((b) => b.id !== data.booking_id))
    }
}