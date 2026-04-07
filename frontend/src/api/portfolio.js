import { deleteRequest, getRequest, postRequest } from "../utils/reqests/requests";
import { requireToken } from "./access";

export async function uploadPortfolio(businessId, files, setBusiness = null) {
    const token = requireToken(); 

    if (setBusiness) {
        const formData = new FormData();

        files.forEach(file => {
            formData.append("photos", file);
        });

        try {
            await postRequest(
                `businesses/${businessId}/portfolios/`,
                formData,
                token,
                true
            );

            const data = await getRequest(`businesses/${businessId}/`, token);
            setBusiness(data);
        } catch (err) {
            console.error("Upload or fetch failed:", err);
        }
    }

    return postRequest(
        `businesses/${businessId}/portfolios/`,
        files,
        token,
        true
    );
}

export async function deletePortfolioPhoto(businessId, photoId, setBusiness = null) {
    const token = requireToken(); 
    if (setBusiness) {
        try {
            await deleteRequest(
                `businesses/${businessId}/portfolios/${photoId}/`,
                token
            );

            const data = await getRequest(`businesses/${businessId}/`, token);
            setBusiness(data);
        } catch (err) {
            console.error("Delete or fetch failed:", err);
        }
    }

    return deleteRequest(
        `businesses/${businessId}/portfolios/${photoId}/`,
        token
    );
}