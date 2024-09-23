import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "/api/v1",
    withCredentials: true,
});

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.response.data.message === "TokenExpiredError" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(
                    "/api/v1/users/refresh-token",
                    {},
                    { withCredentials: true }
                );
                localStorage.setItem("accessToken", data.data.accessToken);
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Failed to refresh token", err);
                const navigate = useNavigate();
                navigate("/login");
                toast.error("Session expired. Please login again!");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
