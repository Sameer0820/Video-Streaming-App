import React, { useRef, useState, useEffect } from "react";
import ChannelEmptyPlaylist from "./ChannelEmptyPlaylist";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylist } from "../../hooks/getUserPlaylist";
import { Link, useLocation, useParams } from "react-router-dom";
import { icons } from "../../assets/Icons.jsx";
import PlaylistForm from "../Playlist/PlaylistForm.jsx";
import { IoAdd } from "react-icons/io5";
import formatDate from "../../utils/formatDate.js";

function ChannelPlaylist() {
    const dispatch = useDispatch();
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const { status, userData } = useSelector((state) => state.auth);
    const userId = useSelector((state) => state.user.user._id);
    const dialog = useRef();
    const location = useLocation();

    useEffect(() => {
        getUserPlaylist(dispatch, userId || userData._id).then(() => setLoading(false));
    }, [username]);

    const playlists = useSelector((state) => state.user.userPlaylist);

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    function popupPlaylistForm() {
        dialog.current.open();
    }

    let counter = 0;

    return (
        <>
            <PlaylistForm ref={dialog} route={location} />
            {playlists?.length > 0 ? (
                <>
                    {status && userData?.username === username && (
                        <div className="flex items-center justify-center">
                            <button
                                onClick={popupPlaylistForm}
                                className="mt-4 inline-flex items-center gap-x-2 bg-pink-500 hover:bg-pink-500/90 border border-transparent rounded-lg hover:border-white px-3 py-1.5 font-semibold text-black"
                            >
                                <IoAdd className="w-5 h-5" />
                                New Playlist
                            </button>
                        </div>
                    )}
                    <ul className="flex flex-wrap justify-start">
                        {playlists.map((playlist) => {
                            if (
                                playlist.videosCount > 0 ||
                                (status && userData?.username === username)
                            ) {
                                counter++;
                                return (
                                    <li
                                        key={playlist._id}
                                        className="hover:bg-zinc-900 2xl:w-[18vw] md:w-[25vw] w-[90vw] rounded-md my-4 text-white mx-2 p-1"
                                    >
                                        <Link to={`/playlist/${playlist._id}`}>
                                            <div className="relative">
                                                <img
                                                    src={
                                                        playlist?.thumbnail
                                                            ? playlist.thumbnail
                                                            : "https://res.cloudinary.com/dgfh6tf6j/image/upload/v1727779646/Screenshot_2024-10-01_161624_bwpw83.png"
                                                    }
                                                    alt="image"
                                                    className="w-full md:h-[15vw] 2xl:h-[12vw] object-cover rounded-md"
                                                />
                                                <div className="absolute inset-x-0 bottom-0">
                                                    <div className="relative border-t bg-white/30 px-4 py-2 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                                        <div className="relative z-[1]">
                                                            <p className="flex justify-between">
                                                                <span className="inline-block">
                                                                    {
                                                                        playlist.name
                                                                    }
                                                                </span>
                                                                <span className="inline-block text-center">
                                                                    {
                                                                        playlist.videosCount
                                                                    }{" "}
                                                                    video
                                                                    {playlist.videosCount >
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </span>
                                                            </p>
                                                            <p className="text-sm text-gray-200">
                                                                {
                                                                    playlist.totalViews
                                                                }{" "}
                                                                view
                                                                {playlist.totalViews >
                                                                1
                                                                    ? "s"
                                                                    : ""}{" "}
                                                                ·{" "}
                                                                {formatDate(
                                                                    playlist.createdAt
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-2 bg-zinc-800 rounded-b-md">
                                                <p className="text-sm text-gray-200 overflow-hidden line-clamp-1">
                                                    {playlist.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                    {counter === 0 && <ChannelEmptyPlaylist />}
                </>
            ) : (
                <ChannelEmptyPlaylist />
            )}
        </>
    );
}

export default ChannelPlaylist;
