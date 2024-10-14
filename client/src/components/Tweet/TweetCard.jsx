import React, { useRef, useState, useEffect } from "react";
import getTimeDistanceToNow from "../../utils/getTimeDistance";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Button from "../Button";
import LoginPopup from "../Auth/LoginPopup";
import { getUserTweets } from "../../hooks/getUserTweets";
import { removeUserTweets } from "../../store/userSlice";
import { useForm } from "react-hook-form";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    deleteTweet,
    updateTweet,
    toggleLike,
} from "../../store/tweetsSlice";

function Tweet({ tweet, page = false }) {
    const { status, userData } = useSelector((state) => state.auth);
    const [update, setUpdate] = useState(false);
    const [menu, setMenu] = useState(false);
    const dispatch = useDispatch();

    const LoginLikePopupDialog = useRef();
    const ref = useRef(null);
    const location = useLocation();

    const { register, handleSubmit, setValue } = useForm();

    const handleTweetDelete = async () => {
        try {
            await axiosInstance.delete(`/tweets/${tweet._id}`).then(() => {
                if (page) {
                    dispatch(deleteTweet(tweet._id));
                } else {
                    dispatch(removeUserTweets());
                    getUserTweets(dispatch, userData._id);
                }
            });
        } catch (error) {
            toast.error("Couldn't delete tweet. Try again!");
            console.log("Error while deleting tweet", error);
        }
    };

    const handleTweetUpdate = async (data) => {
        try {
            await axiosInstance
                .patch(`/tweets/${tweet._id}`, {
                    content: data.newContent,
                })
                .then((res) => {
                    if (page) {
                        dispatch(updateTweet(res.data.data));
                    } else {
                        dispatch(removeUserTweets());
                        getUserTweets(dispatch, userData._id);
                    }
                });
            setUpdate(false);
        } catch (error) {
            toast.error("Couldn't update tweet. Try again!");
            console.log("Error while updating tweet", error);
        }
    };

    const toggleTweetLike = async () => {
        if (!status) {
            LoginLikePopupDialog.current.open();
        } else {
            try {
                await axiosInstance
                    .post(`/likes/toggle/t/${tweet._id}`)
                    .then(() => {
                        if (page) {
                            dispatch(
                                toggleLike({
                                    tweetId: tweet._id,
                                    isLiked: !tweet?.isLiked,
                                    likesCount: tweet?.isLiked
                                        ? tweet.likesCount - 1
                                        : tweet.likesCount + 1,
                                })
                            );
                        } else {
                            getUserTweets(dispatch, userData._id);
                        }
                    });
            } catch (error) {
                toast.error("Error while toggling like button");
                console.log(error);
            }
        }
    };

    const handleUpdate = () => {
        setUpdate(true);
        setValue("newContent", tweet.content);
        setMenu(false);
    };

    const cancelEditing = () => {
        setUpdate(false);
    };

    const handleDelete = () => {
        handleTweetDelete();
        setMenu(false);
    };

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <li className="flex relative border-b border-gray-700 py-4 last:border-b-transparent">
            <div className="h-14 w-14 shrink-0">
                <Link
                    to={`${
                        userData?._id === tweet?.owner?._id
                            ? ""
                            : "/channel/" + tweet.owner.username
                    }`}
                >
                    <img
                        src={tweet.owner.avatar}
                        alt="user"
                        className="h-full w-full rounded-full object-cover"
                    />
                </Link>
            </div>
            <div className="px-3 justify-start flex-grow">
                <div className="flex">
                    <p className="font-semibold">{tweet?.owner?.fullName}</p>
                    <p className="ml-2 text-gray-300">
                        · {getTimeDistanceToNow(tweet?.createdAt)}
                    </p>
                </div>
                {update ? (
                    <form
                        className="mt-1 flex items-center"
                        onSubmit={handleSubmit(handleTweetUpdate)}
                    >
                        <input
                            {...register("newContent", {
                                required: true,
                            })}
                            className="mr-2 border-b-[1px] py-1 bg-black/0 text-white outline-none duration-200 focus:border-blue-800 w-full"
                        />
                        <Button
                            type="submit"
                            className="ml-4 font-semibold text-sm border rounded-lg border-gray-300 flex items-center hover:bg-pink-700"
                            bgColor="bg-pink-600"
                        >
                            Update
                        </Button>
                        <Button
                            onClick={cancelEditing}
                            className="ml-4 font-semibold text-sm border rounded-lg border-gray-300 flex items-center hover:bg-zinc-800"
                            bgColor=""
                        >
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <div className="mt-1 break-words break-all">{tweet?.content}</div>
                )}
                <LoginPopup
                    ref={LoginLikePopupDialog}
                    message="Login to like this Tweet..."
                    route={location.pathname}
                />
                <button
                    onClick={() => toggleTweetLike()}
                    className={`mt-1 flex items-center text-sm`}
                >
                    {tweet?.isLiked ? (
                        <BiSolidLike className="w-5 h-5" />
                    ) : (
                        <BiLike className="w-5 h-5" />
                    )}
                    <p className="ml-1">{tweet?.likesCount}</p>
                </button>
            </div>
            {tweet?.owner?._id === userData?._id && (
                <div ref={ref} className="relative">
                    <button
                        onClick={() => setMenu((prev) => !prev)}
                        className="p-2 hover:bg-slate-800 hover:rounded-full"
                    >
                        <BsThreeDotsVertical />
                    </button>
                    {menu && (
                        <div
                            className="absolute right-0 w-24 bg-black rounded-lg shadow-lg text-sm"
                        >
                            <button
                                onClick={() => handleUpdate()}
                                className="block w-full text-left px-4 py-2 hover:bg-slate-900 hover:rounded-lg"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete()}
                                className="block w-full text-left px-4 py-2 hover:bg-slate-900 hover:rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
}

export default Tweet;
