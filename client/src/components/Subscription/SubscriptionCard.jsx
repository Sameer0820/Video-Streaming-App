import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import formatSubscription from "../../utils/fromatSubscription";
import LoginPopup from "../Auth/LoginPopup";
import { toast } from "react-toastify";
import Button from "../Button";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import axiosInstance from "../../utils/axios.helper";
import { toggleUserSubscribe } from "../../store/userSlice";

function SubscriptionCard({ profile }) {
    const LoginPopupDialog = useRef();
    const location = useLocation();
    const dispatch = useDispatch();

    const { status } = useSelector((state) => state.auth);

    const toggleSubscribe = async () => {
        if (!status) {
            LoginPopupDialog.current.open();
        } else {
            try {
                await axiosInstance
                    .post(`/subscriptions/c/${profile._id}`)
                    .then(() => {
                        dispatch(
                            toggleUserSubscribe({
                                profileId: profile._id,
                                isSubscribed: !profile?.isSubscribed,
                                subscribersCount: profile?.isSubscribed
                                    ? profile.subscribersCount - 1
                                    : profile.subscribersCount + 1,
                            })
                        );
                    });
            } catch (error) {
                if (error.status === 403) {
                    toast.error("Cannot subscribe to your own channel");
                } else {
                    toast.error("Error while toggling subscribe button");
                    console.log(error);
                }
            }
        }
    };
    return (
        <>
            <LoginPopup
                ref={LoginPopupDialog}
                message="Login to Subscribe..."
                route={location.pathname}
            />
            <li key={profile._id} className="flex w-full justify-between">
                <div className="flex items-center gap-x-3">
                    <div className="h-14 w-14 shrink-0">
                        <Link to={`/channel/${profile.username}`}>
                            <img
                                src={profile.avatar}
                                alt="user"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </Link>
                    </div>
                    <div className="block">
                        <h6 className="font-semibold">{profile.fullName}</h6>
                        <p className="text-sm text-gray-300">
                            {formatSubscription(profile.subscribersCount)}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={toggleSubscribe}
                    className={`flex h-9 items-center px-2 rounded-lg ${
                        profile?.isSubscribed ? "hover:bg-pink-700" : "hover:bg-gray-300"
                    }`}
                    textColor="text-black"
                    bgColor={profile?.isSubscribed ? "bg-pink-600" : "bg-gray-100"}
                >
                    {profile?.isSubscribed ? (
                        <>
                            <p className="mr-2 font-semibold">Subscribed</p>
                            <FaCheckCircle />
                        </>
                    ) : (
                        <>
                            <p className="mr-2 font-semibold">Subscribe</p>
                            <FaBell />
                        </>
                    )}
                </Button>
            </li>
        </>
    );
}

export default SubscriptionCard;
