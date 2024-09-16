import React from "react";
import { GoHistory } from "react-icons/go";
import GuestComponent from "./GuestComponent";

function GuestHistory() {
    return (
        <GuestComponent
            title="Keep track of what you watch"
            subtitle="Sign in to see your watch history."
            icon={
                <span className="w-full h-full flex items-center p-4 pb-5">
                    <GoHistory className="w-32 h-32"/>
                </span>
            }
            route="/history"
        />
    );
}

export default GuestHistory;
