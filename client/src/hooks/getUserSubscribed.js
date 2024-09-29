import axiosInstance from "../utils/axios.helper";
import { addUserSubscribed } from "../store/userSlice";

export const getUserSubscribed = async (dispatch, subscriberId) => {
    try {
        const response = await axiosInstance.get(`/subscriptions/u/${subscriberId}`);
        if (response?.data?.success) {
            dispatch(addUserSubscribed(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
