import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "No valid video Id found");
    }

    const isLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id,
    });

    if (isLiked) {
        const removeLike = await Like.findByIdAndDelete(isLiked._id);
        if (!removeLike) {
            throw new ApiError(500, "Error while removing like");
        }
    } else {
        const liked = await Like.create({
            video: videoId,
            likedBy: req.user?._id,
        });
        if (!liked) {
            throw new ApiError(500, "Error while liking video");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Like status updated"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "No valid comment Id found");
    }

    const isLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    if (isLiked) {
        const removeLike = await Like.findByIdAndDelete(isLiked._id);
        if (!removeLike) {
            throw new ApiError(500, "Error while removing like");
        }
    } else {
        const liked = await Like.create({
            comment: commentId,
            likedBy: req.user?._id,
        });
        if (!liked) {
            throw new ApiError(500, "Error while liking comment");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Like status updated"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "No valid tweet Id found");
    }

    const isLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    if (isLiked) {
        const removeLike = await Like.findByIdAndDelete(isLiked._id);
        if (!removeLike) {
            throw new ApiError(500, "Error while removing like");
        }
    } else {
        const liked = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id,
        });
        if (!liked) {
            throw new ApiError(500, "Error while liking tweet");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Like status updated"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $match: { isPublished: true },
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
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
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
                ],
            },
        },
        {
            $addFields: {
                video: {
                    $first: "$video",
                },
            },
        },
        {
            $match: {
                video: { $exists: true }, // Filter out non-video documents
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
    ]);

    if (!likedVideos) {
        throw new ApiError(500, "Error while fetching liked videos");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "Liked videos fetched successfully"
            )
        );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
