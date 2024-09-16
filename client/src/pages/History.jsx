import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserHistory } from "../hooks/getUserHistory.js";
import VideoListCard from "../components/Video/VideoListCard";
import { GoHistory } from "react-icons/go";
import { icons } from "../assets/Icons.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import GuestHistory from "../components/GuestPages/GuestHistory.jsx";

function History() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const status = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (status) {
            getUserHistory(dispatch).then(() => {
                setLoading(false);
            });
        }
    }, [status]);

    const history = useSelector((state) => state.user.userHistory);

    if (!status) {
        return <GuestHistory />;
    }

    return (
        <>
            {loading && (
                <span className="flex justify-center mt-20">
                    {icons.bigLoading}
                </span>
            )}
            {history?.length > 0 &&
                !loading &&
                history.map((video) => (
                    <div key={video._id}>
                        <VideoListCard
                            video={video}
                            imgWidth="w-[20vw]"
                            imgHeight="h-[11vw]"
                        />
                    </div>
                ))}
            {history?.length < 1 && !loading && (
                <GuestComponent
                    icon={
                        <span className="w-full h-full flex items-center p-4 pb-5">
                            <GoHistory className="w-32 h-32" />
                        </span>
                    }
                    title="Empty Video History"
                    subtitle="You have no previously saved history"
                    guest={false}
                />
            )}
        </>
    );
}

export default History;
