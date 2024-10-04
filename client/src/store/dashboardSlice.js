import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: null,
    stats: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        updateVideoPublishStatus: (state, action) => {
            state.videos = state.videos.map((video) =>
                video._id === action.payload.videoId
                    ? { ...video, isPublished: action.payload.isPublished }
                    : video
            );
        },
        deleteVideo: (state, action) => {
            state.videos = state.videos.filter(
                (video) => video._id !== action.payload.videoId
            );
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
    },
});

export const { setVideos, setStats, updateVideoPublishStatus, deleteVideo } =
    dashboardSlice.actions;

export default dashboardSlice.reducer;
