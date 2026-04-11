import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { setAuth, logout } from "../features/auth/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { getRequest } from "./reqests/requests";
import { getApiErrorMessage } from "./apiError";
import { validateLoginFields, validateRegisterFields } from "./validation";

const API_URL = import.meta.env.VITE_API_URL;

/** Clear session and send the user to the login screen. */
export const logoutUser = (dispatch, navigate) => {
    dispatch(logout());
    dispatch(setProfile(null));
    navigate("/login", { replace: true });
};

export const loginUser = async (e, dispatch, navigate) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const { valid, errors } = validateLoginFields(username, password);
    if (!valid) {
        const first = Object.values(errors)[0];
        toast.error(first);
        return;
    }

    try {
        const response = await fetch(API_URL + "user/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.trim(),
                password,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            toast.error(getApiErrorMessage(data));
            return;
        }

        const tokens = data;
        const user = jwtDecode(tokens.access);

        dispatch(
            setAuth({
                tokens: tokens,
                user: user,
            })
        );

        localStorage.setItem("authTokens", JSON.stringify(tokens));
        localStorage.setItem("user", JSON.stringify(user));

        let profile = null;
        try {
            profile = await getRequest("user/profile/", tokens.access);
        } catch (err) {
            console.error(err);
        }

        dispatch(setProfile(profile));
        toast.success("You're signed in.");
        navigate("/");
    } catch (error) {
        console.error("Error during login:", error);
        toast.error(error?.message || "Could not sign in. Try again.");
    }
};

export const registerUser = async (e, dispatch, nav) => {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL;

    const fields = {
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
    };

    const { valid, errors } = validateRegisterFields(fields);
    if (!valid) {
        toast.error(Object.values(errors)[0]);
        return;
    }

    try {
        const response = await fetch(`${url}user/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: fields.username.trim(),
                email: fields.email.trim(),
                password: fields.password,
                first_name: fields.first_name.trim(),
                last_name: fields.last_name.trim(),
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 201) {
            await loginUser(e, dispatch, nav);
            return;
        }

        toast.error(getApiErrorMessage(data));
    } catch (err) {
        console.error(err);
        toast.error(err?.message || "Registration failed. Try again.");
    }
};

export const updateToken = async (dispatch) => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));

    if (!authTokens) return;

    const response = await fetch(API_URL + "user/token/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: authTokens.refresh,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        const user = await getRequest("user/profile/", data.access);

        const newTokens = {
            access: data.access,
            refresh: authTokens.refresh,
        };

        dispatch(
            setAuth({
                tokens: newTokens,
                user: user,
            })
        );

        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        dispatch(logout());
        dispatch(setProfile(null));
    }
};
