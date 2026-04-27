// ─── Constants ───────────────────────────────────────────────────────────────
export const STATUS_OPTIONS = ["pending", "approved", "completed", "cancelled"];

// ─── Key Accessors ───────────────────────────────────────────────────────────

export const getBusinessKey = (booking) => {
    const id = booking?.business?.id ?? booking?.business_id ?? null;
    const name = booking?.business?.name || booking?.business_name || "Business";
    // Returns a unique string for React keys, e.g., "id:18" or "name:test-update"
    return id != null ? `id:${id}` : `name:${name}`;
};

export const getServiceKey = (booking) => {
    const id = booking?.service?.id ?? booking?.service_id ?? null;
    const name = booking?.service?.name || booking?.service_name || "Service";
    return id != null ? `id:${id}` : `name:${name}`;
};

// Also adding getStatusClass just in case you haven't yet, 
// as it often causes the same SyntaxError you saw earlier.
export const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
        case "approved":  return "bg-green-100 text-green-700";
        case "completed": return "bg-blue-100 text-blue-700";
        case "rejected":  return "bg-red-100 text-red-700";
        case "cancelled": return "bg-slate-100 text-slate-700";
        default:          return "bg-amber-100 text-amber-700";
    }
};

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

// ─── Booking field accessors ──────────────────────────────────────────────────
export const getBusinessLabel = (booking) =>
    booking?.business?.name || booking?.business_name || "Business";

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
    const latRaw = booking?.business_latitude || booking?.latitude;
    const lngRaw = booking?.business_longitude || booking?.longitude;
    const latitude = parseFloat(latRaw);
    const longitude = parseFloat(lngRaw);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude };
};

export const getCustomerName = (booking) =>
    `${booking?.user?.first_name || ""} ${booking?.user?.last_name || ""}`.trim() ||
    booking?.user?.username ||
    "Customer";

// New User Accessors
export const getCustomerEmail = (booking) => booking?.user?.email || "No email provided";
export const getCustomerPhone = (booking) => booking?.user?.profile?.phone || "No phone number";
export const getCustomerRole = (booking) => booking?.user?.profile?.role || "user";