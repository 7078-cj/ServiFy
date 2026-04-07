import { setProfile } from "../features/profile/profileSlice";
import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests";

const token = JSON.parse(localStorage.getItem("authTokens")) || null

export function getProfile() {
    return getRequest(
        "user/profile/",
        token.access
    )
}

export function editProfile(formData, setModalOpen=null, dispatch=null) {
    if (dispatch && setModalOpen) {
        return putRequest(
            "user/profile/update",
            formData,
            token.access,
            true
        ).then(res => {
            getProfile().then(profileData => {
                dispatch(setProfile(profileData))
            })
            
            setModalOpen(false)
            return res
        })
    }

    return putRequest(
        "user/profile/update",
        formData,
        token.access,
        true
    )
}