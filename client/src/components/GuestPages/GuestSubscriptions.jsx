import React from 'react'
import GuestComponent from "./GuestComponent";
import { FaRegPlayCircle } from "react-icons/fa";

function GuestSubscriptions() {
    return (
        <GuestComponent
            title="Watch videos you like"
            subtitle="Login and get the videos of channel you subscribe at one place."
            icon={
                <span className="w-full h-full flex items-center p-4 pb-5">
                    <FaRegPlayCircle className="w-32 h-32"/>
                </span>
            }
            route="/subscriptions"
        />
    );
}

export default GuestSubscriptions