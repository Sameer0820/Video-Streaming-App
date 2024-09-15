import axios from "axios";
import { addUserLikedVideos } from "../store/userSlice";

export const getUserLikedVideos = async (dispatch) => {
    try {
        const response = await axios.get(`/api/v1/likes/videos`, {
            withCredentials: true,
        });
        if (response?.data?.data) {
            dispatch(addUserLikedVideos(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
