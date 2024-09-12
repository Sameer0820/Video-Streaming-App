import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import getTimeDistanceToNow from "../utils/getTimeDistance";
import Input from "./Input";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { BiLike } from "react-icons/bi";

function Comments({ video }) {
    const status = useSelector((state) => state.auth.status);
    const { videoId } = useParams();
    const [comments, setComments] = useState([]);
    const { register, handleSubmit } = useForm();

    const getVideoComments = async () => {
        try {
            const response = await axios.get(`/api/v1/comments/${videoId}`, {
                withCredentials: true,
            });
            if (response?.data?.data) {
                setComments(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching comments", error);
        }
    };

    const handleCommentSubmit = async (data) => {
        try {
            const response = await axios.post(
                `/api/v1/comments/${videoId}`,
                { content: JSON.stringify(data.content) },
                { withCredentials: true }
            );
        } catch (error) {
            console.log("Error while adding comment", error);
        }
    };

    useEffect(() => {
        getVideoComments();
    }, [videoId, handleCommentSubmit]);

    return (
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
                            src={video?.owner?.avatar}
                            alt="user"
                        />
                    </div>
                    <Input
                        {...register("content", { required: true })}
                        className="mr-3 px-4 rounded-lg"
                        placeholder="Add a comment"
                    />
                    <Button
                        type="submit"
                        disabled={status ? false : true}
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
                    comments?.map((comment) => (
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
                                <div className="px-3 justify-start">
                                    <div className="flex text-gray-300 text-sm">
                                        <p>@{comment?.owner?.username}</p>
                                        <p className="ml-2">
                                            ·{" "}
                                            {getTimeDistanceToNow(
                                                comment?.createdAt
                                            )}
                                        </p>
                                    </div>
                                    <div className="mt-1">
                                        {comment?.content}
                                    </div>
                                    <div className="mt-1 flex items-center text-sm">
                                        <BiLike className="w-5 h-5" />
                                        <p className="ml-1">
                                            {video?.likesCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Comments;
