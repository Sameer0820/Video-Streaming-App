import React from "react";
import { Link } from "react-router-dom";

function Logo({ className = "" }) {
    return (
        <Link to="/">
            <div
                className={`font-bold text-xl flex items-center justify-center w-full ${className} text-[#FFFFFF]`}
            >
                <img
                    src="../assets/logo.png"
                    alt="logo"
                    className="w-10 h-10 inline-block mr-2"
                />
                <div>Streamify</div>
            </div>
        </Link>
    );
}

export default Logo;
