import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserLikedVideos } from "../hooks/getuserLikedVideos";
import VideoListCard from "../components/Video/VideoListCard";
import { BiLike } from "react-icons/bi";
import { icons } from "../assets/Icons.jsx";

function LikedVideos() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getUserLikedVideos(dispatch).then(() => {
            setLoading(false);
        });
    }, []);

    const likedVideos = useSelector((state) => state.user.userLikedVideos);

    return (
        <>
            {loading && (
                <span className="flex justify-center mt-20">
                    {icons.bigLoading}
                </span>
            )}
            {likedVideos?.length > 0 &&
                !loading &&
                likedVideos.map((video) => (
                    <div key={video._id}>
                        <VideoListCard
                            video={video.video}
                            imgWidth="w-[20vw]"
                            imgHeight="h-[11vw]"
                        />
                    </div>
                ))}
            {likedVideos?.length < 1 && !loading && (
                <div className="w-full flex justify-center">
                    <div className="flex relative top-20 justify-center p-4">
                        <div className="w-full max-w-fit text-center">
                            <p className="mb-3 w-full">
                                <span className="inline-flex w-36 h-36 rounded-full bg-slate-900 p-2">
                                    <BiLike className="w-32 h-32" />
                                </span>
                            </p>
                            <h5 className="mt-6 mb-2 text-2xl font-semibold">
                                Empty Liked Videos
                            </h5>
                            <p> You have no previously liked videos</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default LikedVideos;
