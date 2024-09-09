import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    currentUser: null,
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
    },
});

export const {
    addUser,
    addCurrentUser,
    addUserVideo,
    addUserPlaylist,
    addUserTweets,
    addUserLikedVideos,
} = userSlice.actions;

export default userSlice.reducer;
