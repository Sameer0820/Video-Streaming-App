import React from "react";
import { Link } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import formatDuration from "../../utils/formatDuration.js";

function VideoCard({ video }) {
    const formattedDuration = formatDuration(parseInt(video?.duration));
    const timeDistance = getTimeDistanceToNow(video?.createdAt);

    return (
        <div className="md:w-[25vw] w-[90vw] rounded mb-3 mt-2 text-white mx-3 relative">
            <Link to={`/watchpage/${video?._id}`}>
                <img
                    className="w-full h-[14vw] object-cover mb-3 rounded-xl border border-gray-800"
                    src={video?.thumbnail}
                    alt={video?.title}
                />
                <p className="absolute bottom-24 right-6 ">
                    {formattedDuration}
                </p>
            </Link>
            <div className="flex">
                <Link to={`/channel/${video?.owner?.username}`}>
                    <img
                        className="w-9 h-9 bg-gray-100 rounded-full object-cover"
                        src={video?.owner?.avatar}
                        alt={video?.owner?.fullname}
                    />
                </Link>
                <Link to={`/watchpage/${video?._id}`}>
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold">
                            {video?.title}
                        </h2>
                        <h2 className="text-gray-200">
                            {video?.owner?.username}
                        </h2>
                        <p className="text-gray-300 text-[0.95rem]">{`${video?.views} views • ${timeDistance}`}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default VideoCard;
