import { useEffect, useMemo, useState } from "react";
import { getAllBusinessBookings, updateBooking } from "../api/bookings";
import MapComponent from "../components/map/MapComponent";

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

const getBusinessKey = (booking) => {
    const id = booking?.business?.id ?? booking?.business_id ?? null;
    const name = booking?.business?.name || booking?.business_name || "Business";
    return id != null ? `id:${id}` : `name:${name}`;
};

const getBusinessLabel = (booking) =>
    booking?.business?.name || booking?.business_name || "Business";

const getServiceKey = (booking) => {
    const id = booking?.service?.id ?? booking?.service_id ?? null;
    const name = booking?.service?.name || booking?.service_name || "Service";
    return id != null ? `id:${id}` : `name:${name}`;
};

const getServiceLabel = (booking) =>
    booking?.service?.name || booking?.service_name || "Service";

const getBookingTimestamp = (booking) => {
    const raw = booking?.date || booking?.booking_date || booking?.created_at;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isNaN(t) ? 0 : t;
};

const getBookingStatus = (booking) => (booking?.status || "pending").toLowerCase();

const getBookingCoordinates = (booking) => {
    const latRaw =
        booking?.latitude ?? booking?.lat ?? booking?.location?.latitude ?? booking?.location?.lat;
    const lngRaw =
        booking?.longitude ?? booking?.lng ?? booking?.location?.longitude ?? booking?.location?.lng;

    const latitude = parseFloat(latRaw);
    const longitude = parseFloat(lngRaw);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude };
};

const getCustomerName = (booking) =>
    `${booking?.user?.first_name || ""} ${booking?.user?.last_name || ""}`.trim() ||
    booking?.user?.username ||
    booking?.customer_name ||
    "Customer";

const groupBookings = (bookings) => {
    const byBusiness = new Map();

    for (const booking of bookings) {
        const businessKey = getBusinessKey(booking);
        if (!byBusiness.has(businessKey)) {
            byBusiness.set(businessKey, {
                label: getBusinessLabel(booking),
                services: new Map(),
            });
        }

        const businessGroup = byBusiness.get(businessKey);
        const serviceKey = getServiceKey(booking);
        if (!businessGroup.services.has(serviceKey)) {
            businessGroup.services.set(serviceKey, {
                label: getServiceLabel(booking),
                bookings: [],
            });
        }

        businessGroup.services.get(serviceKey).bookings.push(booking);
    }

    const businessEntries = Array.from(byBusiness.entries()).sort((a, b) =>
        a[1].label.localeCompare(b[1].label)
    );

    return businessEntries.map(([businessKey, businessGroup]) => {
        const servicesEntries = Array.from(businessGroup.services.entries()).sort((a, b) =>
            a[1].label.localeCompare(b[1].label)
        );

        return {
            key: businessKey,
            label: businessGroup.label,
            services: servicesEntries.map(([serviceKey, serviceGroup]) => ({
                key: serviceKey,
                label: serviceGroup.label,
                bookings: serviceGroup.bookings.sort(
                    (a, b) => getBookingTimestamp(b) - getBookingTimestamp(a)
                ),
            })),
        };
    });
};

export default function BusinessBookingsDashboard() {
    const [rawBookings, setRawBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState("all");
    const [selectedService, setSelectedService] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [markerScope, setMarkerScope] = useState("all");

    const fetchBookings = () => {
        getAllBusinessBookings(setRawBookings, setLoading);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const bookings = useMemo(() => normalizeBookings(rawBookings), [rawBookings]);

    const businessOptions = useMemo(() => {
        const unique = new Map();
        for (const booking of bookings) {
            unique.set(getBusinessKey(booking), getBusinessLabel(booking));
        }

        return Array.from(unique.entries())
            .map(([key, label]) => ({ key, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [bookings]);

    const serviceOptions = useMemo(() => {
        const source =
            selectedBusiness === "all"
                ? bookings
                : bookings.filter((booking) => getBusinessKey(booking) === selectedBusiness);

        const unique = new Map();
        for (const booking of source) {
            unique.set(getServiceKey(booking), getServiceLabel(booking));
        }

        return Array.from(unique.entries())
            .map(([key, label]) => ({ key, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [bookings, selectedBusiness]);

    useEffect(() => {
        if (selectedService === "all") return;
        const stillExists = serviceOptions.some((s) => s.key === selectedService);
        if (!stillExists) setSelectedService("all");
    }, [serviceOptions, selectedService]);

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            if (selectedBusiness !== "all" && getBusinessKey(booking) !== selectedBusiness) {
                return false;
            }
            if (selectedService !== "all" && getServiceKey(booking) !== selectedService) {
                return false;
            }
            if (selectedStatus !== "all" && getBookingStatus(booking) !== selectedStatus) {
                return false;
            }
            return true;
        });
    }, [bookings, selectedBusiness, selectedService, selectedStatus]);

    const grouped = useMemo(() => groupBookings(filteredBookings), [filteredBookings]);

    const markerSourceBookings = markerScope === "all" ? bookings : filteredBookings;

    const mapMarkers = useMemo(() => {
        const markers = [];
        for (const booking of markerSourceBookings) {
            const coords = getBookingCoordinates(booking);
            if (!coords) continue;

            markers.push({
                id: booking.id,
                name: `${getBusinessLabel(booking)} - ${getServiceLabel(booking)} (${getCustomerName(booking)})`,
                latitude: coords.latitude,
                longitude: coords.longitude,
                logo: booking?.business?.logo || null,
            });
        }
        return markers;
    }, [markerSourceBookings]);

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

                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                    <h2 className="text-base font-semibold text-gray-900">Map Filters</h2>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                        <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selectedBusiness}
                            onChange={(e) => setSelectedBusiness(e.target.value)}
                        >
                            <option value="all">All businesses</option>
                            {businessOptions.map((business) => (
                                <option key={business.key} value={business.key}>
                                    {business.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            <option value="all">All services</option>
                            {serviceOptions.map((service) => (
                                <option key={service.key} value={service.key}>
                                    {service.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">All statuses</option>
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={markerScope}
                            onChange={(e) => setMarkerScope(e.target.value)}
                        >
                            <option value="all">Markers: all bookings</option>
                            <option value="filtered">Markers: filtered bookings</option>
                        </select>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        Showing {mapMarkers.length} booking marker{mapMarkers.length === 1 ? "" : "s"} on map.
                    </p>

                    <div className="mt-4 h-[420px] overflow-hidden rounded-xl border">
                        <MapComponent Markers={mapMarkers} userLocation={false} />
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {loading ? (
                        <p className="p-6 text-sm text-gray-500">Loading bookings...</p>
                    ) : filteredBookings.length === 0 ? (
                        <p className="p-6 text-sm text-gray-500">No bookings found for the selected filters.</p>
                    ) : (
                        <div className="p-4 sm:p-6 space-y-4">
                            {grouped.map((businessGroup) => {
                                const businessCount = businessGroup.services.reduce(
                                    (sum, service) => sum + service.bookings.length,
                                    0
                                );

                                return (
                                    <details
                                        key={businessGroup.key}
                                        className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                                        open
                                    >
                                        <summary className="cursor-pointer select-none px-4 py-4 sm:px-6 bg-gray-50 flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {businessGroup.label}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {businessCount} booking{businessCount === 1 ? "" : "s"}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">
                                                {businessGroup.services.length} service{businessGroup.services.length === 1 ? "" : "s"}
                                            </span>
                                        </summary>

                                        <div className="p-4 sm:p-6 space-y-4">
                                            {businessGroup.services.map((serviceGroup) => (
                                                <details
                                                    key={serviceGroup.key}
                                                    className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
                                                    open={businessGroup.services.length === 1}
                                                >
                                                    <summary className="cursor-pointer select-none px-4 py-3 sm:px-5 bg-white flex items-center justify-between gap-3">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {serviceGroup.label}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {serviceGroup.bookings.length} booking{serviceGroup.bookings.length === 1 ? "" : "s"}
                                                        </div>
                                                    </summary>

                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-100">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                        Customer
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
                                                                {serviceGroup.bookings.map((booking) => {
                                                                    const currentStatus = getBookingStatus(booking);
                                                                    const customerName = getCustomerName(booking);
                                                                    const bookingDate = booking?.date || booking?.booking_date || booking?.created_at;
                                                                    const isUpdating = updatingId === booking.id;

                                                                    return (
                                                                        <tr key={booking.id}>
                                                                            <td className="px-4 py-4 text-sm text-gray-700">{customerName}</td>
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
                                                </details>
                                            ))}
                                        </div>
                                    </details>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
