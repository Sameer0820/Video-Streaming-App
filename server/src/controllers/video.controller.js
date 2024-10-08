import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import fs from "fs";
import { Subscription } from "../models/subscription.model.js";

function unlinkPath(videoLocalPath, thumbnailLocalPath) {
    if (videoLocalPath) fs.unlinkSync(videoLocalPath);
    if (thumbnailLocalPath) fs.unlinkSync(thumbnailLocalPath);
}

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
    } = req.query;

    const videos = await Video.aggregate([
        ...(query
            ? [
                  {
                      $match: {
                          $or: [
                              {
                                  title: { $regex: query, $options: "i" },
                              },
                              {
                                  description: { $regex: query, $options: "i" },
                              },
                          ],
                      },
                  },
              ]
            : []),
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
                            avatar: 1,
                            username: 1,
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
            $project: {
                _id: 1,
                owner: 1,
                videoFile: 1,
                thumbnail: 1,
                createdAt: 1,
                description: 1,
                title: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
    ]);

    if (!videos) {
        throw new ApiError(404, "No videos found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getUserVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortType = "desc" } = req.query;
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $match: { isPublished: true },
        },
        {
            $sort: {
                createdAt: sortType === "asc" ? 1 : -1,
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
                            avatar: 1,
                            username: 1,
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
            $project: {
                _id: 1,
                owner: 1,
                videoFile: 1,
                thumbnail: 1,
                createdAt: 1,
                description: 1,
                title: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
            },
        },
    ]);

    if (!videos) {
        throw new ApiError(404, "Error while fetching videos");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getSubscribedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortType = "desc" } = req.query;

    const subscriptions = await Subscription.find({
        subscriber: new mongoose.Types.ObjectId(req.user?._id),
    }).select("channel");

    const channelIds = subscriptions.map((sub) => sub.channel);

    if (channelIds.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No subscribed channels found"));
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: {
                    $in: channelIds.map(
                        (id) => new mongoose.Types.ObjectId(id)
                    ),
                },
            },
        },
        {
            $match: { isPublished: true },
        },
        {
            $sort: {
                createdAt: sortType === "asc" ? 1 : -1,
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
                            avatar: 1,
                            username: 1,
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
            $project: {
                _id: 1,
                owner: 1,
                videoFile: 1,
                thumbnail: 1,
                createdAt: 1,
                description: 1,
                title: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
            },
        },
    ]);

    if (!videos) {
        throw new ApiError(404, "Error while fetching videos");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Subscribed videos fetched successfully"
            )
        );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!title || title.trim() === "") {
        unlinkPath(videoLocalPath, thumbnailLocalPath);
        throw new ApiError(400, "Title is required");
    }

    if (!videoLocalPath) {
        unlinkPath(videoLocalPath, thumbnailLocalPath);
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        unlinkPath(videoLocalPath, thumbnailLocalPath);
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Video or thumbnail file is missing");
    }

    const video = await Video.create({
        videoFile: videoFile?.secure_url,
        thumbnail: thumbnail?.secure_url,
        title,
        duration: videoFile?.duration,
        description: description || "",
        owner: req.user?._id,
    });

    if (!video) {
        throw new ApiError(500, "Error while uploading video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
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
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers",
                        },
                    },
                    {
                        $addFields: {
                            subscriberCount: {
                                $size: "$subscribers",
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user?._id,
                                            "$subscribers.subscriber",
                                        ],
                                    },
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            subscriberCount: 1,
                            isSubscribed: 1,
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
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                owner: 1,
                createdAt: 1,
                comments: 1,
                likesCount: 1,
                isLiked: 1,
            },
        },
    ]);

    if (!video.length) {
        throw new ApiError(404, "Video does not exists");
    }

    await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1,
        },
    });

    await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: {
            watchHistory: videoId,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { videoId } = req.params;
    const thumbnailLocalPath = req.file?.path;

    if (!videoId || !isValidObjectId(videoId)) {
        unlinkPath(null, thumbnailLocalPath);
        throw new ApiError(400, "Invalid video Id");
    }

    if (!title && !description && !thumbnailLocalPath) {
        unlinkPath(null, thumbnailLocalPath);
        throw new ApiError(400, "At least one field is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        unlinkPath(null, thumbnailLocalPath);
        throw new ApiError(404, "Video not found");
    }

    if (req.user?._id.toString() !== video?.owner.toString()) {
        unlinkPath(null, thumbnailLocalPath);
        throw new ApiError(
            401,
            "You do not have permission to perform this action"
        );
    }

    let thumbnail;
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail) {
            throw new ApiError(
                400,
                "Error while uploading thumbnail on Cloudinary"
            );
        } else {
            const thumbnailUrl = video?.thumbnail;
            const regex = /\/([^/]+)\.[^.]+$/;
            const match = thumbnailUrl.match(regex);

            if (!match) {
                throw new ApiError(
                    400,
                    "Couldn't find Public ID of old thumbnail"
                );
            }

            const publicId = match[1];
            await deleteFromCloudinary(publicId);
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video?.title,
                description: description || video?.description,
                thumbnail: thumbnail?.secure_url || video?.thumbnail,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Error while updating video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "You do not have permission to delete this video"
        );
    }

    await Video.findByIdAndDelete(videoId);

    const thumbnailUrl = video?.thumbnail;
    const videoFileUrl = video?.videoFile;
    const regex = /\/([^/]+)\.[^.]+$/;
    let match = thumbnailUrl.match(regex);
    if (!match) {
        throw new ApiError(400, "Couldn't find Public ID of thumbnail");
    }

    let publicId = match[1];
    const deleteThumbnail = await deleteFromCloudinary(publicId);

    match = videoFileUrl.match(regex);
    if (!match) {
        throw new ApiError(400, "Couldn't find Public ID of video");
    }

    publicId = match[1];
    const deleteVideoFile = await deleteFromCloudinary(publicId, "video");

    if (deleteThumbnail.result !== "ok") {
        throw new ApiError(
            500,
            "Error while deleting thumbnail from Cloudinary"
        );
    }

    if (deleteVideoFile.result !== "ok") {
        throw new ApiError(500, "Error while deleting video from Cloudinary");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "You do not have permission to perform this action"
        );
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: { isPublished: !video?.isPublished },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Publish status toggled successfully"
            )
        );
});

export {
    getAllVideos,
    getUserVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getSubscribedVideos,
};
