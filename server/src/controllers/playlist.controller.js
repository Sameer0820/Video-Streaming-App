import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Name is required");
    }

    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user?._id,
    });

    if (!playlist) {
        throw new ApiError(500, "Error while creating playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is not valid");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
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
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $match: { isPublished: true },
                    },
                    {
                        $project: {
                            thumbnail: 1,
                            views: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $project: {
                name: 1,
                description: 1,
                owner: 1,
                thumbnail: 1,
                createdAt: 1,
                updatedAt: 1,
                thumbnail: {
                    $first: "$videos.thumbnail",
                },
                videosCount: {
                    $size: "$videos",
                },
                totalViews: {
                    $sum: "$videos.views",
                },
            },
        },
    ]);

    if (!playlists) {
        throw new ApiError(404, "Error while fetching playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "Playlists fetched successfully")
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
                                        username: 1,
                                        fullName: 1,
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
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
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
        {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
                owner: 1,
                thumbnail: {
                    $first: "$videos.thumbnail",
                },
                videosCount: {
                    $size: "$videos",
                },
                totalViews: {
                    $sum: "$videos.views",
                },
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!playlist.length) {
        throw new ApiError(500, "Error while fetching playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist[0], "Playlist fetched successfully")
        );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "you do not have permission to perform this action"
        );
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist");
    }

    const addToPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId,
            },
        },
        { new: true }
    );

    if (!addToPlaylist) {
        throw new ApiError(500, "Error while adding video to playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                addToPlaylist,
                "Video added to playlist successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "you do not have permission to perform this action"
        );
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not in playlist");
    }

    const removeVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: {
                    $in: [`${videoId}`],
                },
            },
        },
        { new: true }
    );

    if (!removeVideo) {
        throw new ApiError(
            500,
            "Something went wrong while removing video from playlist"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                removeVideo,
                "video removed from playlist successfully"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "you do not have permission to perform this action"
        );
    }

    const delPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!delPlaylist) {
        throw new ApiError(500, "Error while deleting playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, delPlaylist, "Playlist deleted successfully")
        );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    if (!name && !description) {
        throw new ApiError(400, "Atleast one of the field is required");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            401,
            "you do not have permission to perform this action"
        );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name || playlist?.name,
                description: description || playlist?.description,
            },
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Error while updating playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )
        );
});

const getVideoPlaylist = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $project: {
                name: 1,
                isVideoPresent: {
                    $cond: {
                        if: {
                            $in: [
                                new mongoose.Types.ObjectId(videoId),
                                "$videos",
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
    ]);

    if (!playlists) {
        throw new ApiError(500, "Error while fetching playlists");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "Playlists fetched successfully")
        );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getVideoPlaylist,
};
