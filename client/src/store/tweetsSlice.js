import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tweets: [],
};

const tweetsSlice = createSlice({
    name: "tweets",
    initialState,
    reducers: {
        addTweets: (state, action) => {
            state.tweets = [...state.tweets, ...action.payload];
        },
        removeTweets: (state, action) => {
            state.tweets = [];
        },
        deleteTweet: (state, action) => {
            state.tweets = state.tweets.filter(
                (tweet) => tweet._id !== action.payload
            );
        },
        updateTweet: (state, action) => {
            state.tweets = state.tweets.map((tweet) =>
                tweet._id === action.payload._id ? action.payload : tweet
            );
        },
        toggleLike: (state, action) => {
            state.tweets = state.tweets.map((tweet) =>
                tweet._id === action.payload.tweetId
                    ? {
                          ...tweet,
                          isLiked: action.payload.isLiked,
                          likesCount: action.payload.likesCount,
                      }
                    : tweet
            );
        },
    },
});

export const { addTweets, removeTweets, deleteTweet, updateTweet, toggleLike } =
    tweetsSlice.actions;
export default tweetsSlice.reducer;
