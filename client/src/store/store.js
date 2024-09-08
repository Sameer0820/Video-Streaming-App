import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import videosSlice from "./videosSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        videos: videosSlice,
    },
});

export default store;
