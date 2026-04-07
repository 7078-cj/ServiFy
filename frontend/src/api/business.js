import { setAllBusinesses } from "../features/business/allBusinessSlice"
import { setBusinesses } from "../features/business/businessSlice"
import { getRequest, postRequest, putRequest } from "../utils/reqests/requests"
import { requireToken } from "./access"




export function getAllBusinesses(dispatch = null) {
    if (dispatch) {
        return getRequest("all_businesses/")
            .then(res => {
                dispatch(setAllBusinesses(res))
                return res
            })
            .catch(err => {
                console.error("Failed to fetch all businesses:", err)
                throw err
            })
    }

    return getRequest("all_businesses/")
}



export function getUserBusinesses(dispatch = null) {
    try {
        const access = requireToken()

        if (dispatch) {
            return getRequest("businesses/", access)
                .then(res => {
                    dispatch(setBusinesses(res))
                    return res
                })
                .catch(err => {
                    console.error("Failed to fetch user businesses:", err)
                    throw err
                })
        }

        return getRequest("businesses/", access)

    } catch (err) {
        return Promise.reject(err)
    }
}



export function createBusiness(formData, dispatch = null, setBusinessModalOpen = null) {
    try {
        const access = requireToken()

        if (dispatch && setBusinessModalOpen) {
            return postRequest(
                "businesses/",
                formData,
                access,
                true
            )
            .then(res => {
                // Refresh data
                getUserBusinesses(dispatch)
                getAllBusinesses(dispatch)

                setBusinessModalOpen(false)
                return res
            })
            .catch(error => {
                console.error("Failed to create business:", error)
                throw error
            })
        }

        return postRequest(
            "businesses/",
            formData,
            access,
            true
        )

    } catch (err) {
        return Promise.reject(err)
    }
}


export function getBusiness(id, setBusiness = null, setLoading = null, setError = null) {
    try {
        const access = requireToken()

        if (setBusiness && setLoading && setError) {
            setLoading(true)
            setError(null)

            return getRequest(`businesses/${id}/`, access)
                .then(res => {
                    setBusiness(res)
                    return res
                })
                .catch(() => {
                    setError("Failed to load business details.")
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        return getRequest(`businesses/${id}/`, access)

    } catch (err) {
        return Promise.reject(err)
    }
}



export function updateBusiness(id, formData, setBusinessModalOpen = null, setBusiness = null) {
    try {
        const access = requireToken()

        if (setBusinessModalOpen && setBusiness) {
            return putRequest(
                `businesses/${id}/`,
                formData,
                access,
                true
            )
            .then(res => {
                setBusiness(res)
                setBusinessModalOpen(false)
                return res
            })
            .catch(error => {
                console.error("Failed to update business:", error)
                throw error
            })
        }

        return putRequest(
            `businesses/${id}/`,
            formData,
            access,
            true
        )

    } catch (err) {
        return Promise.reject(err)
    }
}