import React, { useEffect, useState } from "react";
import ChannelEmptySubscribed from "./ChannelEmptySubscribed";
import { useDispatch, useSelector } from "react-redux";
import { getUserSubscribed } from "../../hooks/getUserSubscribed";
import { icons } from "../../assets/Icons.jsx";
import { GoSearch } from "react-icons/go";
import SubscriptionCard from "../Subscription/SubscriptionCard.jsx";

function ChannelSubscribed() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserSubscribed(dispatch, user._id).then(() => {
            setLoading(false);
        });
    }, [user]);

    const data = useSelector((state) => state.user.userSubscribed);

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    let subscribed = filter || data?.channels;

    function handleUserInput(input) {
        if (!input || input === "") setFilter(data?.channels);
        else {
            const filteredData = data?.channels.filter((subs) =>
                subs.fullName.toLowerCase().includes(input.toLowerCase())
            );
            setFilter(filteredData);
        }
    }

    return data?.channelsCount > 0 ? (
        <ul className="flex w-full flex-col gap-y-4 py-4">
            <div className="relative mb-2 rounded-full bg-zinc-800 border py-2 pl-8 pr-3 ">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <GoSearch />
                </span>
                <input
                    onChange={(e) => handleUserInput(e.target.value.trim())}
                    className="w-full bg-transparent outline-none"
                    placeholder="Search"
                />
            </div>
            {subscribed?.map((profile) => (
                <SubscriptionCard key={profile._id} profile={profile} />
            ))}
        </ul>
    ) : (
        <ChannelEmptySubscribed />
    );
}

export default ChannelSubscribed;
