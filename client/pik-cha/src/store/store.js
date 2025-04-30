// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imageReducer,
  },
});
export default store;