import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playlist: null,
};

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        setPlaylist: (state, action) => {
            state.playlist = action.payload;
        },
        updatePlaylist: (state, action) => {
            state.playlist = {
                ...state.playlist,
                name: action.payload.name,
                description: action.payload.description,
            };
        },
        removeVideoPlaylist: (state, action) => {
            state.playlist.videos = state.playlist.videos.filter((video) => 
                (video._id !== action.payload)
            )
        }
    },
});

export const { setPlaylist, updatePlaylist, removeVideoPlaylist } = playlistSlice.actions;

export default playlistSlice.reducer;
