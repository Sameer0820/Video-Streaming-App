import axiosInstance from "../utils/axios.helper";
import { addUserTweets } from "../store/userSlice";

export const getUserTweets = async (dispatch, userId) => {
    try {
        const response = await axiosInstance.get(`/tweets/user/${userId}`, {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addUserTweets(res.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
