import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests";

const token = JSON.parse(localStorage.getItem("authTokens")) || null

export function getServices(businessId) {
    return getRequest(
        `businesses/${businessId}/services/`,
        token.access
    )
}

export function getService(businessId, serviceId) {
    return getRequest(
        `businesses/${businessId}/services/${serviceId}/`,
        token.access
    )
}

export function createService(businessId, formData, setShowModal = null, onRefresh = null) {
    if( setShowModal && onRefresh) {
        return postRequest(
            `businesses/${businessId}/services/`,
            formData,
            token.access,
            true
        ).then(res => {
            setShowModal(false)
            onRefresh()
            return res
        }).catch(err => {
            console.error(err)
            alert(err.message)
        })
    }
    return postRequest(
        `businesses/${businessId}/services/`,
        formData,
        token.access,
        true
    )
}

export function updateService(businessId, serviceId, formData , setLoading = null, setShowModal = null, onRefresh = null) {
    if(setLoading && setShowModal && onRefresh) {
        setLoading(true)

        return putRequest(
            `businesses/${businessId}/services/${serviceId}/`,
            formData,
            token.access,
            true 
        ).then(res => {
            setShowModal(false)
            onRefresh()

            return res
        }).catch(err => {
            console.error(err)
            alert(err.message)
        }).finally(() => {
            setLoading(false)
        })
    }
    return putRequest(
        `businesses/${businessId}/services/${serviceId}/`,
        formData,
        token.access,
        true 
    )
}

export function deleteService(businessId, serviceId, setLoading = null, onRefresh = null) {
    if(setLoading && onRefresh) {
        setLoading(true)
        return deleteRequest(
            `businesses/${businessId}/services/${serviceId}/`,
            token.access
        ).then(res => {
            onRefresh()
            return res
        }).catch(err => {
            console.error(err)
            alert(err.message)
        }).finally(() => {
            setLoading(false)
        })
    }
    return deleteRequest(
        `businesses/${businessId}/services/${serviceId}/`,
        token.access
    )
}
