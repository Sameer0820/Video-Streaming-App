import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    video: null,
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideo: (state, action) => {
            state.video = action.payload;
        },
    },
});

export const { setVideo } = videoSlice.actions;

export default videoSlice.reducer;
