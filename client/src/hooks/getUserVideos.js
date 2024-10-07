import axiosInstance from "../utils/axios.helper";
import { addUserVideo } from "../store/userSlice";

export const getUserVideos = async (
    dispatch,
    userId,
    sortType,
    page = 1,
    limit = 10
) => {
    try {
        const response = await axiosInstance.get(`/videos/c/${userId}`, {
            params: {
                sortType: sortType,
                page: page,
                limit: limit,
            },
        });
        if (response?.data?.data) {
            dispatch(addUserVideo(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
