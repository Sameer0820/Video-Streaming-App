import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userVideo: null,
    userPlaylist: null,
    userTweets: null,
    userLikedVideos: null,
    userHistory: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        },
        addUserVideo: (state, action) => {
            state.userVideo = action.payload;
        },
        addUserPlaylist: (state, action) => {
            state.userPlaylist = action.payload;
        },
        addUserTweets: (state, action) => {
            state.userTweets = action.payload;
        },
        addUserLikedVideos: (state, action) => {
            state.userLikedVideos = action.payload;
        },
        addUserHistory: (state, action) => {
            state.userHistory = action.payload;
        },
    },
});

export const {
    addUser,
    addUserVideo,
    addUserPlaylist,
    addUserTweets,
    addUserLikedVideos,
    addUserHistory,
} = userSlice.actions;

export default userSlice.reducer;
