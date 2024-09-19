import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import getTimeDistanceToNow from "../utils/getTimeDistance";
import Input from "./Input";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import LoginPopup from "./Auth/LoginPopup";
import { toast } from "react-toastify";
import { icons } from "../assets/Icons.jsx";

function Comments({ video }) {
    const { status, userData } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const { videoId } = useParams();
    const [comments, setComments] = useState([]);
    const [commentsUpdated, setCommentsUpdated] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [update, setUpdate] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue,
    } = useForm();
    const LoginPopupDialog = useRef();
    const LoginLikePopupDialog = useRef();
    const menuRefs = useRef([]);
    const location = useLocation();

    const getVideoComments = async () => {
        try {
            const response = await axios.get(`/api/v1/comments/${videoId}`, {
                withCredentials: true,
            });
            if (response?.data?.data) {
                setComments(response.data.data);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error fetching comments", error);
        }
    };

    const handleCommentSubmit = async (data) => {
        if (!status) {
            LoginPopupDialog.current.open();
        } else {
            try {
                await axios.post(
                    `/api/v1/comments/${videoId}`,
                    { content: data.content },
                    { withCredentials: true }
                );
                reset();
                setCommentsUpdated((prev) => !prev);
            } catch (error) {
                toast.error("Couldn't add comment. Try again!");
                console.log("Error while adding comment", error);
            }
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await axios.delete(`/api/v1/comments/c/${commentId}`, {
                withCredentials: true,
            });
            setCommentsUpdated((prev) => !prev);
        } catch (error) {
            toast.error("Couldn't delete comment. Try again!");
            console.log("Error while deleting comment", error);
        }
    };

    const handleCommentUpdate = async (data, commentId) => {
        try {
            await axios.patch(
                `/api/v1/comments/c/${commentId}`,
                { content: data.newContent },
                { withCredentials: true }
            );
            setUpdate(null);
            setCommentsUpdated((prev) => !prev);
        } catch (error) {
            toast.error("Couldn't update comment. Try again!");
            console.log("Error while updating comment", error);
        }
    };

    useEffect(() => {
        getVideoComments();
    }, [videoId, commentsUpdated]);

    const toggleCommentLike = async (commentId) => {
        if (!status) {
            LoginLikePopupDialog.current.open();
        } else {
            try {
                const response = await axios.post(
                    `/api/v1/likes/toggle/c/${commentId}`
                );
                if (response.data.success) {
                    setComments((prevComments) =>
                        prevComments.map((comment) =>
                            comment._id === commentId
                                ? {
                                      ...comment,
                                      isLiked: !comment.isLiked,
                                      likesCount: comment.isLiked
                                          ? comment.likesCount - 1
                                          : comment.likesCount + 1,
                                  }
                                : comment
                        )
                    );
                }
            } catch (error) {
                toast.error("Error while toggling like button");
                console.log(error);
            }
        }
    };

    const toggleMenu = (commentId) => {
        setActiveCommentId(activeCommentId === commentId ? null : commentId);
    };

    const handleUpdate = (comment) => {
        setUpdate(comment._id);
        setValue("newContent", comment.content);
        setActiveCommentId(null);
    };

    const cancelEditing = () => {
        setUpdate(null);
    };

    const handleDelete = (commentId) => {
        handleCommentDelete(commentId);
        setActiveCommentId(null);
    };

    const handleClickOutside = (event) => {
        if (
            menuRefs.current.some((ref) => ref && !ref.contains(event.target))
        ) {
            setActiveCommentId(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {loading && (
                <span className="flex justify-center mt-20">
                    {icons.bigLoading}
                </span>
            )}
            <div className="border rounded-xl mt-4 ml-1">
                <div className="px-4 mt-2 rounded-xl">
                    <p className="mt-1 text-lg">
                        {Array.isArray(comments) && comments.length
                            ? `${comments.length} Comments`
                            : "No Comments"}
                    </p>
                    <form
                        className="mt-3 mb-4 flex items-center"
                        onSubmit={handleSubmit(handleCommentSubmit)}
                    >
                        <div className="">
                            <img
                                className="w-9 h-9 rounded-full mr-5 object-cover"
                                src={userData?.avatar || video?.owner?.avatar}
                                alt="user"
                            />
                        </div>
                        <Input
                            {...register("content", { required: true })}
                            className="mr-3 px-4 rounded-lg"
                            placeholder="Add a comment"
                        />
                        <LoginPopup
                            ref={LoginPopupDialog}
                            message="Login to Comment..."
                            route={location.pathname}
                        />
                        <Button
                            type="submit"
                            className="ml-4 font-semibold border rounded-lg border-gray-300 flex items-center hover:bg-zinc-800"
                            bgColor=""
                        >
                            Comment
                        </Button>
                    </form>
                </div>
                <div className="w-full">
                    {Array.isArray(comments) &&
                        comments?.length > 0 &&
                        comments?.map((comment, index) => (
                            <div
                                key={comment._id}
                                className="hover:bg-zinc-900 rounded-xl py-3 px-4"
                            >
                                <div className="flex">
                                    <img
                                        className="w-9 h-9 rounded-full object-cover"
                                        src={`${comment?.owner?.avatar}`}
                                        alt=""
                                    />
                                    <div className="px-3 justify-start flex-grow">
                                        <div className="flex text-gray-300 text-sm">
                                            <p>@{comment?.owner?.username}</p>
                                            <p className="ml-2">
                                                ·{" "}
                                                {getTimeDistanceToNow(
                                                    comment?.createdAt
                                                )}
                                            </p>
                                        </div>
                                        {update === comment._id ? (
                                            <form
                                                className="mt-1 flex items-center"
                                                onSubmit={handleSubmit2(
                                                    (data) =>
                                                        handleCommentUpdate(
                                                            data,
                                                            comment._id
                                                        )
                                                )}
                                            >
                                                <input
                                                    {...register2(
                                                        "newContent",
                                                        {
                                                            required: true,
                                                        }
                                                    )}
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
                                            <div className="mt-1">
                                                {comment?.content}
                                            </div>
                                        )}

                                        <LoginPopup
                                            ref={LoginLikePopupDialog}
                                            message="Login to Like Comment..."
                                            route={location.pathname}
                                        />
                                        <button
                                            onClick={() =>
                                                toggleCommentLike(comment._id)
                                            }
                                            className={`mt-1 flex items-center text-sm`}
                                        >
                                            {comment.isLiked ? (
                                                <BiSolidLike className="w-4 h-4" />
                                            ) : (
                                                <BiLike className="w-4 h-4" />
                                            )}
                                            <p className="ml-1">
                                                {comment?.likesCount}
                                            </p>
                                        </button>
                                    </div>
                                    {comment?.owner?._id === userData?._id && (
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    toggleMenu(comment._id)
                                                }
                                                className="p-2 hover:bg-slate-800 hover:rounded-full"
                                            >
                                                <BsThreeDotsVertical />
                                            </button>
                                            {activeCommentId ===
                                                comment._id && (
                                                <div
                                                    ref={(el) =>
                                                        (menuRefs.current[
                                                            index
                                                        ] = el)
                                                    }
                                                    className="absolute left-0 w-24 bg-black rounded-lg shadow-lg text-sm"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handleUpdate(
                                                                comment
                                                            )
                                                        }
                                                        className="block w-full text-left px-4 py-2 hover:bg-slate-900 hover:rounded-lg"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                comment._id
                                                            )
                                                        }
                                                        className="block w-full text-left px-4 py-2 hover:bg-slate-900 hover:rounded-lg"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default Comments;
