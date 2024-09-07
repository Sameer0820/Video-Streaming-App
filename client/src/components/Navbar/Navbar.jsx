import React from "react";
import Logo from "../Logo";
import Button from "../Button";
import { useSelector } from "react-redux";
import Search from "./Search";

function Navbar() {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    return (
        <nav className="flex justify-between items-center bg-black p-4">
            <Logo />
            <Search />
            {!authStatus && (
                <div>
                    <Button className="curson-pointer hover:bg-gray-500 mr-1 py-2 rounded transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] sm:w-auto">
                        Log in
                    </Button>
                    <Button className="curson-pointer hover:bg-blue-600 mr-1 rounded bg-blue-800 px-3 py-2 text-center transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] sm:w-auto">
                        Sign up
                    </Button>
                </div>
            )}

            {authStatus && userData && (
                <img
                    src={userData.avatar}
                    alt={userData.username}
                    className="object-cover h-16 w-16 shrink-0 rounded-full sm:h-12 sm:w-12"
                ></img>
            )}
        </nav>
    );
}

export default Navbar;
