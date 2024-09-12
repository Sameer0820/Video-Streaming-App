import React, { useState } from "react";
import getTimeDistanceToNow from "../../utils/getTimeDistance";
import { NavLink, Link } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { FaSave, FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Button from "../Button";
import { useSelector } from "react-redux";

function VideoInfo({ video }) {
    const timeDistance = getTimeDistanceToNow(video?.createdAt);
    const authStatus = useSelector((state) => state.auth.status);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

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
                    <button
                        className={`px-3 border rounded-lg border-gray-400 flex items-center hover:bg-gray-900 ${
                            video.isLiked ? "text-blue-500" : ""
                        }`}
                    >
                        <p className="mr-1">{video?.likesCount}</p>
                        <BiLike className="w-5 h-5" />
                    </button>
                    <Button className="border rounded-lg border-gray-400 ml-2 flex items-center hover:bg-gray-900">
                        <FaSave className="mr-1" />
                        Save
                    </Button>
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
                                {video?.owner?.subscriberCount} subscribers
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    className="flex h-10 items-center hover:bg-gray-300 px-2 rounded-full"
                    textColor="text-black"
                    bgColor="bg-gray-100"
                >
                    <p className="mr-2 font-semibold">Subscribe</p>
                    <FaBell />
                </Button>
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
