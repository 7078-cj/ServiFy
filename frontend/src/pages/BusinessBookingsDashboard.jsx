import MapComponent from "../components/map/MapComponent";
import MapLegend from "../components/bookings/MapLegend";
import StatusFilterBar from "../components/bookings/StatusFilterBar";
import BookingList from "../components/bookings/BookingList";
import BookingsHeader from "../components/bookings/BookingsHeader";
import BookingCalendar from "../components/bookings/BookingCalendar";
import useBusinessBookings from "../components/bookings/useBusinessBooking";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";

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
        handleDateUpdate,
    } = useBusinessBookings();

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
            <Tabs
                defaultValue="list"
                className="flex flex-col flex-1 min-h-0"
            >
                {/* ── TOP BAR ── */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0 bg-white border-b border-slate-100">
                    <BookingsHeader
                        count={filteredBookings.length}
                        selectedStatus={selectedStatus}
                        realtimeStatus={realtimeStatus}
                    />
                    <TabsList className="bg-slate-100 p-1 rounded-xl border-0 gap-0.5">
                        <TabsTrigger
                            value="list"
                            className="text-[13px] font-medium text-slate-500 rounded-lg px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
                        >
                            List View
                        </TabsTrigger>
                        <TabsTrigger
                            value="calendar"
                            className="text-[13px] font-medium text-slate-500 rounded-lg px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
                        >
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* ── LIST VIEW ── */}
                <TabsContent
                    value="list"
                    className="flex-1 min-h-0 data-[state=inactive]:hidden data-[state=active]:flex flex-col m-0"
                >
                    <div className="flex flex-1 min-h-0 overflow-hidden">
                        {/* Sidebar */}
                        <aside className="w-[380px] flex-shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
                            <div className="px-4 pt-3 flex-shrink-0">
                                <StatusFilterBar
                                    selected={selectedStatus}
                                    onChange={setSelectedStatus}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin">
                                <BookingList
                                    bookings={filteredBookings}
                                    loading={loading}
                                    updatingId={updatingId}
                                    focusedBookingId={focusedBookingId}
                                    onStatusChange={handleStatusUpdate}
                                    onDateChange={handleDateUpdate}
                                    onFlyTo={handleFlyTo}
                                />
                            </div>
                        </aside>

                        {/* Map Area */}
                        <div className="flex-1 relative overflow-hidden bg-slate-100">
                            <MapLegend />
                            <MapComponent
                                Markers={mapMarkers}
                                mapRef={mapRef}
                                routeSources={routeSources}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* ── CALENDAR VIEW ── */}
                <TabsContent
                    value="calendar"
                    className="flex-1 min-h-0 data-[state=inactive]:hidden data-[state=active]:flex flex-col overflow-hidden bg-slate-50 p-6 m-0"
                >
                    <BookingCalendar 
                        bookings={filteredBookings} // Uses the same filtered list
                        onStatusChange={handleStatusUpdate}
                        onDateChange={handleDateUpdate}
                        onFlyTo={handleFlyTo}
                        updatingId={updatingId} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}