import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../assets/Icons.jsx";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Button from "../components/Button.jsx";
import axiosInstance from "../utils/axios.helper.js";
import Tweet from "../components/Tweet/TweetCard.jsx";
import { addTweets, removeTweets } from "../store/tweetsSlice.js";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { TiMessages } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import LoginPopup from "../components/Auth/LoginPopup.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

function Tweets() {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [tweetsUpdated, setTweetsUpdated] = useState(false);
    const LoginPopupDialog = useRef();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const getAllTweets = async () => {
        try {
            const response = await axiosInstance.get(
                `/tweets?page=${page}&limit=30`
            );
            if (response?.data?.data?.length === 30) {
                dispatch(addTweets(response.data.data));
            } else {
                dispatch(addTweets(response.data.data));
                setHasMore(false);
            }
        } catch (error) {
            console.log("Error while fetching tweets", error);
        }
    };

    const addTweet = async (data) => {
        if (!status) {
            LoginPopupDialog.current.open();
        } else {
            try {
                await axiosInstance.post("/tweets", data);
                reset();
                setTweetsUpdated((prev) => !prev);
                setPage(1);
            } catch (error) {
                toast.error("Couldn't add your tweet. Try again!");
                console.log("Error while adding tweet", error);
            }
        }
    };

    useEffect(() => {
        if (page === 1) {
            dispatch(removeTweets());
        }
        getAllTweets().then(() => setLoading(false));
    }, [tweetsUpdated, status, page]);

    const tweets = useSelector((state) => state.tweets.tweets);

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (loading) {
        return (
            <span className="flex justify-center mt-20">
                {icons.bigLoading}
            </span>
        );
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(addTweet)}
                className="mt-4 border pb-2 rounded-lg mx-4"
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
                        <LoginPopup
                            ref={LoginPopupDialog}
                            message="Login to Tweet..."
                            route={location.pathname}
                        />
                    </div>
                </div>
            </form>
            <div className="mt-6 border-b border-gray-400"></div>
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
                    <ul className="py-4 px-4">
                        {tweets.map((tweet) => (
                            <Tweet key={tweet._id} tweet={tweet} page={true} />
                        ))}
                    </ul>
                </InfiniteScroll>
            ) : (
                <GuestComponent
                    icon={
                        <span className="w-full h-full flex items-center p-4 pb-5">
                            <TiMessages className="w-32 h-32" />
                        </span>
                    }
                    title="Empty Tweets"
                    subtitle="There are no tweets right now. Be the first one to write a tweet."
                    guest={false}
                />
            )}
        </>
    );
}

export default Tweets;
