import React from "react";
import { useSelector } from "react-redux";
import InfoBox from "./InfoBox";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegUser, FaRegHeart } from "react-icons/fa";

function ChannelStats({ stats }) {
    const user = useSelector((state) => state.auth.userData);

    return (
        <>
            <div className="flex flex-wrap justify-between gap-4">
                <div className="block">
                    <h1 className="text-2xl font-bold">
                        Welcome Back , {user?.fullName}
                    </h1>
                    <p className="text-sm text-gray-300">
                        Track and manage your channel and videos.
                    </p>
                </div>
                {/* Upload Video */}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4">
                <InfoBox
                    key="total-videos"
                    title="Total Videos"
                    value={stats.totalVideos}
                    icon={<GoDeviceCameraVideo className="h-6 w-6"/>}
                />
                <InfoBox
                    key="total-views"
                    title="Total Views"
                    value={stats.totalViews}
                    icon={<MdOutlineRemoveRedEye className="h-6 w-6"/>}
                />
                <InfoBox
                    key="total-subscribers"
                    title="Total Subscribers"
                    value={stats.subscriberCount}
                    icon={<FaRegUser className="h-6 w-6"/>}
                />
                <InfoBox
                    key="total-likes"
                    title="Total Likes"
                    value={stats.totalLikes}
                    icon={<FaRegHeart className="h-6 w-6"/>}
                />
            </div>
        </>
    );
}

export default ChannelStats;
