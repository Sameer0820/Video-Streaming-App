import axios from "axios";
import { setUser } from "../store/authSlice";

export const getCurrentUser = async (dispatch) => {
    try {
        const response = await axios.get("/api/v1/users/current-user", {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(setUser(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
