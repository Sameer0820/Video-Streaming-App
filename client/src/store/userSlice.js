import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    currentUser: null,
    userComment: null,
    userVideo: null,
    userPlaylist: null,
    userTweets: null,
    userLikedVideos: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        },
        addCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        addUserComment: (state, action) => {
            state.userComment = action.payload;
        },
        addUserVideo: (state, action) => {
            state.userVideo = action.payload;
        },
        addUserPlaylist: (state, action) => {
            state.userPlaylist = action.payload;
        },
        adduserTweets: (state, action) => {
            state.userTweets = action.payload;
        },
        addUserLikedVideos: (state, action) => {
            state.userLikedVideos = action.payload;
        },
    },
});

export const {
    addUser,
    addCurrentUser,
    addUserComment,
    addUserVideo,
    addUserPlaylist,
    adduserTweets,
    addUserLikedVideos,
} = userSlice.actions;

export default userSlice.reducer;
