import MapComponent from "../components/map/MapComponent";
import MapLegend from "../components/bookings/MapLegend";
import StatusFilterBar from "../components/bookings/StatusFilterBar";
import BookingList from "../components/bookings/BookingList";
import BookingsHeader from "../components/bookings/BookingsHeader";
import useBusinessBookings from "../components/bookings/useBusinessBooking";


/**
 * BusinessBookingsDashboard
 *
 * Top-level layout component. All data logic lives in useBusinessBookings;
 * all UI is delegated to focused sub-components.
 *
 * Layout:
 *   ┌─────────────────────┬──────────────────┐
 *   │  BookingsHeader     │                  │
 *   │  StatusFilterBar    │   MapComponent   │
 *   │  BookingList        │   + MapLegend    │
 *   └─────────────────────┴──────────────────┘
 */
export default function BusinessBookingsDashboard() {
    const {
        loading,
        updatingId,
        selectedStatus,
        focusedBookingId,
        realtimeStatus,
        mapRef,
        filteredBookings,
        mapMarkers,
        routeSources,
        setSelectedStatus,
        handleStatusUpdate,
        handleFlyTo,
    } = useBusinessBookings();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* ── Left panel — scrollable booking list ── */}
            <div className="w-[55%] flex flex-col h-full overflow-hidden border-r border-gray-200 bg-white">

                <BookingsHeader
                    count={filteredBookings.length}
                    selectedStatus={selectedStatus}
                    realtimeStatus={realtimeStatus}
                />

                <StatusFilterBar
                    selected={selectedStatus}
                    onChange={setSelectedStatus}
                />

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    <BookingList
                        bookings={filteredBookings}
                        loading={loading}
                        updatingId={updatingId}
                        focusedBookingId={focusedBookingId}
                        onStatusChange={handleStatusUpdate}
                        onFlyTo={handleFlyTo}
                    />
                </div>
            </div>

            {/* ── Right panel — sticky map ── */}
            <div className="flex-1 h-full top-0 relative">
                <MapLegend />
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