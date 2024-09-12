import axios from "axios";
import { addUser } from "../store/userSlice";

export const getUserProfile = async (dispatch, username) => {
    try {
        const response = await axios.get(`/api/v1/users/c/${username}`, {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addUser(res.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
