import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: "customer",
    phone: "",
    profile_image: ""
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile(state, action) {
            const { role, phone, profile_image } = action.payload || {};

            if (role !== undefined) state.role = role;
            if (phone !== undefined) state.phone = phone;
            if (profile_image !== undefined) state.profile_image = profile_image;
        },

        
        clearProfile() {
            return initialState;
        }
    }
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;