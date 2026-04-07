import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests";
import { requireToken } from "./access";

export function getServices(businessId) {
    const token = requireToken();

    return getRequest(
        `businesses/${businessId}/services/`,
        token
    );
}

export function getService(businessId, serviceId) {
    const token = requireToken();

    return getRequest(
        `businesses/${businessId}/services/${serviceId}/`,
        token
    );
}

export function createService(businessId, formData, setShowModal = null, onRefresh = null) {
    const token = requireToken();

    if (setShowModal && onRefresh) {
        return postRequest(
            `businesses/${businessId}/services/`,
            formData,
            token,
            true
        )
        .then(res => {
            setShowModal(false);
            onRefresh();
            return res;
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
    }

    return postRequest(
        `businesses/${businessId}/services/`,
        formData,
        token,
        true
    );
}

export function updateService(businessId, serviceId, formData, setLoading = null, setShowModal = null, onRefresh = null) {
    const token = requireToken();

    if (setLoading && setShowModal && onRefresh) {
        setLoading(true);

        return putRequest(
            `businesses/${businessId}/services/${serviceId}/`,
            formData,
            token,
            true
        )
        .then(res => {
            setShowModal(false);
            onRefresh();
            return res;
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return putRequest(
        `businesses/${businessId}/services/${serviceId}/`,
        formData,
        token,
        true
    );
}

export function deleteService(businessId, serviceId, setLoading = null, onRefresh = null) {
    const token = requireToken();

    if (setLoading && onRefresh) {
        setLoading(true);

        return deleteRequest(
            `businesses/${businessId}/services/${serviceId}/`,
            token
        )
        .then(res => {
            onRefresh();
            return res;
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return deleteRequest(
        `businesses/${businessId}/services/${serviceId}/`,
        token
    );
}