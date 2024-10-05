import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../utils/formatDate";
import { Link } from "react-router-dom";
import ConfirmPopup from "../ConfirmPopup";
import axiosInstance from "../../utils/axios.helper";
import { toast } from "react-toastify";
import { updateVideoPublishStatus } from "../../store/dashboardSlice";
import { deleteVideo } from "../../store/dashboardSlice";
import { MdDelete, MdEdit } from "react-icons/md";
import VideoForm from "./VideoForm";
import { getChannelStats } from "../../hooks/getChannelStats.js";

function VideoCard({ video }) {
    const dispatch = useDispatch();
    const confirmDialog = useRef();
    const editDialog = useRef();
    const user = useSelector((state) => state.auth.userData);

    const [publishStatus, setPublishStatus] = useState(video?.isPublished);

    const handleTogglePublish = async () => {
        try {
            const response = await axiosInstance.patch(
                `/videos/toggle/publish/${video._id}`
            );
            if (response.data.success) {
                dispatch(
                    updateVideoPublishStatus({
                        videoId: video._id,
                        isPublished: !video.isPublished,
                    })
                );
                toast.success(response.data.message);
                setPublishStatus((pre) => !pre);
            }
        } catch (error) {
            toast.error("Error while toggling publish status");
            console.log(error);
        }
    };

    const handleDeleteVideo = async (isConfirm) => {
        if (isConfirm) {
            try {
                const response = await axiosInstance.delete(
                    `/videos/${video._id}`
                );
                if (response.data.success) {
                    toast.success(response.data.message);
                    dispatch(deleteVideo({ videoId: video._id }));
                    getChannelStats(dispatch, user._id);
                }
            } catch (error) {
                toast.error("Error while deleting video");
                console.log(error);
            }
        }
    };

    return (
        <tr key={video._id} className="group border">
            <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex justify-center">
                    <label
                        htmlFor={"vid" + video._id}
                        className="relative inline-block w-12 cursor-pointer overflow-hidden"
                    >
                        <input
                            type="checkbox"
                            onClick={handleTogglePublish}
                            id={"vid" + video._id}
                            defaultChecked={video.isPublished}
                            className="peer sr-only"
                        />
                        <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-pink-600 peer-checked:after:left-7"></span>
                    </label>
                </div>
            </td>
            <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex justify-center">
                    <span
                        className={`inline-block rounded-2xl border px-1.5 py-0.5 ${
                            publishStatus
                                ? "border-green-600 text-green-600"
                                : "border-orange-600 text-orange-600"
                        }`}
                    >
                        {publishStatus ? "Published" : "Unpublished"}
                    </span>
                </div>
            </td>
            <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <div className="flex justify-start items-center gap-4">
                    {publishStatus ? (
                        <Link to={`/watchpage/${video._id}`}>
                            <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={video.thumbnail}
                                alt={video.title}
                            />
                        </Link>
                    ) : (
                        <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={video.thumbnail}
                            alt={video.title}
                        />
                    )}
                    <h3 className="font-semibold">
                        {publishStatus ? (
                            <Link
                                to={`/watchpage/${video._id}`}
                                className="hover:text-gray-300"
                            >
                                {video.title?.length > 35
                                    ? video.title.substr(0, 35) + "..."
                                    : video.title}
                            </Link>
                        ) : video.title?.length > 35 ? (
                            video.title.substr(0, 35) + "..."
                        ) : (
                            video.title
                        )}
                    </h3>
                </div>
            </td>
            <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                {formatDate(video.createdAt)}
            </td>
            <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                {video.views}
            </td>
            <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                {video.commentsCount}
            </td>
            <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
                {video.likesCount}
            </td>
            <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                <ConfirmPopup
                    ref={confirmDialog}
                    title="Delete Video"
                    subtitle={`${video.title} - Total views: ${video.views}`}
                    confirm="Delete"
                    cancel="Cancel"
                    critical
                    message="Are you sure you want to delete this video? Once deleted, you will not be able to recover it."
                    actionFunction={handleDeleteVideo}
                />
                <VideoForm ref={editDialog} video={video} />
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => confirmDialog.current.open()}
                        title="Delete video"
                    >
                        <MdDelete className="h-5 w-5 hover:text-red-500" />
                    </button>
                    <button
                        onClick={() => editDialog.current?.open()}
                        title="Edit video"
                    >
                        <MdEdit className="h-5 w-5 hover:text-red-500" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default VideoCard;
