import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/Video/VideoPlayer";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setVideo } from "../store/videoSlice.js";
import { useParams } from "react-router-dom";
import VideoListCard from "../components/Video/VideoListCard.jsx";

function Video() {
    const dispatch = useDispatch();
    const [myVideo, setMyVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { videoId } = useParams();
    const { videos } = useSelector((state) => state.videos);

    const fetchVideo = async () => {
        setError("");
        try {
            const response = await axios.get(`/api/v1/videos/${videoId}`, {
                withCredentials: true,
            });
            if (response?.data?.data) {
                setMyVideo(response.data.data);
                dispatch(setVideo(response.data.data));
            }
        } catch (error) {
            setError("Error while fetching video");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideo();
    }, [videoId]);

    return (
        <div>
            {loading ? (
                <p className="flex text-xl justify-center mt-96">Loading...</p>
            ) : (
                <div className="flex">
                    <div className="w-[70%] p-4">
                        <div>
                            {error ? (
                                <p className="flex text-xl justify-center mt-80">
                                    {error}
                                </p>
                            ) : (
                                <VideoPlayer videoFile={myVideo.videoFile} />
                            )}
                        </div>
                    </div>
                    <div className="w-[30%]">
                        {videos
                            ?.filter((video) => video?._id !== videoId)
                            .map((video) => (
                                <VideoListCard
                                    key={video?._id}
                                    video={video}
                                    imgWidth="w-[13vw]"
                                    imgHeight="h-[8vw]"
                                    titleWidth="w-[95%]"
                                    titleSize="text-[0.95rem]"
                                    titleFont=""
                                    showVideoDescription={false}
                                    paddingY="py-1"
                                    marginLeft = "ml-2"
                                    marginLeft2="ml-2"
                                    avatarHeight="h-7"
                                    avatarWidth="w-7"
                                    textFont="text-[0.9rem]"
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Video;
