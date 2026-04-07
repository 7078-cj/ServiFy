import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests";
import { requireToken } from "./access";

export function addReview(businessId, formData, setShowModal = null, onRefresh = null) {    
    const token = requireToken();
    return postRequest(
        `businesses/${businessId}/reviews/`,
        formData,
        token
    ).then((response) => {
        if (onRefresh) onRefresh();
        return response;
    });
}

export function updateReview(businessId, reviewId, formData, setShowModal = null, onRefresh = null) {
    const token = requireToken();
    return putRequest(
        `businesses/${businessId}/reviews/${reviewId}/`,
        formData,
        token
    ).then((response) => {
        if (onRefresh) onRefresh();
        return response;
    });
}

export function deleteReview(businessId, reviewId, onRefresh = null) {
    const token = requireToken();
    return deleteRequest(
        `businesses/${businessId}/reviews/${reviewId}/`,
        token
    ).then((response) => {
        if (onRefresh) onRefresh();
        return response;
    });
}