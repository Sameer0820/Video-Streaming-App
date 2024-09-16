import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserHistory } from "../hooks/getUserHistory.js";
import VideoListCard from "../components/Video/VideoListCard";
import { GoHistory } from "react-icons/go";
import { icons } from "../assets/Icons.jsx";

function History() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getUserHistory(dispatch).then(() => {
            setLoading(false);
        });
    }, []);

    const history = useSelector((state) => state.user.userHistory);

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
                <div className="w-full flex justify-center">
                    <div className="flex relative top-20 justify-center p-4">
                        <div className="w-full max-w-fit text-center">
                            <p className="mb-3 w-full">
                                <span className="inline-flex w-36 h-36 rounded-full bg-slate-900 p-2">
                                    <GoHistory className="w-32 h-32" />
                                </span>
                            </p>
                            <h5 className="mt-6 mb-2 text-2xl font-semibold">
                                Empty Video History
                            </h5>
                            <p> You have no previously saved history</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default History;
