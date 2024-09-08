import React from "react";
import { Link } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import formatDuration from "../../utils/formatDuration.js";

function VideoListCard({
    imgWidth = "w-[25vw]",
    imgHeight = "h-[14vw]",
    mainDivWidth = "w-full",
    titleWidth = "w-[65%]",
    titleFont = "font-semibold",
    titleSize = "text-[1.2rem]",
    showVideoDescription = true,
    descriptionWidth = "w-[40vw]",
    divBorder = "",
    video,
}) {
    const formattedDuration = formatDuration(parseInt(video?.duration));
    const timeDistance = getTimeDistanceToNow(video?.createdAt);
    return (
        <div className={`${mainDivWidth} ${divBorder}`}>
            <Link to={`/watchpage/${video?._id}`}>
                <div className="py-2  hover:bg-zinc-900">
                    <div className="text-white ml-10 py-2 flex">
                        <div className="relative">
                            <img
                                className={`${imgWidth} ${imgHeight} object-cover rounded-xl`}
                                src={video?.thumbnail}
                                alt={video?.title}
                            />
                            <p className="absolute bottom-2 right-4">
                                {formattedDuration}
                            </p>
                        </div>
                        <div className="ml-4 w-[37%]">
                            <h1
                                className={`${titleFont} ${titleWidth} ${titleSize}`}
                            >
                                {video?.title}
                            </h1>
                            <p className="mb-2 text-gray-400 text-[0.85rem]">{`${video?.views} views • ${timeDistance}`}</p>
                            <Link to={`/channel/${video?.owner?.username}`}>
                                <div className="flex items-center mb-2  text-[0.95rem]">
                                    <img
                                        className="w-9 h-9 mr-3 rounded-full object-cover"
                                        src={`${video?.owner?.avatar}`}
                                        alt={video?.owner?.fullname}
                                    />
                                    <p className="text-gray-300">
                                        {video?.owner?.username}
                                    </p>
                                </div>
                            </Link>
                            {showVideoDescription && (
                                <span>
                                    <p
                                        className={`${descriptionWidth} text-gray-300 text-[0.90rem]`}
                                    >
                                        {video?.description}
                                    </p>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default VideoListCard;
