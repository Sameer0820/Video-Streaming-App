import axios from "axios";
import { addUserTweets } from "../store/userSlice";

export const getUserTweets = async (dispatch, userId) => {
    try {
        const response = await axios.get(`/api/v1/tweets/user/${userId}`, {
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
