import axiosInstance from "../utils/axios.helper";
import { addUserLikedVideos } from "../store/userSlice";

export const getUserLikedVideos = async (dispatch, page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get(
            `/likes/videos?page=${page}&limit=${limit}`
        );
        if (response?.data?.data) {
            dispatch(addUserLikedVideos(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
