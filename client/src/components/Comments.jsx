import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axios.helper.js";
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
import InfiniteScroll from "react-infinite-scroll-component";

function Comments({ video }) {
    const { status, userData } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
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
            const response = await axiosInstance.get(
                `/comments/${videoId}?page=${page}&limit=10`
            );
            if (response?.data?.data.length === 10) {
                setComments((prev) => [...prev, ...response.data.data]);
            } else {
                setComments((prev) => [...prev, ...response.data.data]);
                setHasMore(false);
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
                await axiosInstance.post(`/comments/${videoId}`, {
                    content: data.content,
                });
                reset();
                setCommentsUpdated((prev) => !prev);
                setPage(1);
            } catch (error) {
                toast.error("Couldn't add comment. Try again!");
                console.log("Error while adding comment", error);
            }
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await axiosInstance.delete(`/comments/c/${commentId}`);
            setCommentsUpdated((prev) => !prev);
            setPage(1);
        } catch (error) {
            toast.error("Couldn't delete comment. Try again!");
            console.log("Error while deleting comment", error);
        }
    };

    const handleCommentUpdate = async (data, commentId) => {
        try {
            await axiosInstance.patch(`/comments/c/${commentId}`, {
                content: data.newContent,
            });
            setUpdate(null);
            setCommentsUpdated((prev) => !prev);
            setPage(1);
        } catch (error) {
            toast.error("Couldn't update comment. Try again!");
            console.log("Error while updating comment", error);
        }
    };

    useEffect(() => {
        if (page === 1) {
            setComments([]);
        }
        getVideoComments().then(() => setLoading(false));
    }, [videoId, commentsUpdated, page]);

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const toggleCommentLike = async (commentId) => {
        if (!status) {
            LoginLikePopupDialog.current.open();
        } else {
            try {
                const response = await axiosInstance.post(
                    `/likes/toggle/c/${commentId}`
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

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    return (
        <>
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
                    {Array.isArray(comments) && comments?.length > 0 && (
                        <InfiniteScroll
                            dataLength={comments.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={
                                <div className="flex justify-center h-7 mt-1">
                                    {icons.loading}
                                </div>
                            }
                            scrollableTarget="scrollableDiv"
                        >
                            {comments?.map((comment, index) => (
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
                                                <p>
                                                    @{comment?.owner?.username}
                                                </p>
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
                                                <div className="mt-1 break-words break-all">
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
                                                    toggleCommentLike(
                                                        comment._id
                                                    )
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
                                        {comment?.owner?._id ===
                                            userData?._id && (
                                            <div
                                                ref={(el) =>
                                                    (menuRefs.current[index] =
                                                        el)
                                                }
                                                className="relative"
                                            >
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
                                                    <div className="absolute right-0 w-24 bg-black rounded-lg shadow-lg text-sm">
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
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </>
    );
}

export default Comments;
