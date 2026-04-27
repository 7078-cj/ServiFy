import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getAllBusinessBookings, updateBooking } from "../../api/bookings";
import businessBookingsListener from "../../listeners/businessBookingsListener";
import {
    normalizeBookings,
    getBookingCoordinates,
    getBookingStatus,
    getBusinessKey,
    getBusinessLabel,
    getServiceLabel,
    getCustomerName,
} from "./utils/booking";


const buildMapMarkers = (filteredBookings) => {
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
};


const buildRouteSources = (filteredBookings) =>
    filteredBookings
        .map((booking) => {
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
        })
        .filter(Boolean);


export default function useBusinessBookings() {
    const [rawBookings, setRawBookings] = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [updatingId,  setUpdatingId]  = useState(null);
    const [selectedStatus,    setSelectedStatus]    = useState("all");
    const [focusedBookingId,  setFocusedBookingId]  = useState(null);
    const mapRef = useRef(null);

    const { profile } = useSelector((state) => state.profile);

    const fetchBookings = () => getAllBusinessBookings(setRawBookings, setLoading);

    useEffect(() => { fetchBookings(); }, []);

    const { connectionStatus: realtimeStatus } =
        businessBookingsListener(profile?.id, setRawBookings, fetchBookings);

    // ── Derived state ──────────────────────────────────────────────────────

    const bookings = useMemo(() => normalizeBookings(rawBookings), [rawBookings]);

    const filteredBookings = useMemo(() => {
        if (selectedStatus === "all") return bookings;
        return bookings.filter((b) => getBookingStatus(b) === selectedStatus);
    }, [bookings, selectedStatus]);

    const mapMarkers   = useMemo(() => buildMapMarkers(filteredBookings),   [filteredBookings]);
    const routeSources = useMemo(() => buildRouteSources(filteredBookings), [filteredBookings]);

    // ── Actions ────────────────────────────────────────────────────────────

    const handleStatusUpdate = async (bookingId, status) => {
        await updateBooking(
            bookingId,
            { status },
            (isLoading) => setUpdatingId(isLoading ? bookingId : null),
            fetchBookings
        );
    };

    const handleDateUpdate = async (bookingId, date) => {
        await updateBooking(
            bookingId,
            { date },
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

    return {
        // State
        loading,
        updatingId,
        selectedStatus,
        focusedBookingId,
        realtimeStatus,
        mapRef,
        // Data
        filteredBookings,
        mapMarkers,
        routeSources,
        // Actions
        setSelectedStatus,
        handleStatusUpdate,
        handleDateUpdate,
        handleFlyTo,
    };
}