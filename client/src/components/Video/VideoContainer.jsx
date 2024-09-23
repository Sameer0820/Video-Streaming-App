import React, { useEffect } from "react";
import VideoCard from "./VideoCard";
import { addVideos } from "../../store/videosSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { FaVideo } from "react-icons/fa";
import axiosInstance from "../../utils/axios.helper.js";

function VideoContainer() {
    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.videos);

    const getData = async () => {
        try {
            const response = await axiosInstance.get("/videos");
            if (response?.data?.data?.length > 0) {
                dispatch(addVideos(response?.data?.data));
            }
        } catch (error) {
            console.log("Error fetching videos", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (!videos || videos?.length === 0) {
        return (
            <div className="flex justify-center mt-[30vh]">
                <div className="flex flex-col items-center">
                    <FaVideo className="w-20 h-20" />
                    <h1>No Videos Available</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden mt-5">
            <div className="flex flex-wrap justify-around">
                {videos?.map((video) => (
                    <VideoCard key={video?._id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default VideoContainer;
