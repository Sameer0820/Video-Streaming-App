import axiosInstance from "../utils/axios.helper";
import { addUserHistory } from "../store/userSlice";

export const getUserHistory = async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/users/history`);
        if (response?.data?.data) {
            dispatch(addUserHistory(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
