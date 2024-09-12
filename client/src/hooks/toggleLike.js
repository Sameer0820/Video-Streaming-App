import axios from "axios";

export const toggleVideoLike = async (videoId) => {
    try {
        const response = await axios.post(
            `/api/v1/likes/toggle/v/${videoId}`,
            {},
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const toggleCommentLike = async (commentId) => {
    try {
        const response = await axios.post(
            `/api/v1/likes/toggle/c/${commentId}`,
            {},
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const toggleTweetLike = async (tweetId) => {
    try {
        const response = await axios.post(
            `/api/v1/likes/toggle/t/${tweetIdId}`,
            {},
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};
