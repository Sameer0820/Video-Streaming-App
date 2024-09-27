import axiosInstance from "../utils/axios.helper";
import { addUserTweets } from "../store/userSlice";

export const getUserTweets = async (dispatch, userId) => {
    try {
        const response = await axiosInstance.get(`/tweets/user/${userId}`);
        if (response?.data?.data) {
            dispatch(addUserTweets(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
