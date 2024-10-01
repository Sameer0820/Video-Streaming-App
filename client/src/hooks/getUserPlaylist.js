import axiosInstance from "../utils/axios.helper";
import { addUserPlaylist } from "../store/userSlice";

export const getUserPlaylist = async (dispatch, userId) => {
    try {
        const response = await axiosInstance.get(`/playlist/user/${userId}`);
        if (response?.data?.data) {
            dispatch(addUserPlaylist(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
