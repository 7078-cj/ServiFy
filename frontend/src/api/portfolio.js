import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests";

const token = JSON.parse(localStorage.getItem("authTokens")) || null

export async function uploadPortfolio(businessId, files, setBusiness=null) {
    if (setBusiness) {
        const formData = new FormData()

        files.forEach(file => {
            formData.append("photos", file) 
        })

        await postRequest(
            `businesses/${businessId}/portfolios/`,
            formData,
            token.access,
            true
        ).then(res => {
            getRequest(`businesses/${businessId}/`, token.access).then(data => {
                setBusiness(data)
            }).catch(err => {
                console.error("Fetch business failed:", err)
            })
        }).catch(err => {
            console.error("Upload failed:", err)
        })}
    return postRequest(
        `businesses/${businessId}/portfolios/`,
        files,
        token.access,
        true
    );
}

export async function deletePortfolioPhoto(businessId, photoId, setBusiness=null) {
    if (setBusiness) {
        await deleteRequest(
            `businesses/${businessId}/portfolios/${photoId}/`,
            token.access
        ).then(() => {
            getRequest(`businesses/${businessId}/`, token.access).then(data => {
                setBusiness(data)
            }).catch(err => {
                console.error("Fetch business failed:", err)
            })
        }
        ).catch(err => {
            console.error("Delete failed:", err)
        })
    }
    return deleteRequest(
        `businesses/${businessId}/portfolios/${photoId}/`,
        token.access
    );
}
