import BookingCard from "./BookingCard";

/**
 * BookingList
 *
 * Scrollable container that renders a BookingCard for each booking,
 * plus loading and empty states.
 */
export default function BookingList({
    bookings,
    loading,
    updatingId,
    focusedBookingId,
    onStatusChange,
    onFlyTo,
}) {
    if (loading) {
        return (
            <p className="text-sm text-gray-400 text-center mt-12">
                Loading bookings...
            </p>
        );
    }

    if (bookings.length === 0) {
        return (
            <p className="text-sm text-gray-400 text-center mt-12">
                No bookings found.
            </p>
        );
    }

    return bookings.map((booking) => (
        <BookingCard
            key={booking.id}
            booking={booking}
            isFocused={focusedBookingId === booking.id}
            isUpdating={updatingId === booking.id}
            onStatusChange={onStatusChange}
            onFlyTo={onFlyTo}
        />
    ));
}