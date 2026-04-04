import { jwtDecode } from "jwt-decode";
import { setAuth, logout } from "../features/auth/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { getRequest } from "./reqests/requests";

const API_URL = import.meta.env.VITE_API_URL;



export const loginUser = async (e, dispatch, navigate) => {
    e.preventDefault();

    try {
        const response = await fetch(API_URL + "user/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Login failed:", data);
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

        // Save to localStorage
        localStorage.setItem("authTokens", JSON.stringify(tokens));
        localStorage.setItem("user", JSON.stringify(user));

        let profile = null;

        try {
            profile = await getRequest("user/profile/", tokens.access);
        } catch (err) {
            console.error(err);
        }

        dispatch(setProfile(profile));

        navigate("/");

    } catch (error) {
        console.error("Error during login:", error);
    }
};

export const registerUser = async (e, dispatch, nav) =>{
        e.preventDefault();
        const url = import.meta.env.VITE_API_URL

        let response = await fetch(
        `${url}user/register/`,{
            method: "POST",
            headers:{
            'Content-Type' : 'application/json',
            
            },
            body :JSON.stringify({
                                'username' :e.target.username.value,
                                'email':e.target.email.value,
                                'password' :e.target.password.value,
                                'first_name': e.target.first_name.value,
                                'last_name': e.target.last_name.value
                            
                                
                                })
        }
        )
                
        if (response.status == 201){
            loginUser(e,dispatch,nav)
        }
    }


export const updateToken = async (dispatch) => {

    const authTokens = JSON.parse(localStorage.getItem("authTokens"));

    if (!authTokens) return;

    const response = await fetch(API_URL + "user/token/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: authTokens.refresh
        }),
    });

    const data = await response.json();

    if (response.ok) {

        const user = await getRequest("user/profile/", data.access);

        const newTokens = {
            access: data.access,
            refresh: authTokens.refresh
        };

        dispatch(setAuth({
            tokens: newTokens,
            user: user
        }));

        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        localStorage.setItem("user", JSON.stringify(user));

    } else {
        dispatch(logout());
        localStorage.removeItem("authTokens");
        localStorage.removeItem("user");
    }
};