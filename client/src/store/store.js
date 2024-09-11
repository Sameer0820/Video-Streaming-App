import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import videosSlice from "./videosSlice";
import userSlice from "./userSlice";
import videoSlice from "./videoSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        videos: videosSlice,
        user: userSlice,
        video: videoSlice
    },
});

export default store;
