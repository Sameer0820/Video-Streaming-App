import React, { useEffect, useState } from "react";
import VideoCard from "../components/Video/VideoCard";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios.helper";
import { FaRegPlayCircle } from "react-icons/fa";
import GuestSubscriptions from "../components/GuestPages/GuestSubscriptions";
import GuestComponent from "../components/GuestPages/GuestComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { icons } from "../assets/Icons.jsx";

function Subscriptions() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    const getData = async (page) => {
        try {
            const response = await axiosInstance.get(
                `/videos/s/subscription?page=${page}&limit=20`
            );
            if (response?.data?.success) {
                setVideos((prevVideos) => [
                    ...prevVideos,
                    ...response.data.data,
                ]);
                setLoading(false);
                if (response.data.data.length !== 20) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log("Error fetching videos", error);
        }
    };

    useEffect(() => {
        if (authStatus) {
            getData(page);
        }
    }, [page]);

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (!authStatus) {
        return <GuestSubscriptions />;
    }

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    if (videos?.length === 0) {
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
        <div className="overflow-auto">
            <InfiniteScroll
                dataLength={videos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <div className="flex justify-center h-7 mt-1">
                        {icons.loading}
                    </div>
                }
                scrollableTarget="scrollableDiv"
            >
                <div className="overflow-hidden mb-2 mx-2">
                    <div
                        className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 ${
                            videos.length < 4 &&
                            "sm:grid-cols-[repeat(auto-fit,_minmax(300px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
                        }`}
                    >
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default Subscriptions;
