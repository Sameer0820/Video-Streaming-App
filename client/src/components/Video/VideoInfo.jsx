import React, { useEffect, useRef, useState } from "react";
import getTimeDistanceToNow from "../../utils/getTimeDistance";
import { useLocation, Link } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import {
    FaSave,
    FaBell,
    FaChevronDown,
    FaChevronUp,
    FaCheckCircle,
} from "react-icons/fa";
import Button from "../Button";
import { useSelector, useDispatch } from "react-redux";
import { setVideo } from "../../store/videoSlice";
import LoginPopup from "../Auth/LoginPopup";
import axiosInstance from "../../utils/axios.helper";
import { toast } from "react-toastify";
import formatSubscription from "../../utils/fromatSubscription";
import { setPlaylists, updatePlaylist } from "../../store/playlistsSlice";
import PlaylistForm from "../Playlist/PlaylistForm";

function VideoInfo({ video }) {
    const timeDistance = getTimeDistanceToNow(video?.createdAt);
    const authStatus = useSelector((state) => state.auth.status);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [menu, setMenu] = useState(false);
    const LoginLikePopupDialog = useRef();
    const LoginSubsPopupDialog = useRef();
    const LoginSavePopupDialog = useRef();
    const ref = useRef(null);
    const dialog = useRef();
    const location = useLocation();
    const dispatch = useDispatch();
    const userPlaylist = useSelector((state) => state.user.userPlaylist);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const toggleVideoLike = async () => {
        if (!authStatus) {
            LoginLikePopupDialog.current.open();
        } else {
            try {
                const response = await axiosInstance.post(
                    `/likes/toggle/v/${video._id}`
                );
                if (response.data.success) {
                    dispatch(
                        setVideo({
                            ...video,
                            isLiked: !video.isLiked,
                            likesCount: video.isLiked
                                ? video.likesCount - 1
                                : video.likesCount + 1,
                        })
                    );
                }
            } catch (error) {
                toast.error("Error while toggling like button");
                console.log(error);
            }
        }
    };

    const toggleSubscribe = async () => {
        if (!authStatus) {
            LoginSubsPopupDialog.current.open();
        } else {
            try {
                const response = await axiosInstance.post(
                    `/subscriptions/c/${video.owner._id}`
                );
                if (response.data.success) {
                    dispatch(
                        setVideo({
                            ...video,
                            owner: {
                                ...video.owner,
                                isSubscribed: !video.owner.isSubscribed,
                                subscriberCount: video.owner.isSubscribed
                                    ? video.owner.subscriberCount - 1
                                    : video.owner.subscriberCount + 1,
                            },
                        })
                    );
                }
            } catch (error) {
                if (error.status === 403) {
                    toast.error("Cannot subscribe to your own channel");
                } else {
                    toast.error("Error while toggling subscribe button");
                    console.log(error);
                }
            }
        }
    };

    const handleSavePlaylist = async () => {
        try {
            const response = await axiosInstance.get(
                `/playlist/user/p/${video._id}`
            );
            if (response.data.success) {
                dispatch(setPlaylists(response.data.data));
            }
        } catch (error) {
            toast.error("Error while fetching your playlists");
            console.log("Error while fetching playlists", error);
        }
    };

    useEffect(() => {
        if (authStatus) {
            handleSavePlaylist();
        }
    }, [authStatus, userPlaylist]);

    const handlePlaylistVideo = async (playlistId, status) => {
        if (!playlistId && !status) return;
        if (status) {
            try {
                const response = await axiosInstance.patch(
                    `/playlist/add/${video._id}/${playlistId}`
                );
                if (response?.data?.success) {
                    toast.success(response.data.message);
                    dispatch(
                        updatePlaylist({
                            playlistId: playlistId,
                            isVideoPresent: true,
                        })
                    );
                }
            } catch (error) {
                toast.error("Error while adding video to playlist");
                console.log(error);
            }
        } else {
            try {
                const response = await axiosInstance.patch(
                    `/playlist/remove/${video._id}/${playlistId}`
                );
                if (response?.data?.success) {
                    toast.success(response.data.message);
                    dispatch(
                        updatePlaylist({
                            playlistId: playlistId,
                            isVideoPresent: false,
                        })
                    );
                }
            } catch (error) {
                toast.error("Error while removing video to playlist");
                console.log(error);
            }
        }
    };

    function popupPlaylistForm() {
        dialog.current?.open();
        setMenu(false);
    }

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const playlists = useSelector((state) => state.playlists.playlists);

    return (
        <div className="border rounded-xl px-4 py-2 ml-1 mt-2 bg-opacity-5">
            <div className="flex justify-between">
                <div className="w-[80%]">
                    <h1 className="text-[1.3rem] font-semibold">
                        {video?.title}
                    </h1>
                    <p className="text-[0.9rem] text-gray-300">{`${video?.views} views • ${timeDistance}`}</p>
                </div>
                <div className="py-1 flex h-11">
                    <>
                        <LoginPopup
                            ref={LoginLikePopupDialog}
                            message="Login to Like this Video..."
                            route={location.pathname}
                        />
                        <button
                            onClick={toggleVideoLike}
                            className={`px-3 border rounded-lg border-gray-400 flex items-center hover:bg-gray-900`}
                        >
                            <p className="mr-1">{video?.likesCount}</p>
                            {video.isLiked ? (
                                <BiSolidLike className="w-5 h-5" />
                            ) : (
                                <BiLike className="w-5 h-5" />
                            )}
                        </button>
                    </>
                    <>
                        <PlaylistForm ref={dialog} route={location} />
                        <LoginPopup
                            ref={LoginSavePopupDialog}
                            message="Login to add this video in playlist..."
                            route={location.pathname}
                        />
                        <div ref={ref} className="relative">
                            <Button
                                onClick={() => {
                                    if (authStatus) {
                                        setMenu((prev) => !prev);
                                    } else {
                                        LoginSavePopupDialog.current.open();
                                    }
                                }}
                                className="border rounded-lg border-gray-400 ml-2 flex items-center hover:bg-gray-900"
                            >
                                <FaSave className="mr-1" />
                                Save
                            </Button>
                            {menu && (
                                <div className="absolute right-0 top-full z-10 w-64 overflow-hidden rounded-lg bg-zinc-900 p-4 hover:block peer-focus:block">
                                    <h3 className="mb-4 text-center text-lg font-semibold">
                                        Save to playlist
                                    </h3>
                                    <ul className="mb-4">
                                        {playlists?.length > 0 ? (
                                            playlists?.map((item) => (
                                                <li
                                                    key={item._id}
                                                    className="mb-2 last:mb-0 text-sm"
                                                >
                                                    <label
                                                        htmlFor={
                                                            "collection" +
                                                            item._id
                                                        }
                                                        className="group/label inline-flex cursor-pointer items-center gap-x-3"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={
                                                                "collection" +
                                                                item._id
                                                            }
                                                            defaultChecked={
                                                                item.isVideoPresent
                                                            }
                                                            onChange={(e) =>
                                                                handlePlaylistVideo(
                                                                    item._id,
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                        />
                                                        {item.name}
                                                    </label>
                                                </li>
                                            ))
                                        ) : (
                                            <div className="text-center">
                                                No playlist created.
                                            </div>
                                        )}
                                    </ul>
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={popupPlaylistForm}
                                            className="items-center gap-x-2 bg-pink-500 hover:bg-pink-500/90 border border-transparent rounded-lg hover:border-white px-2 py-1 font-semibold text-black"
                                        >
                                            Create new Playlist
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                </div>
            </div>
            <div className="flex justify-between mt-2">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <Link to={`/channel/${video?.owner?.username}`}>
                            <img
                                className={`w-11 h-11 mr-3 rounded-full object-cover`}
                                src={`${video?.owner?.avatar}`}
                                alt={video?.owner?.fullName}
                            />
                        </Link>
                        <div>
                            <p className="text-gray-100 text-[0.9rem]">
                                {video?.owner?.fullName}
                            </p>
                            <p className="text-gray-300  text-[0.8rem]">
                                {formatSubscription(
                                    video?.owner?.subscriberCount
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <>
                    <LoginPopup
                        ref={LoginSubsPopupDialog}
                        message="Login to Subscribe..."
                        route={location.pathname}
                    />
                    <Button
                        onClick={toggleSubscribe}
                        className={`flex h-10 items-center px-2 rounded-full ${
                            video.owner.isSubscribed
                                ? "hover:bg-pink-700"
                                : "hover:bg-gray-300"
                        }`}
                        textColor="text-black"
                        bgColor={
                            video?.owner?.isSubscribed
                                ? "bg-pink-600"
                                : "bg-gray-100"
                        }
                    >
                        {video?.owner?.isSubscribed ? (
                            <>
                                <p className="mr-2 font-semibold">Subscribed</p>
                                <FaCheckCircle />
                            </>
                        ) : (
                            <>
                                <p className="mr-2 font-semibold">Subscribe</p>
                                <FaBell />
                            </>
                        )}
                    </Button>
                </>
            </div>
            <div className="mt-4 border border-b-0 border-l-0 border-r-0 py-2 px-1 overflow-hidden flex justify-between">
                <p className={`${showFullDescription ? "" : "line-clamp-1"}`}>
                    {video.description ? video.description : "No description"}
                </p>
                <button
                    onClick={toggleDescription}
                    className="text-white ml-auto flex items-end"
                >
                    {showFullDescription ? (
                        <>
                            <FaChevronUp className="ml-1" />
                        </>
                    ) : (
                        <>
                            <FaChevronDown className="ml-1" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default VideoInfo;
