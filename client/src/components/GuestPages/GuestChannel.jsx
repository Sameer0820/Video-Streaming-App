import React from "react";
import GuestComponent from "./GuestComponent";
import { GoDeviceCameraVideo } from "react-icons/go";

function GuestChannel() {
    return (
        <GuestComponent
            title="Create your own channel"
            subtitle="Sign in to get started."
            icon={
                <span className="w-full h-full flex items-center p-4 pb-2">
                    <GoDeviceCameraVideo className="w-32 h-32" />
                </span>
            }
            route="/"
        />
    );
}

export default GuestChannel;
