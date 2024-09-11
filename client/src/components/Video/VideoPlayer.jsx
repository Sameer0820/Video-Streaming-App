import React from "react";

const VideoPlayer = ({videoFile}) => {
    return (
        <video className="rounded-xl w-full max-h-[70vh]" controls autoPlay>
            <source src={videoFile} type="video/mp4" />
        </video>
    );
};

export default VideoPlayer;
