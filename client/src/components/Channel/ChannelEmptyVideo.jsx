import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoPlayOutline, IoAdd } from "react-icons/io5";

function ChannelEmptyVideo() {
    const { status, userData } = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    if (status && user.username === userData.username) {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-6">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-pink-500 p-2">
                            <IoPlayOutline className="w-6 h-6"/>
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">No videos uploaded</h5>
                    <p>
                        You have yet to upload a video. Click to upload new
                        video.
                    </p>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="mt-4 inline-flex items-center gap-x-2 bg-pink-500 hover:bg-pink-500/90 border border-transparent rounded-lg hover:border-white px-3 py-1.5 font-semibold text-black"
                    >
                        <IoAdd className="w-5 h-5"/>
                        New Video
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-6">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-pink-500 p-2">
                            <IoPlayOutline className="w-6 h-6"/>
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">No videos uploaded</h5>
                    <p>
                        This page has yet to upload a video. Search another page
                        in order to find more videos.
                    </p>
                </div>
            </div>
        );
    }
}

export default ChannelEmptyVideo;
