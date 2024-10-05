import axiosInstance from "../utils/axios.helper";
import { toast } from "react-toastify";
import { setVideos } from "../store/dashboardSlice";

export const getChannelVideos = async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/dashboard/videos`);
        if (response?.data?.success) {
            dispatch(setVideos(response.data.data));
        }
    } catch (error) {
        toast.error("Error getting channel videos");
        console.log(error);
    }
};
