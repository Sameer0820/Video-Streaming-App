import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserLikedVideos } from "../hooks/getuserLikedVideos";
import VideoListCard from "../components/Video/VideoListCard";
import { BiLike } from "react-icons/bi";
import { icons } from "../assets/Icons.jsx";
import GuestLikedVideos from "../components/GuestPages/GuestLikedVideos.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";

function LikedVideos() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const status = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (status) {
            getUserLikedVideos(dispatch).then(() => {
                setLoading(false);
            });
        }
    }, [status]);

    const likedVideos = useSelector((state) => state.user.userLikedVideos);

    if (!status) {
        return <GuestLikedVideos />;
    }

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
                <GuestComponent
                    icon={
                        <span className="w-full h-full flex items-center p-4 pb-5">
                            <BiLike className="w-32 h-32" />
                        </span>
                    }
                    title="Empty Liked Videos"
                    subtitle="You have no previously liked videos"
                    guest={false}
                />
            )}
        </>
    );
}

export default LikedVideos;
