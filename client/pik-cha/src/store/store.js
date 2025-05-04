// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import imageReducer from "../features/images/imageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imageReducer,
  },
});
export default store;
