import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: null,
    subscribedVideos: null,
};

const videosSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        addVideos: (state, action) => {
            state.videos = action.payload;
        },
        addSubscribedVideos: (state, action) => {
            state.subscribedVideos = action.payload;
        },
    },
});

export const { addVideos, addSubscribedVideos } = videosSlice.actions;
export default videosSlice.reducer;
