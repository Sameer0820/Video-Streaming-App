import React from "react";
import { BiLike } from "react-icons/bi";
import GuestComponent from "./GuestComponent";

function GuestLikedVideos() {
    return (
        <GuestComponent
            title="Save your favourite videos"
            subtitle="Revisit the videos you love by signing in and liking them."
            icon={
                <span className="w-full h-full flex items-center p-4 pb-5">
                    <BiLike className="w-32 h-32"/>
                </span>
            }
            route="/liked-videos"
        />
    );
}

export default GuestLikedVideos;
