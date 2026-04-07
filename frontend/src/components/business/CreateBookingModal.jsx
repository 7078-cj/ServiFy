import { useEffect, useState } from "react"
import AddLocationModal from "../AddLocationModal"

export default function CreateBookingModal({
    open,
    onClose,
    onSubmit,
    loading,
    service
}) {
    const [date, setDate] = useState("")
    const [locationModalOpen, setLocationModalOpen] = useState(false)
    const [location, setLocation] = useState({
        latitude: "",
        longitude: "",
        address: "",
    })

    useEffect(() => {
        if (!open) return
        setDate("")
        setLocation({
            latitude: "",
            longitude: "",
            address: "",
        })
    }, [open])

    if (!open) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!date || !location.latitude || !location.longitude) return

        const lat = parseFloat(location.latitude).toFixed(6)
        const lng = parseFloat(location.longitude).toFixed(6)

        onSubmit({
            date,
            latitude: lat,
            longitude: lng,
            address: location.address,
        })
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl">
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

                    <div>
                        <label className="text-sm text-gray-600">Location</label>
                        <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                            {location.latitude && location.longitude ? (
                                <>
                                    <p className="text-sm text-gray-700">
                                        {location.address || "Selected location"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Lat: {parseFloat(location.latitude).toFixed(6)} | Lng: {parseFloat(location.longitude).toFixed(6)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">No location selected yet.</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setLocationModalOpen(true)}
                            className="mt-2 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            {location.latitude && location.longitude ? "Change Location" : "Pick Location on Map"}
                        </button>
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
                            disabled={loading || !location.latitude || !location.longitude}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                        >
                            {loading ? "Booking..." : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>

            <AddLocationModal
                open={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                onSave={(loc) => {
                    setLocation({
                        latitude:
                            loc?.latitude != null
                                ? parseFloat(loc.latitude).toFixed(6)
                                : "",
                        longitude:
                            loc?.longitude != null
                                ? parseFloat(loc.longitude).toFixed(6)
                                : "",
                        address: loc?.address ?? "",
                    })
                    setLocationModalOpen(false)
                }}
            />
        </div>
    )
}