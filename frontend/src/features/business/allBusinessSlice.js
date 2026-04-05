import { createSlice } from "@reduxjs/toolkit";
import { updateBusiness } from "./businessSlice";

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
                    logo: b.logo,
                    latitude: parseFloat(b.latitude),
                    longitude: parseFloat(b.longitude),
                }));
        },
        updateInAllBusiness(state, action) {
            const index = state.businesses.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.businesses[index] = action.payload;
                const markerIndex = state.markers.findIndex(m => m.id === action.payload.id);
                if (markerIndex !== -1) {
                    state.markers[markerIndex] = {
                        id: action.payload.id,
                        name: action.payload.name,
                        logo: action.payload.logo,
                        latitude: parseFloat(action.payload.latitude),
                        longitude: parseFloat(action.payload.longitude),
                    };
                }           
            }
        },
        deleteInAllBusiness(state, action) {
            state.businesses = state.businesses.filter(b => b.id !== action.payload);
            state.markers = state.markers.filter(m => m.id !== action.payload);
        }
        


    },
});

export const { setAllBusinesses, updateInAllBusiness, deleteInAllBusiness } = allBusinessSlice.actions;
export default allBusinessSlice.reducer;