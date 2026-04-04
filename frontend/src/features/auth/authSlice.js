import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tokens: JSON.parse(localStorage.getItem("authTokens")) || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action) {
            state.tokens = action.payload.tokens;
            state.user = action.payload.user;

            localStorage.setItem("authTokens", JSON.stringify(action.payload.tokens));
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout(state) {
            state.tokens = null;
            state.user = null;
            localStorage.removeItem("authTokens");
            localStorage.removeItem("user");
        }
    }
});
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;