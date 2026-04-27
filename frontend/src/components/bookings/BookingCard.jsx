import { useState, useEffect } from "react";
import {
    getBookingStatus,
    getBookingCoordinates,
    getBookingAddress,
    getBusinessLabel,
    getCustomerName,
} from "./utils/booking";
import MessageButton from "../business/MessageButton";
import UserDetailDialog from "./UserDetailDialog";
import { MapPin, ChevronDown, User, Briefcase } from "lucide-react";

const media_url = import.meta.env.VITE_MEDIA_URL;

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

export default function BookingCard({ booking, isFocused, isUpdating, onStatusChange, onDateChange, onFlyTo }) {
    const [isUserOpen, setIsUserOpen] = useState(false);
    const currentStatus = getBookingStatus(booking);
    const hasCoords = !!getBookingCoordinates(booking);
    const address = getBookingAddress(booking);
    
    const bookingDate = booking?.date || booking?.booking_date || booking?.created_at;
    const availableStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
    const canReschedule = !["completed", "cancelled", "rejected"].includes(currentStatus);

    // FIXED: Convert to string before calling .replace
    const formatForInput = (dateInput) => {
        if (!dateInput) return "";
        const dateStr = String(dateInput);
        const cleanStr = dateStr.replace('Z', '').replace('T', ' ');
        const d = new Date(cleanStr);
        if (isNaN(d.getTime())) return "";
        
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const [dateValue, setDateValue] = useState(formatForInput(bookingDate));

    useEffect(() => {
        setDateValue(formatForInput(bookingDate));
    }, [bookingDate]);

    return (
        <div className={`relative rounded-2xl border bg-white overflow-hidden transition-all duration-300 ${
            isFocused ? "border-blue-500 shadow-lg ring-2 ring-blue-50" : "border-slate-100 hover:shadow-md"
        }`}>
            <div className="relative h-24 bg-slate-100">
                {booking?.business_logo ? (
                    <img src={`${media_url}${booking.business_logo}`} className="w-full h-full object-cover" alt="logo" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold">
                        {getBusinessLabel(booking).charAt(0)}
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border shadow-sm backdrop-blur-md ${STATUS_STYLES[currentStatus]}`}>
                        {currentStatus}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Briefcase size={14} className="text-slate-400" />
                            {getBusinessLabel(booking)}
                        </h3>
                        <button 
                            onClick={() => setIsUserOpen(true)}
                            className="text-xs font-medium text-blue-600 flex items-center gap-1.5 hover:bg-blue-50 px-1 -ml-1 rounded transition-colors"
                        >
                            <User size={14} />
                            {getCustomerName(booking)}
                        </button>
                    </div>
                    <MessageButton providerId={booking.user.id} />
                </div>

                {address !== "—" && (
                    <div className="flex items-start gap-1.5 text-slate-500">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-blue-500" />
                        <p className="text-[11px] leading-relaxed line-clamp-2">{address}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Schedule</label>
                        <input
                            type="datetime-local"
                            value={dateValue}
                            disabled={isUpdating || !canReschedule}
                            onChange={(e) => {
                                setDateValue(e.target.value);
                                onDateChange(booking.id, e.target.value.replace('T', ' ') + ':00');
                            }}
                            className="w-full text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status</label>
                        <div className="relative">
                            <select
                                value={currentStatus}
                                disabled={isUpdating || availableStatuses.length === 0}
                                onChange={(e) => onStatusChange(booking.id, e.target.value)}
                                className="w-full appearance-none text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                            >
                                <option value={currentStatus}>{currentStatus}</option>
                                {availableStatuses.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onFlyTo(booking)}
                    disabled={!hasCoords}
                    className="w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-transparent disabled:opacity-50"
                >
                    <MapPin size={14} /> Locate on Map
                </button>
            </div>

            {isUpdating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <UserDetailDialog 
                isOpen={isUserOpen} 
                onClose={() => setIsUserOpen(false)} 
                booking={booking} 
            />
        </div>
    );
}