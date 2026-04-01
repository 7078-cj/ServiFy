import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businesses: [],
    markers: [],  
};

const allBusinessSlice = createSlice({
    name: "all_business",
    initialState,
    reducers: {
        setAllBusinesses(state, action) {
            state.businesses = action.payload;
            state.markers = action.payload
                .filter(b => b.latitude && b.longitude)
                .map(b => ({
                    id: b.id,
                    name: b.name,
                    latitude: parseFloat(b.latitude),
                    longitude: parseFloat(b.longitude),
                }));
        },
    },
});

export const { setAllBusinesses } = allBusinessSlice.actions;
export default allBusinessSlice.reducer;