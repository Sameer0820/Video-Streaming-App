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
                <>
                    <Button className="curson-pointer">Login</Button>
                    <Button className="curson-pointer">Sign up</Button>
                </>
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
