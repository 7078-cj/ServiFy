import { postRequest } from "../utils/reqests/requests"
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