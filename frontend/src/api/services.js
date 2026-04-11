import { toast } from "sonner";
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
            toast.error(err?.message || "Could not create service.");
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
            toast.error(err?.message || "Could not update service.");
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
            toast.success("Service deleted.");
            return res;
        })
        .catch(err => {
            console.error(err);
            toast.error(err?.message || "Could not delete service.");
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