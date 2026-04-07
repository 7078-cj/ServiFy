import { useEffect, useMemo, useState } from "react";
import { getBookings } from "../api/bookings";

const normalizeBookings = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

const formatDate = (value) => {
    if (!value) return "Not set";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
        case "approved":
            return "bg-blue-100 text-blue-700";
        case "completed":
            return "bg-green-100 text-green-700";
        case "cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-amber-100 text-amber-700";
    }
};

export default function Bookings() {
    const [rawBookings, setRawBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBookings(setRawBookings, setLoading);
    }, []);

    const bookings = useMemo(() => normalizeBookings(rawBookings), [rawBookings]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Track all your upcoming and past service bookings.
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

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(status)}`}
                                            >
                                                {status}
                                            </span>
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
