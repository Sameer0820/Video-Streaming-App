import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserVideos } from "../../hooks/getUserVideos";
import ChannelEmptyVideo from "./ChannelEmptyVideo";
import { icons } from "../../assets/Icons.jsx";
import VideoCard from "../Video/VideoCard.jsx";

function ChannelVideos() {
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("desc");
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.user._id);

    useEffect(() => {
        getUserVideos(dispatch, userId, sortType).then(() => {
            setLoading(false);
        });
    }, [userId, sortType]);

    const videos = useSelector((state) => state.user.userVideo);

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    return videos && videos?.length < 1 ? (
        <ChannelEmptyVideo />
    ) : (
        <div className="overflow-hidden mt-2">
            <div className="flex mx-5">
                <button
                    type="button"
                    className={`px-3 py-1.5 mr-3 text-sm rounded-lg ${
                        sortType === "desc" ? "bg-pink-500 " : "bg-slate-700"
                    }`}
                    onClick={() => setSortType("desc")}
                >
                    Latest
                </button>
                <button
                    type="button"
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                        sortType === "asc" ? "bg-pink-500 " : "bg-slate-700 "
                    }`}
                    onClick={() => setSortType("asc")}
                >
                    Oldest
                </button>
            </div>
            <div className="flex flex-wrap justify-start">
                {videos?.map((video) => (
                    <VideoCard key={video?._id} video={video} name={false} />
                ))}
            </div>
        </div>
    );
}

export default ChannelVideos;
