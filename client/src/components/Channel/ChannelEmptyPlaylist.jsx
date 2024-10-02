import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { FaRegFolderOpen } from "react-icons/fa";
import PlaylistForm from "../Playlist/PlaylistForm";
import { IoAdd } from "react-icons/io5";

function ChannelEmptyPlaylist({ videos = false }) {
    const { status, userData } = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user.user);
    const dialog = useRef();

    const playlistPopup = () => {
        dialog.current.open();
    };

    if (status && user.username === userData.username) {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-6">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-pink-500 p-2">
                            <FaRegFolderOpen className="w-6 h-6" />
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">
                        {videos ? "Empty Playlist" : "No playlist created"}
                    </h5>
                    <p>
                        {videos
                            ? "This Playlist has no videos."
                            : "Your channel has yet to create a playlist. Click to create a new playlist"}
                    </p>
                    <PlaylistForm ref={dialog} />
                    {!videos && (
                        <button
                            onClick={playlistPopup}
                            className="mt-4 inline-flex items-center gap-x-2 bg-pink-500 hover:bg-pink-500/90 border border-transparent rounded-lg hover:border-white px-3 py-1.5 font-semibold text-black"
                        >
                            <IoAdd className="w-5 h-5" />
                            New Playlist
                        </button>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-6">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-pink-500 p-2">
                            <FaRegFolderOpen className="w-6 h-6" />
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">
                        {videos ? "Empty Playlist" : "No playlist created"}
                    </h5>
                    <p>
                        {videos
                            ? "This Playlist has no videos."
                            : "There are no playlist created on this channel."}
                    </p>
                </div>
            </div>
        );
    }
}

export default ChannelEmptyPlaylist;
