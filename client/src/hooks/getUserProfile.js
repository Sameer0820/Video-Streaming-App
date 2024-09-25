import axiosInstance from "../utils/axios.helper";
import { addUser } from "../store/userSlice";

export const getUserProfile = async (dispatch, username) => {
    try {
        const response = await axiosInstance.get(`/users/c/${username}`);
        if (response?.data?.data) {
            dispatch(addUser(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
