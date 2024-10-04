import React, { useEffect } from "react";
import VideoCard from "../components/Video/VideoCard";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios.helper";
import { addSubscribedVideos } from "../store/videosSlice";
import { FaRegPlayCircle } from "react-icons/fa";
import GuestSubscriptions from "../components/GuestPages/GuestSubscriptions";
import GuestComponent from "../components/GuestPages/GuestComponent";

function Subscriptions() {
    const dispatch = useDispatch();
    const videos = useSelector((state) => state.videos.subscribedVideos);
    const authStatus = useSelector((state) => state.auth.status);

    const getData = async () => {
        try {
            const response = await axiosInstance.get("/videos/s/subscription");
            if (response?.data?.success) {
                dispatch(addSubscribedVideos(response?.data?.data));
            }
        } catch (error) {
            console.log("Error fetching videos", error);
        }
    };

    useEffect(() => {
        if (authStatus) {
            getData();
        }
    }, []);

    if (!authStatus) {
        return <GuestSubscriptions />;
    }

    if (!videos || videos?.length === 0) {
        return (
            <GuestComponent
                icon={
                    <span className="w-full h-full flex items-center p-4">
                        <FaRegPlayCircle className="w-32 h-32" />
                    </span>
                }
                title="No Videos Available"
                subtitle="Either you don't have any subscribed channels or your subscribed channels have no video."
                guest={false}
            />
        );
    }

    return (
        <div className="overflow-hidden mt-5">
            <div className="flex flex-wrap justify-start">
                {videos?.map((video) => (
                    <VideoCard key={video?._id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
