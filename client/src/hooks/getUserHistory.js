import axiosInstance from "../utils/axios.helper";
import { addUserHistory } from "../store/userSlice";

export const getUserHistory = async (dispatch, page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get(
            `/users/history?page=${page}&limit=${limit}`
        );
        if (response?.data?.data) {
            dispatch(addUserHistory(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
