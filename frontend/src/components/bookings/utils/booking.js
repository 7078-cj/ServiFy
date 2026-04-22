// ─── Constants ───────────────────────────────────────────────────────────────

export const STATUS_OPTIONS = ["pending", "approved", "completed", "cancelled"];

// ─── Normalizers ─────────────────────────────────────────────────────────────

export const normalizeBookings = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

// ─── Formatters ──────────────────────────────────────────────────────────────

export const formatDate = (value) => {
    if (!value) return "Not set";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

export const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
        case "approved":  return "bg-blue-100 text-blue-700";
        case "completed": return "bg-green-100 text-green-700";
        case "cancelled": return "bg-red-100 text-red-700";
        default:          return "bg-amber-100 text-amber-700";
    }
};

// ─── Booking field accessors ──────────────────────────────────────────────────

export const getBusinessKey = (booking) => {
    const id = booking?.business?.id ?? booking?.business_id ?? null;
    const name = booking?.business?.name || booking?.business_name || "Business";
    return id != null ? `id:${id}` : `name:${name}`;
};

export const getBusinessLabel = (booking) =>
    booking?.business?.name || booking?.business_name || "Business";

export const getServiceKey = (booking) => {
    const id = booking?.service?.id ?? booking?.service_id ?? null;
    const name = booking?.service?.name || booking?.service_name || "Service";
    return id != null ? `id:${id}` : `name:${name}`;
};

export const getServiceLabel = (booking) =>
    booking?.service?.name || booking?.service_name || "Service";

export const getBookingTimestamp = (booking) => {
    const raw = booking?.date || booking?.booking_date || booking?.created_at;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isNaN(t) ? 0 : t;
};

export const getBookingStatus = (booking) =>
    (booking?.status || "pending").toLowerCase();

export const getBookingAddress = (booking) =>
    booking?.address || booking?.location?.address || "—";

export const getBookingCoordinates = (booking) => {
    const latRaw = booking?.latitude ?? booking?.lat ?? booking?.location?.latitude ?? booking?.location?.lat;
    const lngRaw = booking?.longitude ?? booking?.lng ?? booking?.location?.longitude ?? booking?.location?.lng;
    const latitude = parseFloat(latRaw);
    const longitude = parseFloat(lngRaw);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude };
};

export const getCustomerName = (booking) =>
    `${booking?.user?.first_name || ""} ${booking?.user?.last_name || ""}`.trim() ||
    booking?.user?.username ||
    booking?.customer_name ||
    "Customer";