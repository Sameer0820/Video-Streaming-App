import axios from "axios";
import { addUserVideo } from "../store/userSlice";

export const getUserVideos = async (dispatch, userId) => {
    try {
        const response = await axios.get(`/api/v1/videos/c/${userId}`, {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addUserVideo(res.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
