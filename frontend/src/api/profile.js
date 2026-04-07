import { setProfile } from "../features/profile/profileSlice";
import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests";
import { requireToken } from "./access";

export function getProfile() {
    const token = requireToken();

    return getRequest(
        "user/profile/",
        token
    );
}

export function editProfile(formData, setModalOpen = null, dispatch = null) {
    const token = requireToken();

    if (dispatch && setModalOpen) {
        return putRequest(
            "user/profile/update",
            formData,
            token,
            true
        ).then(res => {
            return getProfile().then(profileData => {
                dispatch(setProfile(profileData));
                setModalOpen(false);
                return res;
            });
        });
    }

    return putRequest(
        "user/profile/update",
        formData,
        token,
        true
    );
}