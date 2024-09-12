import axios from "axios";
import { addCurrentUser } from "../store/userSlice";

export const getCurrentUser = async (dispatch) => {
    try {
        const response = await axios.get("/api/v1/users/current-user", {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addCurrentUser(res.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
