import axios from "axios";
import { addUserHistory } from "../store/userSlice";

export const getUserHistory = async (dispatch) => {
    try {
        const response = await axios.get(`/api/v1/users/history`, {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addUserHistory(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
