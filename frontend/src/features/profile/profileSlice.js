import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: JSON.parse(localStorage.getItem("user")) || null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile(state, action) {
            const payload = action.payload;
            state.profile = payload ?? null;
            if (payload) {
                localStorage.setItem("user", JSON.stringify(payload));
            } else {
                localStorage.removeItem("user");
            }
        },

        clearProfile(state) {
            state.profile = null;
            localStorage.removeItem("user");
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;