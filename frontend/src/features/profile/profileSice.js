import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: "customer",
    phone: "",
    profile_image: ""
    
};

const profileSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setProfile(state, action) {
            state.role = action.payload.role;
            state.phone = action.payload.phone;
            state.profile_image = action.payload.profile_image;
        },
    }
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;