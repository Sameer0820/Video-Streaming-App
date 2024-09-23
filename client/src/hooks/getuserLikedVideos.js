import axiosInstance from "../utils/axios.helper";
import { addUserLikedVideos } from "../store/userSlice";

export const getUserLikedVideos = async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/likes/videos`);
        if (response?.data?.data) {
            dispatch(addUserLikedVideos(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
