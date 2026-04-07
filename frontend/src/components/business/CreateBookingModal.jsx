import { useState } from "react"

export default function CreateBookingModal({
    open,
    onClose,
    onSubmit,
    loading,
    service
}) {
    const [date, setDate] = useState("")

    if (!open) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!date) return

        onSubmit({ date })
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-4">
                    Book {service?.name}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Date & Time */}
                    <div>
                        <label className="text-sm text-gray-600">
                            Select Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full mt-1 border rounded-lg px-3 py-2"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                        >
                            {loading ? "Booking..." : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}