import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    video: null,
    likes: null,
    comments: null,
    owner: null,
    isLiked: false,
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideo: (state, action) => {
            state.video = action.payload;
        },
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        setLikes: (state, action) => {
            state.likes = action.payload;
        },
        setOwner: (state, action) => {
            state.owner = action.payload;
        },
        setIsLiked: (state, action) => {
            state.isLiked = !state.isLiked;
        },
    },
});

export const { setVideo, setComments, setLikes, setOwner, setIsLiked } =
    videoSlice.actions;

export default videoSlice.reducer;
