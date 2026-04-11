import { toast } from "sonner";
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from "../utils/reqests/requests";
import { requireToken } from "./access"

export async function createBooking(serviceId, data, setLoading, onSuccess) {
    const access = requireToken()
    try {
        setLoading(true)

        await postRequest(
            `user/services/${serviceId}/bookings/`,
            data,
            access,
        )

        onSuccess?.()
        toast.success("Booking request sent.")
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to create booking.")
    } finally {
        setLoading(false)
    }
}

export async function getBookings(setBookings, setLoading) {
    const access = requireToken()
    try {
        setLoading(true)
        const bookings = await getRequest(
            `user/my-bookings/`,
            access
        )
        setBookings(bookings)
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to load bookings.")
    } finally {
        setLoading(false)
    }
}

export async function getBusinessBookings(businessId, setBookings, setLoading) {
    const access = requireToken()
    try {
        setLoading(true)
        const bookings = await getRequest(
            `user/business/${businessId}/bookings/`,
            access
        )
        setBookings(bookings)
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to load bookings.")
    } finally {
        setLoading(false)
    } 
}

export async function getAllBusinessBookings(setBookings, setLoading) {
    const access = requireToken()
    try {
        setLoading(true)
        const bookings = await getRequest(
            `user/business/bookings/`,
            access
        )
        setBookings(bookings)
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to load bookings.")
    } finally {
        setLoading(false)
    }
}

export async function updateBooking(bookingId, data, setLoading, onSuccess) {
    const access = requireToken()
    try {
        setLoading(true)
        await patchRequest(
            `user/bookings/${bookingId}/`,
            data,
            access,
        )
        onSuccess?.()
        toast.success("Booking updated.")
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to update booking.")
    } finally {
        setLoading(false)
    }
}

export async function deleteBooking(bookingId, setLoading, onSuccess) {
    const access = requireToken()
    try {
        setLoading(true)
        await deleteRequest(
            `user/bookings/${bookingId}/`,
            access,
        )
        onSuccess?.()
        toast.success("Booking removed.")
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to delete booking.")
    } finally {
        setLoading(false)
    }
}

export async function cancelBooking(bookingId, setLoading, onSuccess) {
    const access = requireToken()
    try {
        setLoading(true)
        await patchRequest(
            `user/bookings/${bookingId}/cancel/`,
            {},
            access,
        )
        onSuccess?.()
        toast.success("Booking cancelled.")
    } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to cancel booking.")
    } finally {
        setLoading(false)
    }
}