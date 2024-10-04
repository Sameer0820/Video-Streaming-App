import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { AiOutlineMessage } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { GoDeviceCameraVideo } from "react-icons/go";
import { BsCollectionPlay } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GoQuestion } from "react-icons/go";
import { GrLogout } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import axiosInstance from "../utils/axios.helper";
import { unSetUser } from "../store/authSlice";
import { toast } from "react-toastify";

function Sidebar() {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const location = useLocation();
    const isWatchPage = location.pathname.includes("/watchpage");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const NavElements = [
        {
            name: "Home",
            route: "/",
            icon: <GoHome className="w-6 h-6" />,
        },
        {
            name: "Tweets",
            route: "/tweets",
            icon: <AiOutlineMessage className="w-6 h-6" />,
        },
        {
            name: "Liked videos",
            route: "/liked-videos",
            icon: <BiLike className="w-6 h-6" />,
        },
        {
            name: "History",
            route: "/history",
            icon: <GoHistory className="w-6 h-6" />,
        },
        {
            name: "Subscriptions",
            route: "/subscriptions",
            icon: <BsCollectionPlay className="w-6 h-6" />,
        },
        {
            name: "My Channel",
            route: `/channel/${userData?.username}`,
            icon: <GoDeviceCameraVideo className="w-6 h-6" />,
        },
    ];

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout", {});
            dispatch(unSetUser());
            localStorage.removeItem("accessToken");
            toast.success("Logged out successfully...");
            navigate("/");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <div
            className={`bg-black text-white h-full flex flex-col border border-y-0 border-l-0 transition-all duration-100 ease-in-out  ${
                isWatchPage ? "w-16" : "w-64"
            }`}
        >
            <ul className="flex-grow px-2 py-2">
                {NavElements.map((item, index) => (
                    <NavLink
                        className={({ isActive }) =>
                            `${isActive ? "text-pink-700" : "text-gray-200"}`
                        }
                        to={item.route}
                        key={index}
                    >
                        <li
                            className={`py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                                isWatchPage ? "justify-center " : " px-5"
                            }`}
                        >
                            {item.icon && (
                                <span
                                    className={`${isWatchPage ? "" : "mr-2"}`}
                                >
                                    {item.icon}
                                </span>
                            )}
                            {!isWatchPage && <div>{item.name}</div>}
                        </li>
                    </NavLink>
                ))}
                {authStatus && (
                    <NavLink
                        className={({ isActive }) =>
                            `${isActive ? "text-pink-700" : "text-gray-200"}`
                        }
                        to="/admin/dashboard"
                    >
                        <li
                            className={`py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                                isWatchPage ? "justify-center " : " px-5"
                            }`}
                        >
                            <span className={`${isWatchPage ? "" : "mr-2"}`}>
                                <FaRegUserCircle className="w-6 h-6" />
                            </span>
                            {!isWatchPage && "Dashboard"}
                        </li>
                    </NavLink>
                )}
            </ul>
            <ul className="px-2 py-2">
                {authStatus && (
                    <li
                        onClick={handleLogout}
                        className={`py-2 ml-1 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                            isWatchPage ? "justify-center " : " px-5"
                        }`}
                    >
                        <span className={`${isWatchPage ? "ml-1" : "mr-2"}`}>
                            <GrLogout className="w-6 h-6" />
                        </span>
                        {!isWatchPage && "Logout"}
                    </li>
                )}
                {authStatus && (
                    <NavLink
                        className={({ isActive }) =>
                            `${isActive ? "text-pink-700" : "text-gray-200"}`
                        }
                        to="/settings"
                    >
                        <li
                            className={`py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                                isWatchPage ? "justify-center " : " px-5"
                            }`}
                        >
                            <span className={`${isWatchPage ? "" : "mr-2"}`}>
                                <FiSettings className="w-6 h-6" />
                            </span>
                            {!isWatchPage && "Settings"}
                        </li>
                    </NavLink>
                )}
                <NavLink
                    className={({ isActive }) =>
                        `${isActive ? "text-pink-700" : "text-gray-200"}`
                    }
                    to="/support"
                >
                    <li
                        className={`py-2 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                            isWatchPage ? "justify-center " : " px-5"
                        }`}
                    >
                        <span className={`${isWatchPage ? "" : "mr-2"}`}>
                            <GoQuestion className="w-6 h-6" />
                        </span>
                        {!isWatchPage && "Support"}
                    </li>
                </NavLink>
            </ul>
        </div>
    );
}

export default Sidebar;
