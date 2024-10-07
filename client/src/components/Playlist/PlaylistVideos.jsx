import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import PlaylistForm from "./PlaylistForm";
import ChannelEmptyPlaylist from "../Channel/ChannelEmptyPlaylist";
import { icons } from "../../assets/Icons.jsx";
import axiosInstance from "../../utils/axios.helper";
import ConfirmPopup from "../ConfirmPopup.jsx";
import { toast } from "react-toastify";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { setPlaylist } from "../../store/playlistSlice.js";
import { removeVideoPlaylist } from "../../store/playlistSlice.js";
import VideoListCard from "../Video/VideoListCard.jsx";
import { MdDelete } from "react-icons/md";
import GuestComponent from "../GuestPages/GuestComponent.jsx";

function PlaylistVideos() {
    const { playlistId } = useParams();
    const dispatch = useDispatch();
    const dialog = useRef();
    const deletePlaylistPopup = useRef();
    const ref = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menu, setMenu] = useState(false);
    const location = useLocation();

    const { status, userData } = useSelector((state) => state.auth);

    const getPlaylistById = async () => {
        setError("");
        try {
            const response = await axiosInstance.get(`/playlist/${playlistId}`);
            if (response?.data?.success) {
                dispatch(setPlaylist(response.data.data));
            }
        } catch (error) {
            setError(
                <GuestComponent
                    title="Playlist does not exist"
                    subtitle="There is no playlist for give playlistId. It may have been moved or deleted."
                    icon={
                        <span className="w-full h-full flex items-center p-4">
                            <MdOutlineFeaturedPlayList className="w-28 h-28" />
                        </span>
                    }
                    guest={false}
                />
            );
            console.log("Error while fetching playlist", error);
        }
    };

    useEffect(() => {
        getPlaylistById().then(() => setLoading(false));
    }, [playlistId]);

    const playlist = useSelector((state) => state.playlist.playlist);

    const deletePlaylist = async (isConfirm) => {
        if (isConfirm) {
            try {
                await axiosInstance
                    .delete(`/playlist/${playlistId}`)
                    .then(() => {
                        navigate(
                            `/channel/${playlist.owner.username}/playlist`
                        );
                        toast.success("Playlist deleted successfully");
                    });
            } catch (error) {
                console.log("Error while deleting playlist", error);
            }
        }
    };

    const deleteVideo = async (videoId) => {
        try {
            await axiosInstance
                .patch(`/playlist/remove/${videoId}/${playlistId}`)
                .then((res) => {
                    dispatch(removeVideoPlaylist(videoId));
                    toast.success(res.data.message);
                });
        } catch (error) {
            toast.error("Error while removing video. Try again!!");
            console.log("Error while removing video", error);
        }
    };

    const handleUpdate = () => {
        dialog.current?.open();
        setMenu(false);
    };

    const handleDelete = () => {
        deletePlaylistPopup.current?.open();
        setMenu(false);
    };

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

    if (error) {
        return error;
    }

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    return (
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
                <div className="w-full shrink-0 sm:max-w-md ">
                    <div className="relative w-full pt-[60%]">
                        <div className="absolute inset-0">
                            <img
                                src={
                                    playlist?.thumbnail
                                        ? playlist?.thumbnail
                                        : "https://res.cloudinary.com/dgfh6tf6j/image/upload/v1727779646/Screenshot_2024-10-01_161624_bwpw83.png"
                                }
                                alt={playlist.name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0">
                                <div className="relative border-t bg-white/30 px-4 py-2 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                    <div className="relative z-[1]">
                                        <p className="flex justify-between">
                                            <span className="inline-block">
                                                Playlist
                                            </span>
                                            <span className="inline-block text-center">
                                                {playlist.videosCount} video
                                                {playlist.videosCount > 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-200">
                                            {playlist.totalViews} view
                                            {playlist.totalViews > 1
                                                ? "s"
                                                : ""}{" "}
                                            · {formatDate(playlist.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold">
                        {playlist.name}
                    </h2>
                    <div className="mt-4 flex items-center gap-x-3">
                        <div className="h-12 w-12 shrink-0">
                            <Link to={`/channel/${playlist.owner.username}`}>
                                <img
                                    src={playlist.owner.avatar}
                                    alt={playlist.owner.fullName}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </Link>
                        </div>
                        <div className="w-full">
                            <h6 className="font-semibold">
                                {playlist.owner.fullName}
                            </h6>
                            <p className="text-sm text-gray-300">
                                @{playlist.owner.username}
                            </p>
                        </div>
                        {status &&
                            userData.username === playlist.owner.username && (
                                <div ref={ref} className="relative">
                                    <button
                                        onClick={() => setMenu((prev) => !prev)}
                                        className="p-2 hover:bg-slate-800 hover:rounded-full"
                                    >
                                        <BsThreeDotsVertical />
                                    </button>
                                    {menu && (
                                        <div className="absolute right-0 w-24 bg-black rounded-lg shadow-lg text-sm">
                                            <button
                                                onClick={() => handleUpdate()}
                                                className="block w-full text-left px-4 py-2 hover:bg-slate-900 hover:rounded-lg"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete()}
                                                className="block w-full text-left px-4 py-2 hover:bg-slate-900 hover:rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                    <ConfirmPopup
                                        ref={deletePlaylistPopup}
                                        title={`Confirm to Delete ${playlist.name}`}
                                        subtitle="Once playlist is deleted it cannot be recovered."
                                        message="Note: The videos within the playlist won't be deleted."
                                        confirm="Delete"
                                        cancel="Cancel"
                                        critical
                                        actionFunction={deletePlaylist}
                                    />
                                    <PlaylistForm
                                        ref={dialog}
                                        playlist={playlist}
                                        route={location}
                                    />
                                </div>
                            )}
                    </div>
                    <p className="flex mt-4 text-sm text-gray-200">
                        {playlist.description}
                    </p>
                </div>
                <ul className="flex w-full flex-col gap-y-4">
                    {playlist.videosCount > 0 || (
                        <div className="h-full w-full flex items-center justify-center">
                            <ChannelEmptyPlaylist videos={true} />
                        </div>
                    )}
                    {playlist?.videos?.map((video) => (
                        <div
                            className="flex hover:bg-zinc-900 rounded-lg"
                            key={video._id}
                        >
                            <VideoListCard
                                video={video}
                                imgWidth="w-[300px]"
                                imgHeight="h-[180px]"
                                titleWidth="w-[100%]"
                                titleSize="text-[1.1rem]"
                                titleFont=""
                                paddingY="py-1"
                                marginLeft="ml-2"
                                marginLeft2="ml-4"
                                avatarHeight="h-10"
                                avatarWidth="w-10"
                                textFont="text-[0.9rem]"
                                descriptionWidth="w-[100%]"
                            />
                            {status &&
                                userData.username ===
                                    playlist.owner.username && (
                                    <button
                                        title="remove video"
                                        className="flex p-1"
                                    >
                                        <MdDelete
                                            onClick={() =>
                                                deleteVideo(video._id)
                                            }
                                            className="w-6 h-6 hover:text-red-500"
                                        />
                                    </button>
                                )}
                        </div>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default PlaylistVideos;
