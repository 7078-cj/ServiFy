import { useEffect, useMemo, useRef, useState } from "react";
import { getAllBusinessBookings, updateBooking } from "../api/bookings";
import MapComponent from "../components/map/MapComponent";
import businessBookingsListener from "../listeners/businessBookingsListener";
import { useSelector } from "react-redux";

export const normalizeBookings = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

export const formatDate = (value) => {
    if (!value) return "Not set";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

const STATUS_OPTIONS = ["pending", "approved", "completed", "cancelled"];

export const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
        case "approved":  return "bg-blue-100 text-blue-700";
        case "completed": return "bg-green-100 text-green-700";
        case "cancelled": return "bg-red-100 text-red-700";
        default:          return "bg-amber-100 text-amber-700";
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

const getBookingAddress = (booking) =>
    booking?.address || booking?.location?.address || "—";

const getBookingCoordinates = (booking) => {
    const latRaw = booking?.latitude ?? booking?.lat ?? booking?.location?.latitude ?? booking?.location?.lat;
    const lngRaw = booking?.longitude ?? booking?.lng ?? booking?.location?.longitude ?? booking?.location?.lng;
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

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function BusinessBookingsDashboard() {
    const [rawBookings, setRawBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [focusedBookingId, setFocusedBookingId] = useState(null);
    const { profile } = useSelector((state) => state.profile);
    const mapRef = useRef(null);

    const fetchBookings = () => getAllBusinessBookings(setRawBookings, setLoading);

    useEffect(() => { fetchBookings(); }, []);

    const bookings = useMemo(() => normalizeBookings(rawBookings), [rawBookings]);

    const filteredBookings = useMemo(() => {
        if (selectedStatus === "all") return bookings;
        return bookings.filter((b) => getBookingStatus(b) === selectedStatus);
    }, [bookings, selectedStatus]);

    const mapMarkers = useMemo(() => {
        const markers = [];
        const seenBusinessKeys = new Set();

        for (const booking of filteredBookings) {
            const coords = getBookingCoordinates(booking);
            if (coords) {
                markers.push({
                    id: `booking-${booking.id}`,
                    name: `${getBusinessLabel(booking)} - ${getServiceLabel(booking)} (${getCustomerName(booking)})`,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    logo: booking.user.profile.profile_image || null,
                    isBusiness: false,
                });
            }

            const businessKey = getBusinessKey(booking);
            if (!seenBusinessKeys.has(businessKey)) {
                const businessLat = parseFloat(booking?.business_latitude);
                const businessLng = parseFloat(booking?.business_longitude);
                if (!Number.isNaN(businessLat) && !Number.isNaN(businessLng)) {
                    seenBusinessKeys.add(businessKey);
                    markers.push({
                        id: `business-${businessKey}`,
                        name: getBusinessLabel(booking),
                        latitude: businessLat,
                        longitude: businessLng,
                        logo: booking?.business_logo || null,
                        isBusiness: true,
                    });
                }
            }
        }
        return markers;
    }, [filteredBookings]);

    const routeSources = useMemo(() => {
        return filteredBookings.map((booking) => {
            const to = getBookingCoordinates(booking);
            if (!to) return null;
            const businessLat = parseFloat(booking?.business_latitude);
            const businessLng = parseFloat(booking?.business_longitude);
            if (Number.isNaN(businessLat) || Number.isNaN(businessLng)) return null;
            if (businessLat === to.latitude && businessLng === to.longitude) return null;
            return {
                id: booking.id,
                from: { lat: businessLat, lng: businessLng },
                to: { lat: to.latitude, lng: to.longitude },
                label: `${getBusinessLabel(booking)} → ${getCustomerName(booking)}`,
            };
        }).filter(Boolean);
    }, [filteredBookings]);

    const handleStatusUpdate = async (bookingId, status) => {
        await updateBooking(
            bookingId,
            { status },
            (isLoading) => setUpdatingId(isLoading ? bookingId : null),
            fetchBookings
        );
    };

    const handleFlyTo = (booking) => {
        const coords = getBookingCoordinates(booking);
        if (!coords) return;
        setFocusedBookingId(booking.id);
        mapRef.current?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 17,
        });
    };

    const { connectionStatus: businessBookingsSocketStatus } = businessBookingsListener(profile?.id, setRawBookings, fetchBookings);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* LEFT — scrollable booking list */}
            <div className="w-[55%] flex flex-col h-full overflow-hidden border-r border-gray-200 bg-white">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h1 className="text-lg font-semibold text-gray-900">Business Bookings</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {filteredBookings.length} booking{filteredBookings.length === 1 ? "" : "s"}
                        {selectedStatus !== "all" && ` · ${selectedStatus}`}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                        Realtime updates:{" "}
                        <span className={businessBookingsSocketStatus === "connected" ? "text-emerald-600" : businessBookingsSocketStatus === "connecting" ? "text-amber-600" : "text-gray-500"}>
                            {businessBookingsSocketStatus === "connected"
                                ? "Live"
                                : businessBookingsSocketStatus === "connecting"
                                    ? "Connecting..."
                                    : "Offline"}
                        </span>
                    </p>
                </div>

                {/* Filters */}
                <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium mr-1">Status:</span>
                    {["all", ...STATUS_OPTIONS].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                                selectedStatus === status
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Booking Cards */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center mt-12">Loading bookings...</p>
                    ) : filteredBookings.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center mt-12">No bookings found.</p>
                    ) : (
                        filteredBookings.map((booking) => {
                            const currentStatus = getBookingStatus(booking);
                            const isCancelled = currentStatus === "cancelled";
                            const isUpdating = updatingId === booking.id;
                            const hasCoords = !!getBookingCoordinates(booking);
                            const isFocused = focusedBookingId === booking.id;
                            const address = getBookingAddress(booking);
                            const bookingDate = booking?.date || booking?.booking_date || booking?.created_at;
                            const businessLogo = booking?.business_logo;

                            return (
                                <div
                                    key={booking.id}
                                    className={`rounded-2xl border bg-white overflow-hidden transition-all ${
                                        isFocused
                                            ? "border-blue-400 shadow-md shadow-blue-100"
                                            : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                    }`}
                                >
                                    {/* Business thumbnail / cover */}
                                    <div className="relative h-28 bg-gray-100 overflow-hidden">
                                        {businessLogo ? (
                                            <img
                                                src={`${media_url}${businessLogo}`}
                                                alt={getBusinessLabel(booking)}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <span className="text-4xl font-bold text-gray-300">
                                                    {getBusinessLabel(booking).charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Status badge */}
                                        <span className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusClass(currentStatus)}`}>
                                            {currentStatus}
                                        </span>

                                        {/* Rating placeholder */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                                            <span className="text-amber-400 text-xs">★</span>
                                            <span className="text-xs font-semibold text-gray-700">
                                                {getServiceLabel(booking)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {getBusinessLabel(booking)}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {getCustomerName(booking)}
                                                </p>
                                            </div>
                                            <select
                                                className="rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                                value={currentStatus}
                                                disabled={isUpdating || isCancelled}
                                                onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Address */}
                                        {address !== "—" && (
                                            <div className="mt-2 flex items-start gap-1.5">
                                                <span className="text-gray-400 text-xs mt-px">📍</span>
                                                <p className="text-xs text-gray-500 line-clamp-1">{address}</p>
                                            </div>
                                        )}

                                        {/* Date + Focus button */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-xs text-gray-400">{formatDate(bookingDate)}</p>
                                            <button
                                                onClick={() => handleFlyTo(booking)}
                                                disabled={!hasCoords}
                                                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="3" />
                                                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                                                </svg>
                                                Focus on map
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT — sticky map */}
            <div className="flex-1 h-full sticky top-0">
                {/* Legend overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-gray-100 flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                        Business
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        Customer
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-5 h-0.5 bg-blue-400 inline-block rounded" />
                        Route
                    </span>
                </div>

                <MapComponent
                    Markers={mapMarkers}
                    userLocation={false}
                    mapRef={mapRef}
                    routeSources={routeSources}
                />
            </div>
        </div>
    );
}