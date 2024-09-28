import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Tweet cannot be empty");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Error while adding tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (!content?.trim()) {
        throw new ApiError(400, "Tweet cannot be empty");
    }

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(500, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "You do not have permission to update this tweet"
        );
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: { content },
        },
        {
            new: true,
        }
    );

    if (!updatedTweet) {
        throw new ApiError(400, "Error while updating tweet");
    }

    const tweetWithDetails = await Tweet.aggregate([
        {
            $match: { _id: updatedTweet._id },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                content: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!tweetWithDetails.length) {
        throw new ApiError(400, "Error while fetching updated tweet details");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweetWithDetails[0],
                "Tweet updated successfully"
            )
        );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id");
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(500, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "You do not have permission to delete this tweet"
        );
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(400, "Error while deleting tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "No valid user Id found");
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",
                },
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                content: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!tweets) {
        throw new ApiError(401, "Error while fetching tweets");
    }

    res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    );
});

const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 30 } = req.query;

    const tweets = await Tweet.aggregate([
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",
                },
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                content: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!tweets) {
        throw new ApiError(401, "Error while fetching tweets");
    }

    res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    );
});

export { createTweet, updateTweet, deleteTweet, getUserTweets, getAllTweets };
