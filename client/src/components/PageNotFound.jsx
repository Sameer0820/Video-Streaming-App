import React from "react";
import not_found from "../assets/Not_Found.png";
import Button from "./Button";
import { Link } from "react-router-dom";

function PageNotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center overflow-y-auto bg-black/95">
            <span className="rounded-xl overflow-hidden">
                <img
                    src={not_found}
                    alt="404 Not Found"
                    className="w-96 h-96"
                />
            </span>
            <h1 className="text-xl mt-5 p-2">
                <Button className="rounded-md hover:cursor-pointer hover:bg-pink-500" bgColor="bg-pink-600">
                    <Link to={"/"}>Home</Link>
                </Button>
            </h1>
        </div>
    );
}

export default PageNotFound;
