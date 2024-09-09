import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: null,
};

const videosSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        addVideos: (state, action) => {
            state.videos = action.payload;
        },
    },
});

export const { addVideos } = videosSlice.actions;
export default videosSlice.reducer;
