import React from "react";
import { useSelector } from "react-redux";
import { LuUsers } from "react-icons/lu";

function ChannelEmptySubscribed() {
    const { status, userData } = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user.user);

    if (status && user.username === userData.username) {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-6">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-pink-500 p-2">
                            <LuUsers className="w-6 h-6" />
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">
                        No channel subscribed
                    </h5>
                    <p>
                        Your channel has yet to <strong>Subscribe</strong> a new
                        channel.
                    </p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-6">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-pink-500 p-2">
                            <LuUsers className="w-6 h-6" />
                        </span>
                    </p>
                    <h5 className="mb-2 font-semibold">
                        No channel subscribed
                    </h5>
                    <p>
                        This channel has yet to <strong>Subscribe</strong> a new
                        channel.
                    </p>
                </div>
            </div>
        );
    }
}

export default ChannelEmptySubscribed;
