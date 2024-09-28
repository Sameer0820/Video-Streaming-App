import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { icons } from "../../assets/Icons";
import formatDate from "../../utils/formatDate";
import axiosInstance from "../../utils/axios.helper";
import { MdOutlineEmail } from "react-icons/md";
import { IoGlobeOutline, IoEyeOutline } from "react-icons/io5";
import { BsPlayBtn } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import { GoInfo } from "react-icons/go";

function AboutChannel() {
    const { username } = useParams();
    const user = useSelector((state) => state.user.user);
    const [aboutChannel, setAboutChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAboutChannel = async () => {
        try {
            const response = await axiosInstance.get(
                `/dashboard/stats/${user._id}`
            );
            if (response?.data?.success) {
                setAboutChannel(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching channel details", error);
        }
    };

    useEffect(() => {
        getAboutChannel().then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    return (
        <div className="text-white px-6 py-4">
            <div className="flex items-center mb-4">
                <h2 className="text-3xl font-semibold">@{username}</h2>
            </div>
            <div className="mb-4">
                <p className="ml-1">{user.description}</p>
            </div>
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Channel Details</h3>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <MdOutlineEmail className="w-6 h-6" />
                    <a
                        href={`mailto:${user.email}`}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        {user.email}
                    </a>
                </p>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <IoGlobeOutline className="w-6 h-6" />
                    <a
                        href={`/channel/${username}`}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        {`https://streamify/channel/${username}`}
                    </a>
                </p>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <BsPlayBtn className="w-6 h-6" />
                    <span>
                        <span className="font-semibold">
                            {aboutChannel.totalVideos}
                        </span>{" "}
                        Videos
                    </span>
                </p>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <IoEyeOutline className="w-6 h-6" />
                    <span>
                        <span className="font-semibold">
                            {aboutChannel.totalViews}
                        </span>{" "}
                        Views
                    </span>
                </p>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <BiLike className="w-6 h-6" />
                    <span>
                        <span className="font-semibold">
                            {aboutChannel.totalLikes}
                        </span>{" "}
                        Likes
                    </span>
                </p>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <AiOutlineMessage className="w-6 h-6" />
                    <span>
                        <span className="font-semibold">
                            {aboutChannel.totalTweets}
                        </span>{" "}
                        Tweets
                    </span>
                </p>
                <p className="ml-1 mb-[6px] flex items-center gap-2">
                    <GoInfo className="w-6 h-6" />
                    <span>
                        Joined on{" "}
                        <span className="font-semibold">
                            {formatDate(user.createdAt)}
                        </span>
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AboutChannel;
