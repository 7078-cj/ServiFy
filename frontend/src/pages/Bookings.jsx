import { useEffect, useMemo, useState } from "react";
import { cancelBooking, getBookings } from "../api/bookings";
import userBookingsListener from "../listeners/userBookingsListener";
import { useSelector } from "react-redux";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { normalizeBookings, formatDate, getStatusClass  } from "./BusinessBookingsDashboard";

// ... normalizeBookings, formatDate, getStatusClass unchanged

export default function Bookings() {
    const [rawBookings, setRawBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null)
    const [pendingCancelId, setPendingCancelId] = useState(null)
    const { profile } = useSelector((state) => state.profile);

    useEffect(() => {
        getBookings(setRawBookings, setLoading);
    }, []);

    const bookings = useMemo(() => normalizeBookings(rawBookings), [rawBookings]);

    const { connectionStatus: bookingsSocketStatus } = userBookingsListener(
        profile?.id,
        setRawBookings,
        () => getBookings(setRawBookings, setLoading)
    );

    const runCancelBooking = () => {
        if (pendingCancelId == null) return
        cancelBooking(
            pendingCancelId,
            (val) => setCancellingId(val ? pendingCancelId : null),
            () => {
                getBookings(setRawBookings, setLoading)
                setPendingCancelId(null)
            }
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <ConfirmDialog
                open={pendingCancelId != null}
                onClose={() => setPendingCancelId(null)}
                title="Cancel this booking?"
                description="The provider will be notified. You can book again later if needed."
                confirmText="Cancel booking"
                danger={false}
                loading={cancellingId === pendingCancelId}
                onConfirm={runCancelBooking}
            />
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Track all your upcoming and past service bookings.
                    </p>
                    <p className="mt-2 text-xs font-medium text-gray-500">
                        Realtime updates:{" "}
                        <span className={bookingsSocketStatus === "connected" ? "text-emerald-600" : bookingsSocketStatus === "connecting" ? "text-amber-600" : "text-gray-500"}>
                            {bookingsSocketStatus === "connected"
                                ? "Live"
                                : bookingsSocketStatus === "connecting"
                                    ? "Connecting..."
                                    : "Offline"}
                        </span>
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {loading ? (
                        <p className="p-6 text-sm text-gray-500">Loading bookings...</p>
                    ) : bookings.length === 0 ? (
                        <p className="p-6 text-sm text-gray-500">You have no bookings yet.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {bookings.map((booking) => {
                                const serviceName = booking?.service?.name || booking?.service_name || "Service";
                                const businessName = booking?.business?.name || booking?.business_name || "Business";
                                const bookingDate = booking?.date || booking?.booking_date || booking?.created_at;
                                const status = booking?.status || "pending";
                                const isPending = status.toLowerCase() === "pending"

                                return (
                                    <div key={booking.id} className="p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-base font-semibold text-gray-900">{serviceName}</h2>
                                                <p className="mt-1 text-sm text-gray-600">{businessName}</p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Scheduled: {formatDate(bookingDate)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(status)}`}>
                                                    {status}
                                                </span>

                                                {isPending && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingCancelId(booking.id)}
                                                        disabled={cancellingId === booking.id}
                                                        className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}