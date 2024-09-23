import axiosInstance from "../utils/axios.helper";
import { addUserVideo } from "../store/userSlice";

export const getUserVideos = async (dispatch, userId) => {
    try {
        const response = await axiosInstance.get(`/videos/c/${userId}`);
        if (response?.data?.data) {
            dispatch(addUserVideo(res.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
