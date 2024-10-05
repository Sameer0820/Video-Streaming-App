import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../assets/Icons.jsx";
import GuestDashboard from "../components/GuestPages/GuestDashboard";
import ChannelStats from "../components/Dashboard/ChannelStats.jsx";
import VideoPanel from "../components/Dashboard/VideoPanel.jsx";
import { getChannelStats } from "../hooks/getChannelStats.js";
import { getChannelVideos } from "../hooks/getChannelVideos.js";

function Dashboard() {
    const dispatch = useDispatch();
    const { status, userData } = useSelector((state) => state.auth);
    const [statsloading, setStatsLoading] = useState(true);
    const [videoloading, setVideoLoading] = useState(true);

    useEffect(() => {
        if (status) {
            getChannelVideos(dispatch).then(() => setVideoLoading(false));
            getChannelStats(dispatch, userData._id).then(() =>
                setStatsLoading(false)
            );
        }
    }, []);

    const { videos, stats } = useSelector((state) => state.dashboard);

    if (!status) {
        return <GuestDashboard />;
    }

    if (videoloading || statsloading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    } else {
        return (
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
                <ChannelStats stats={stats} />
                <VideoPanel channelVideos={videos} />
            </div>
        );
    }
}

export default Dashboard;
