import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { AiOutlineMessage } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { GoDeviceCameraVideo } from "react-icons/go";
import { BsCollectionPlay } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GoQuestion } from "react-icons/go";

function Sidebar() {
    const authStatus = useSelector((state) => state.auth.status);

    const NavElements = [
        {
            name: "Home",
            route: "/",
            icon: <GoHome className="w-5 h-5"/>,
        },
        {
            name: "Liked videos",
            route: "/liked-videos",
            icon: <BiLike className="w-5 h-5"/>,
        },
        {
            name: "Tweets",
            route: "/tweets",
            icon: <AiOutlineMessage className="w-5 h-5"/>,
        },
        {
            name: "History",
            route: "/history",
            icon: <GoHistory className="w-5 h-5"/>,
        },
        {
            name: "Collection",
            route: "/collection",
            icon: <BsCollectionPlay className="w-5 h-5"/>,
        },
        {
            name: "My Content",
            route: "/my-content",
            icon: <GoDeviceCameraVideo className="w-5 h-5"/>,
        },
    ];

    return (
        <div className="bg-black text-white h-full flex flex-col border border-y-0 border-l-0">
            <ul className="flex-grow px-2 py-2">
                {NavElements.map((item, index) => (
                    <NavLink
                        className={({ isActive }) =>
                            `${isActive ? "text-pink-700" : "text-gray-200"}`
                        }
                        to={item.route}
                        key={index}
                    >
                        <li className="py-2 px-5 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg">
                            {item.icon && (
                                <span className="mr-2">{item.icon}</span>
                            )}
                            {item.name}
                        </li>
                    </NavLink>
                ))}
            </ul>
            <ul className="px-2 py-2">
                <NavLink
                    className={({ isActive }) =>
                        `${isActive ? "text-pink-700" : "text-gray-200"}`
                    }
                    to="/support"
                >
                    <li className="py-2 px-5 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg">
                        <span className="mr-2">
                            <GoQuestion className="w-5 h-5"/>
                        </span>
                        Support
                    </li>
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `${isActive ? "text-pink-700" : "text-gray-200"}`
                    }
                    to="/setting"
                >
                    <li className="py-2 px-5 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg">
                        <span className="mr-2">
                            <FiSettings className="w-5 h-5"/>
                        </span>
                        Settings
                    </li>
                </NavLink>
            </ul>
        </div>
    );
}

export default Sidebar;
