    import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
        profile: JSON.parse(localStorage.getItem("user")) || null,
    };

    const profileSlice = createSlice({
        name: "profile",
        initialState,
        reducers: {
            setProfile(state, action) {
                state.profile = action.payload;
                localStorage.setItem("user", action.payload ? JSON.stringify(action.payload) : undefined);
            },

            clearProfile() {
                return initialState;
            }
        }
    });

    export const { setProfile, clearProfile } = profileSlice.actions;
    export default profileSlice.reducer;