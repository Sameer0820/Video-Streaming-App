import React, { useEffect, useState } from "react";
import ChannelEmptyTweet from "./ChannelEmptyTweet";
import { useDispatch, useSelector } from "react-redux";
import { getUserTweets } from "../../hooks/getUserTweets";
import { icons } from "../../assets/Icons.jsx";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Button from "../Button.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import Tweet from "../Tweet/TweetCard.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { removeUserTweets } from "../../store/userSlice.js";

function ChannelTweets() {
    const dispatch = useDispatch();
    const { username } = useParams();
    const { status, userData } = useSelector((state) => state.auth);
    const userId = useSelector((state) => state.user.user._id);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [tweetsUpdated, setTweetsUpdated] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (page === 1) {
            dispatch(removeUserTweets());
        }
        getUserTweets(dispatch, userId, page).then((res) => {
            setLoading(false);
            if (res.data.length !== 30) {
                setHasMore(false);
            }
        });
    }, [username, tweetsUpdated, page]);

    const tweets = useSelector((state) => state.user.userTweets);

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const addTweet = async (data) => {
        try {
            await axiosInstance.post("/tweets", data);
            reset();
            setTweetsUpdated((prev) => !prev);
            setPage(1);
            setLoading(true);
        } catch (error) {
            toast.error("Couldn't add your tweet. Try again!");
            console.log("Error while adding tweet", error);
        }
    };

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    if (status && userData.username === username) {
        return (
            <>
                <form
                    onSubmit={handleSubmit(addTweet)}
                    className="mt-2 border pb-2 rounded-lg"
                >
                    <textarea
                        className="mb-2 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
                        placeholder="Write a tweet"
                        rows={"2"}
                        required
                        {...register("content", {
                            required: true,
                            validate: {
                                tweetContent: (value) =>
                                    value.trim().length > 0 ||
                                    "Content is required",
                                tweetLength: (value) =>
                                    (value.trim().length > 9 &&
                                        value.trim().length < 501) ||
                                    "Minimum 10 and maximum 500 characters allowed",
                            },
                        })}
                    />
                    <div className="flex items-center justify-between gap-x-3 px-3">
                        <div className="flex-grow">
                            {errors.content && (
                                <p className="text-red-600 mt-0.5 text-sm">
                                    {errors.content.message}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-x-3">
                            <Button
                                className="rounded-lg hover:bg-slate-800"
                                bgColor=""
                                onClick={() => reset()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="font-semibold hover:bg-pink-700 rounded-lg"
                                bgColor="bg-pink-600"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </form>
                {tweets?.length > 0 ? (
                    <InfiniteScroll
                        dataLength={tweets.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center h-7 mt-1">
                                {icons.loading}
                            </div>
                        }
                        scrollableTarget="scrollableDiv"
                    >
                        <ul className="py-4">
                            {tweets.map((tweet) => (
                                <Tweet key={tweet._id} tweet={tweet} />
                            ))}
                        </ul>
                    </InfiniteScroll>
                ) : (
                    <ChannelEmptyTweet />
                )}
            </>
        );
    } else {
        return (
            <>
                {tweets?.length > 0 ? (
                    <InfiniteScroll
                        dataLength={tweets.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center h-7 mt-1">
                                {icons.loading}
                            </div>
                        }
                        scrollableTarget="scrollableDiv"
                    >
                        <ul className="py-4">
                            {tweets.map((tweet) => (
                                <Tweet key={tweet._id} tweet={tweet} />
                            ))}
                        </ul>
                    </InfiniteScroll>
                ) : (
                    <ChannelEmptyTweet />
                )}
            </>
        );
    }
}

export default ChannelTweets;
