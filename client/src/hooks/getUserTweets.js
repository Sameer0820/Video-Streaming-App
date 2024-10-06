import axiosInstance from "../utils/axios.helper";
import { addUserTweets } from "../store/userSlice";

export const getUserTweets = async (dispatch, userId, page = 1, limit = 30) => {
    try {
        const response = await axiosInstance.get(
            `/tweets/user/${userId}?page=${page}&limit=${limit}`
        );
        if (response?.data?.data) {
            dispatch(addUserTweets(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
