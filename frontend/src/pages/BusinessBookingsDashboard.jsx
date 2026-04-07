import { useEffect, useMemo, useState } from "react";
import { getAllBusinessBookings, updateBooking } from "../api/bookings";

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

const STATUS_OPTIONS = ["pending", "approved", "completed", "cancelled"];

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

export default function BusinessBookingsDashboard() {
    const [rawBookings, setRawBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchBookings = () => {
        getAllBusinessBookings(setRawBookings, setLoading);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const bookings = useMemo(() => normalizeBookings(rawBookings), [rawBookings]);

    const setUpdatingLoading = (isLoading, bookingId) => {
        if (isLoading) {
            setUpdatingId(bookingId);
            return;
        }
        setUpdatingId(null);
    };

    const handleStatusUpdate = async (bookingId, status) => {
        await updateBooking(
            bookingId,
            { status },
            (isLoading) => setUpdatingLoading(isLoading, bookingId),
            fetchBookings
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Business Bookings Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        View all bookings for your businesses and update their status.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {loading ? (
                        <p className="p-6 text-sm text-gray-500">Loading bookings...</p>
                    ) : bookings.length === 0 ? (
                        <p className="p-6 text-sm text-gray-500">No business bookings found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Business
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Service
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Update
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {bookings.map((booking) => {
                                        const currentStatus = (booking?.status || "pending").toLowerCase();
                                        const customerName =
                                            booking?.user?.full_name ||
                                            booking?.user?.username ||
                                            booking?.customer_name ||
                                            "Customer";
                                        const businessName = booking?.business?.name || booking?.business_name || "Business";
                                        const serviceName = booking?.service?.name || booking?.service_name || "Service";
                                        const bookingDate = booking?.date || booking?.booking_date || booking?.created_at;
                                        const isUpdating = updatingId === booking.id;

                                        return (
                                            <tr key={booking.id}>
                                                <td className="px-4 py-4 text-sm text-gray-700">{customerName}</td>
                                                <td className="px-4 py-4 text-sm text-gray-700">{businessName}</td>
                                                <td className="px-4 py-4 text-sm text-gray-700">{serviceName}</td>
                                                <td className="px-4 py-4 text-sm text-gray-700">{formatDate(bookingDate)}</td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(currentStatus)}`}
                                                    >
                                                        {currentStatus}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <select
                                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
                                                        value={currentStatus}
                                                        disabled={isUpdating}
                                                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                                    >
                                                        {STATUS_OPTIONS.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
