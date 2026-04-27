import BookingCard from "./BookingCard";

export default function BookingList({
    bookings,
    loading,
    updatingId,
    focusedBookingId,
    onStatusChange,
    onFlyTo,
    onDateChange,
}) {
    if (loading) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="booking-skeleton"
                        style={{
                            height: 88,
                            borderRadius: 12,
                            background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                            backgroundSize: "200% 100%",
                            animation: `skeleton-shimmer 1.4s ease-in-out ${i * 0.12}s infinite`,
                        }}
                    />
                ))}
                <style>{`
                    @keyframes skeleton-shimmer {
                        0%   { background-position: 200% 0 }
                        100% { background-position: -200% 0 }
                    }
                `}</style>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-4">
                <svg
                    width="40" height="40" viewBox="0 0 40 40" fill="none"
                    style={{ opacity: 0.25 }}
                >
                    <rect x="4" y="8" width="32" height="28" rx="4"
                        stroke="#0f172a" strokeWidth="2" fill="none" />
                    <path d="M4 15h32" stroke="#0f172a" strokeWidth="2" />
                    <path d="M13 4v8M27 4v8" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 24h16M12 29h10" stroke="#0f172a" strokeWidth="2"
                        strokeLinecap="round" opacity="0.5" />
                </svg>
                <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500, margin: 0 }}>
                    No bookings found
                </p>
                <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>
                    Try adjusting the status filter
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
            {bookings.map((booking) => (
                <BookingCard
                    key={booking.id}
                    booking={booking}
                    isFocused={focusedBookingId === booking.id}
                    isUpdating={updatingId === booking.id}
                    onStatusChange={onStatusChange}
                    onDateChange={onDateChange}
                    onFlyTo={onFlyTo}
                />
            ))}
        </div>
    );
}