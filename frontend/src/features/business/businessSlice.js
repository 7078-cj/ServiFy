import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businesses: [],
    markers: [],
};

const generateMarkers = (businesses) => {
    return businesses
        .filter(b => b.latitude && b.longitude)
        .map(b => ({
            id: b.id,
            name: b.name,
            latitude: parseFloat(b.latitude),
            longitude: parseFloat(b.longitude),
        }));
};

const businessSlice = createSlice({
    name: "business",
    initialState,
    reducers: {
        setBusinesses(state, action) {
            state.businesses = action.payload;
            state.markers = generateMarkers(action.payload);
        },

        addBusiness(state, action) {
            state.businesses.push(action.payload);
            state.markers = generateMarkers(state.businesses);
        },

        updateBusiness(state, action) {
            const index = state.businesses.findIndex(
                b => b.id === action.payload.id
            );

            if (index !== -1) {
                state.businesses[index] = action.payload;
                state.markers = generateMarkers(state.businesses);
            }
        },

        deleteBusiness(state, action) {
            state.businesses = state.businesses.filter(
                b => b.id !== action.payload
            );
            state.markers = generateMarkers(state.businesses);
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