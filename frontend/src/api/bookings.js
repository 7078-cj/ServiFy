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
    } catch (err) {
        console.error(err)
        alert("Failed to create booking")
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
        alert("Failed to fetch bookings")
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
        alert("Failed to fetch bookings")
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
        alert("Failed to fetch bookings")
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
    } catch (err) {
        console.error(err)
        alert("Failed to update booking")
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
    } catch (err) {
        console.error(err)
        alert("Failed to delete booking")
    } finally {
        setLoading(false)
    }
}