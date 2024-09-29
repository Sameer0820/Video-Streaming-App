import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is not valid");
    }

    if (channelId.toString() === req.user?._id.toString()) {
        throw new ApiError(403, "Cannot subscribe to your own channel");
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId,
    });

    if (isSubscribed) {
        const unsubscribe = await Subscription.findByIdAndDelete(isSubscribed);

        if (!unsubscribe) {
            throw new ApiError(500, "Error while unsubscribing");
        }
    } else {
        const subscribe = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId,
        });

        if (!subscribe) {
            throw new ApiError(500, "Error while subscribing");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Subscription toggled"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel id is not valid");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
            },
        },
        {
            $addFields: {
                subscribers: {
                    $first: "$subscribers",
                },
            },
        },
        {
            $group: {
                _id: null,
                subscribers: { $push: "$subscribers" },
                totalSubscribers: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                subscribers: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    fullName: 1,
                },
                subscribersCount: "$totalSubscribers",
            },
        },
    ]);

    if (!subscribers) {
        throw new ApiError(404, "Subscribers not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Subscribers fetched successfully"
            )
        );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId || !isValidObjectId(subscriberId)) {
        throw new ApiError(400, "No valid subscriber Id found");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
            },
        },
        {
            $unwind: "$channelDetails",
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "channel",
                foreignField: "channel",
                as: "channelSubscribers",
            },
        },
        {
            $addFields: {
                "channelDetails.isSubscribed": {
                    $cond: {
                        if: {
                            $in: [
                                new mongoose.Types.ObjectId(req.user?._id),
                                "$channelSubscribers.subscriber",
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
                "channelDetails.subscribersCount": {
                    $size: "$channelSubscribers",
                },
            },
        },
        {
            $group: {
                _id: null,
                channels: { $push: "$channelDetails" },
                totalChannels: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                channels: {
                    _id: 1,
                    isSubscribed: 1,
                    subscribersCount: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                },
                channelsCount: "$totalChannels",
            },
        },
    ]);

    if (!subscribedChannels) {
        throw new ApiError(404, "Channels not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribedChannels[0],
                "Subscribed channels fetched successfully"
            )
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
