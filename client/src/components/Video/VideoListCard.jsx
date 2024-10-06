import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
    paddingY = "py-2",
    marginLeft = "ml-10",
    marginLeft2 = "ml-4",
    avatarWidth = "w-9",
    avatarHeight = "h-9",
    textFont = "",
    video,
}) {
    const formattedDuration = formatDuration(parseInt(video?.duration));
    const timeDistance = getTimeDistanceToNow(video?.createdAt);
    const navigate = useNavigate();

    const handleChannelClick = (e) => {
        e.preventDefault();
        navigate(`/channel/${video?.owner?.username}`);
    };

    return (
        <div className={`${mainDivWidth}`}>
            <Link to={`/watchpage/${video?._id}`}>
                <div className={`${paddingY} hover:bg-zinc-900 rounded-lg`}>
                    <div className={`text-white ${marginLeft} flex`}>
                        <div className="relative flex-shrink-0">
                            <img
                                className={`${imgWidth} ${imgHeight} object-cover rounded-xl`}
                                src={video?.thumbnail}
                                alt={video?.title}
                            />
                            <p className={`absolute bottom-1 right-3 ${textFont}`}>
                                {formattedDuration}
                            </p>
                        </div>
                        <div className={`${marginLeft2}`}>
                            <h1
                                title={video?.title}
                                className={`${titleFont} ${titleWidth} ${titleSize} line-clamp-1`}
                            >
                                {video?.title}
                            </h1>
                            <p className="mb-2 text-gray-400 text-[0.85rem]">{`${video?.views} views • ${timeDistance}`}</p>
                            <div onClick={handleChannelClick}>
                                <div className="flex items-center mb-2 text-[0.95rem]">
                                    <img
                                        className={`${avatarWidth} ${avatarHeight} mr-3 rounded-full object-cover`}
                                        src={`${video?.owner?.avatar}`}
                                        alt={video?.owner?.fullName}
                                    />
                                    <p className="text-gray-300">
                                        {video?.owner?.fullName}
                                    </p>
                                </div>
                            </div>
                            {showVideoDescription && (
                                <span>
                                    <p
                                        className={`${descriptionWidth} text-gray-300 text-[0.90rem] line-clamp-2`}
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
