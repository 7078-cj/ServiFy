import { getBookingStatus, getBookingCoordinates, getBookingAddress, getBusinessLabel, getCustomerName, getServiceLabel, getStatusClass, formatDate } from "./utils/booking";
import { STATUS_OPTIONS } from "./utils/booking";
import MessageButton from "../business/MessageButton";

const media_url = import.meta.env.VITE_MEDIA_URL;

function FocusIcon() {
    return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
    );
}

/**
 * BookingCard
 *
 * @param {object}   booking
 * @param {boolean}  isFocused      – highlights card when focused on map
 * @param {boolean}  isUpdating     – disables status select during async update
 * @param {function} onStatusChange – (bookingId, newStatus) => void
 * @param {function} onFlyTo        – (booking) => void
 */
export default function BookingCard({ booking, isFocused, isUpdating, onStatusChange, onFlyTo }) {
    const currentStatus = getBookingStatus(booking);
    const isCancelled   = currentStatus === "cancelled";
    const hasCoords     = !!getBookingCoordinates(booking);
    const address       = getBookingAddress(booking);
    const bookingDate   = booking?.date || booking?.booking_date || booking?.created_at;
    const businessLogo  = booking?.business_logo;

    return (
        <div
            className={`rounded-2xl border bg-white overflow-hidden transition-all ${
                isFocused
                    ? "border-blue-400 shadow-md shadow-blue-100"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
            }`}
        >
            {/* Cover / thumbnail */}
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

                {/* Service label chip */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="text-amber-400 text-xs">★</span>
                    <span className="text-xs font-semibold text-gray-700">
                        {getServiceLabel(booking)}
                    </span>
                </div>
            </div>

            {/* Body */}
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

                    {/* Status select */}
                    <select
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        value={currentStatus}
                        disabled={isUpdating || isCancelled}
                        onChange={(e) => onStatusChange(booking.id, e.target.value)}
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

                {/* Footer row */}
                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{formatDate(bookingDate)}</p>
                    <button
                        onClick={() => onFlyTo(booking)}
                        disabled={!hasCoords}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <FocusIcon />
                        Focus on map
                    </button>
                    <MessageButton providerId={booking.user.id}/>
                </div>
            </div>
        </div>
    );
}