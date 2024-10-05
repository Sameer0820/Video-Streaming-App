import axiosInstance from "../utils/axios.helper";
import { setStats } from "../store/dashboardSlice";
import { toast } from "react-toastify";

export const getChannelStats = async (dispatch, userId) => {
    try {
        const response = await axiosInstance.get(
            `/dashboard/stats/${userId}`
        );
        if (response?.data?.success) {
            dispatch(setStats(response.data.data));
        }
    } catch (error) {
        toast.error("Error getting channel stats");
        console.log(error);
    }
};
