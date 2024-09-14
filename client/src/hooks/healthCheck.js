import axios from "axios";
import { toast } from "react-toastify";

export const healthCheck = async () => {
    try {
        const response = await axios.get("/api/v1/healthcheck");
        return response.data.data;
    } catch (error) {
        toast.error("Oops! Server is not working");
        console.log(error);
    }
};
