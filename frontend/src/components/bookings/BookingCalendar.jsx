import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import timegridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { 
    X, MapPin, CheckCircle2, 
    Calendar as CalendarIcon, User, 
    ChevronDown
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserDetailDialog from "./UserDetailDialog";
import { 
    getBookingTimestamp, 
    getBookingStatus, 
    getCustomerName, 
    getServiceLabel, 
    getBookingAddress,
    normalizeBookings
} from "./utils/booking";

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    approved: "bg-green-50 text-green-700 border-green-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
    completed: "bg-blue-50 text-blue-700 border-blue-100",
    cancelled: "bg-slate-50 text-slate-600 border-slate-100",
};

const ALLOWED_TRANSITIONS = {
    pending: ["approved", "rejected"],
    approved: ["completed", "cancelled"],
    rejected: [], completed: [], cancelled: []
};

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function BookingCalendar({ bookings, onStatusChange, onDateChange, onFlyTo, updatingId }) {
    const safeBookings = normalizeBookings(bookings);
    const [selectedId, setSelectedId] = useState(null);
    const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

    const selectedBooking = safeBookings.find(b => b.id === selectedId);

    const events = safeBookings.map((b) => ({
        id: b.id,
        title: `${getServiceLabel(b)} - ${getCustomerName(b)}`,
        start: new Date(getBookingTimestamp(b)),
        className: `calendar-event-${getBookingStatus(b)}`,
        extendedProps: { bookingId: b.id },
    })).filter(e => e.start);

    const currentStatus = selectedBooking ? getBookingStatus(selectedBooking) : null;
    const availableStatuses = currentStatus ? ALLOWED_TRANSITIONS[currentStatus] || [] : [];
    const canReschedule = !["completed", "cancelled", "rejected"].includes(currentStatus);

    return (
        <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden calendar-custom-style">
            <FullCalendar
                plugins={[daygridPlugin, timegridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="100%"
                events={events}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                eventClick={({ event }) => setSelectedId(event.extendedProps.bookingId)}
            />

            <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedId(null)}>
                <DialogContent className="p-0 overflow-hidden sm:max-w-[420px] rounded-[2rem] border-none shadow-2xl bg-white focus:outline-none">
                    {selectedBooking && (
                        <div className="relative flex flex-col">
                            {/* HEADER */}
                            <div className="relative h-32 bg-slate-100">
                                {selectedBooking.business_logo ? (
                                    <img 
                                        src={media_url + selectedBooking.business_logo} 
                                        className="w-full h-full object-cover" 
                                        alt="Cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-4xl font-bold">
                                        {getCustomerName(selectedBooking).charAt(0)}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border shadow-sm backdrop-blur-md ${STATUS_STYLES[currentStatus]}`}>
                                        {currentStatus}
                                    </span>
                                </div>
                                <button onClick={() => setSelectedId(null)} className="absolute top-4 left-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition backdrop-blur-sm">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* BODY */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black text-slate-900 leading-tight">{getServiceLabel(selectedBooking)}</h2>
                                    <button 
                                        onClick={() => setIsUserDetailOpen(true)}
                                        className="text-sm font-semibold text-blue-600 flex items-center gap-2 hover:underline"
                                    >
                                        <User size={16} className="text-blue-500" />{getCustomerName(selectedBooking)}
                                    </button>
                                    <p className="text-xs font-medium text-slate-400 flex items-center gap-2 pt-1">
                                        <MapPin size={14} />{getBookingAddress(selectedBooking)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <CalendarIcon size={12} /> Date
                                        </label>
                                        <input
                                            type="date"
                                            disabled={!canReschedule || updatingId === selectedBooking.id}
                                            value={new Date(getBookingTimestamp(selectedBooking)).toISOString().slice(0, 10)}
                                            onChange={(e) => onDateChange(selectedBooking.id, e.target.value)}
                                            className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">Status</label>
                                        <div className="relative">
                                            <select
                                                disabled={availableStatuses.length === 0 || updatingId === selectedBooking.id}
                                                value={currentStatus}
                                                onChange={(e) => onStatusChange(selectedBooking.id, e.target.value)}
                                                className="w-full appearance-none text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                                            >
                                                <option value={currentStatus}>{currentStatus}</option>
                                                {availableStatuses.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    {currentStatus === "pending" && (
                                        <button
                                            disabled={updatingId === selectedBooking.id}
                                            onClick={() => onStatusChange(selectedBooking.id, "approved")}
                                            className="w-full py-3.5 rounded-2xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={18} /> Approve Booking
                                        </button>
                                    )}
                                </div>
                            </div>

                            {updatingId === selectedBooking.id && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-[2rem]">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <UserDetailDialog 
                isOpen={isUserDetailOpen} 
                onClose={() => setIsUserDetailOpen(false)} 
                booking={selectedBooking} 
            />
        </div>
    );
}