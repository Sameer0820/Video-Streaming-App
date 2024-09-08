import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: null,
};

const videoSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        addVideos: (state, action) => {
            state.videos = action.payload;
        },
    },
});

export const { addVideos } = videoSlice.actions;
export default videoSlice.reducer;
