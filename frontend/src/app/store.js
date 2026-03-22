import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import profileReducer from "../features/profile/profileSlice"
import allBusinessesReducer from "../features/business/allBusinessSlice"
import businessesReducer from "../features/business/businessSlice"
export const store = configureStore({
        reducer:{
            auth:authReducer,
            profile: profileReducer,
            allBusinesses: allBusinessesReducer,
            business: businessesReducer
        }
    })
