import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userVideo: [],
    userPlaylist: null,
    userTweets: [],
    userLikedVideos: [],
    userHistory: [],
    userSubscribed: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        },
        addUserVideo: (state, action) => {
            state.userVideo = [...state.userVideo, ...action.payload];
        },
        removerUserVideo: (state) => {
            state.userVideo = [];
        },
        addUserPlaylist: (state, action) => {
            state.userPlaylist = action.payload;
        },
        addUserTweets: (state, action) => {
            state.userTweets = [...state.userTweets, ...action.payload];
        },
        removeUserTweets: (state, action) => {
            state.userTweets = [];
        },
        addUserLikedVideos: (state, action) => {
            state.userLikedVideos = [
                ...state.userLikedVideos,
                ...action.payload,
            ];
        },
        removeUserLikedVideos: (state) => {
            state.userLikedVideos = [];
        },
        addUserHistory: (state, action) => {
            state.userHistory = [...state.userHistory, ...action.payload];
        },
        removeUserHistory: (state) => {
            state.userHistory = [];
        },
        addUserSubscribed: (state, action) => {
            state.userSubscribed = action.payload;
        },
        toggleUserSubscribe: (state, action) => {
            state.userSubscribed.channels = state.userSubscribed.channels.map(
                (profile) =>
                    profile._id === action.payload.profileId
                        ? {
                              ...profile,
                              isSubscribed: action.payload.isSubscribed,
                              subscribersCount: action.payload.subscribersCount,
                          }
                        : profile
            );
        },
    },
});

export const {
    addUser,
    addUserVideo,
    removerUserVideo,
    addUserPlaylist,
    addUserTweets,
    removeUserTweets,
    addUserLikedVideos,
    removeUserLikedVideos,
    addUserHistory,
    removeUserHistory,
    addUserSubscribed,
    toggleUserSubscribe,
} = userSlice.actions;

export default userSlice.reducer;
