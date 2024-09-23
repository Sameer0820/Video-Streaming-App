import axiosInstance from "../utils/axios.helper";
import { toast } from "react-toastify";

export const healthCheck = async () => {
    try {
        const response = await axiosInstance.get("/healthcheck");
        return response.data.data;
    } catch (error) {
        toast.error("Oops! Server is not working");
        console.log(error);
    }
};
