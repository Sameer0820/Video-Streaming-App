import axios from "axios";
import { addUserPlaylist } from "../store/userSlice";

export const userPlaylist = async (dispatch, userId) => {
    try {
        const response = await axios.get(`/api/v1/playlist/user/${userId}`, {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addUserPlaylist(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
