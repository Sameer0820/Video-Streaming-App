import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideos, setStats } from "../store/dashboardSlice";
import { toast } from "react-toastify";
import { icons } from "../assets/Icons.jsx";
import GuestDashboard from "../components/GuestPages/GuestDashboard";
import axiosInstance from "../utils/axios.helper.js";
import ChannelStats from "../components/Dashboard/ChannelStats.jsx";
import VideoPanel from "../components/Dashboard/VideoPanel.jsx";

function Dashboard() {
    const dispatch = useDispatch();
    const { status, userData } = useSelector((state) => state.auth);
    const [statsloading, setStatsLoading] = useState(true);
    const [videoloading, setVideoLoading] = useState(true);

    const getChannelStats = async () => {
        try {
            const response = await axiosInstance.get(
                `/dashboard/stats/${userData._id}`
            );
            if (response?.data?.success) {
                dispatch(setStats(response.data.data));
                setStatsLoading(false);
            }
        } catch (error) {
            toast.error("Error getting channel stats");
            console.log(error);
        }
    };

    const getChannelVideos = async () => {
        try {
            const response = await axiosInstance.get(`/dashboard/videos`);
            if (response?.data?.success) {
                dispatch(setVideos(response.data.data));
                setVideoLoading(false);
            }
        } catch (error) {
            toast.error("Error getting channel videos");
            console.log(error);
        }
    };

    useEffect(() => {
        if (status) {
            getChannelVideos();
            getChannelStats();
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
