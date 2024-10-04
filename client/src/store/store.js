import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import videosSlice from "./videosSlice";
import userSlice from "./userSlice";
import videoSlice from "./videoSlice";
import tweetsSlice from "./tweetsSlice";
import playlistSlice from "./playlistSlice";
import playlistsSlice from "./playlistsSlice";
import dashboardSlice from "./dashboardSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        videos: videosSlice,
        user: userSlice,
        video: videoSlice,
        tweets: tweetsSlice,
        playlist: playlistSlice,
        playlists: playlistsSlice,
        dashboard: dashboardSlice,
    },
});

export default store;
