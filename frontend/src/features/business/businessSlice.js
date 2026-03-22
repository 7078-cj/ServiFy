import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businesses: [],
};

const businessSlice = createSlice({
    name: "business",
    initialState,
    reducers: {
        setBusinesses(state, action) {
            state.businesses = action.payload;
        },
        addBusiness(state, action) {
            state.businesses.push(action.payload);
        },
        updateBusiness(state, action) {
            const index = state.businesses.findIndex(b => b.id === action.payload.id);
            if (index !== -1) state.businesses[index] = action.payload;
        },
        deleteBusiness(state, action) {
            state.businesses = state.businesses.filter(b => b.id !== action.payload);
        },
        clearBusinesses() {
            return initialState;
        },
    },
});

export const {
    setBusinesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    clearBusinesses,
} = businessSlice.actions;
export default businessSlice.reducer;