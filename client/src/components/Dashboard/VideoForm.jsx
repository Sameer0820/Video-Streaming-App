import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import UploadSuccess from "./UploadSuccess.jsx";
import UploadingVideo from "./UploadingVideo.jsx";
import { addVideoStats } from "../../store/dashboardSlice.js";
import { useDispatch } from "react-redux";
import { getChannelVideos } from "../../hooks/getChannelVideos.js";

function VideoForm({ video = false }, ref) {
    const dialog = useRef();
    const uploadingDialog = useRef();
    const successDialog = useRef();
    const dispatch = useDispatch();

    const [showPopup, setShowPopup] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: video?.title || "",
            description: video?.description || "",
        },
    });

    useImperativeHandle(
        ref,
        () => {
            return {
                open() {
                    setShowPopup(true);
                    dialog.current?.showModal();
                },
                close() {
                    dialog.current.close();
                },
            };
        },
        []
    );

    useEffect(() => {
        if (showPopup) {
            dialog.current.showModal();
        }
    }, [showPopup]);

    const publishVideo = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append("thumbnail", data.thumbnail[0]);
        formData.append("videoFile", data.videoFile[0]);

        try {
            await axiosInstance.post("/videos", formData).then(() => {
                uploadingDialog.current.close();
                successDialog.current.open();
                reset();
                dispatch(addVideoStats());
                getChannelVideos(dispatch);
                toast.success("Video uploaded successfully");
            });
        } catch (error) {
            uploadingDialog.current.close();
            toast.error("Error while uploading video. Try again!!");
            console.log("Error uploading video", error);
        }
    };

    const updateVideo = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail[0]);

        try {
            await axiosInstance
                .patch(`/videos/${video._id}`, formData)
                .then(() => {
                    uploadingDialog.current.close();
                    successDialog.current.open();
                    reset();
                    getChannelVideos(dispatch);
                });
        } catch (error) {
            uploadingDialog.current.close();
            toast.error("Error while updating video. Try again!!");
            console.log("Error updating video", error);
        }
    };

    const handleVideo = async (data) => {
        if (video) {
            updateVideo(data);
        } else {
            publishVideo(data);
        }
        dialog.current.close();
        uploadingDialog.current.open();
    };

    return (
        <div>
            {showPopup &&
                createPortal(
                    <dialog
                        ref={dialog}
                        className="h-fit backdrop:backdrop-blur-lg lg:w-[40%] md:w-2/3 items-center"
                    >
                        <UploadingVideo
                            ref={uploadingDialog}
                            video={video || getValues()}
                            updating={video ? true : false}
                        />
                        <UploadSuccess
                            ref={successDialog}
                            video={video || getValues()}
                            updating={video ? true : false}
                        />
                        <div className="bg-black/85 p-2 text-white">
                            <form
                                onSubmit={handleSubmit(handleVideo)}
                                className="h-fit border bg-zinc-950"
                            >
                                <div className="flex items-center justify-between border-b px-2 py-1 md:p-3">
                                    <h2 className="text-xl font-semibold">
                                        {video ? "Update" : "Upload"} Video
                                    </h2>
                                    <button
                                        type="button"
                                        title="Close"
                                        autoFocus
                                        onClick={() => dialog.current.close()}
                                        className="h-6 w-6 hover:text-red-600"
                                    >
                                        <IoClose className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-2 md:gap-y-3 p-4">
                                    {!video && (
                                        <>
                                            <div className="w-full border-2 border-dotted px-2 py-5 text-center">
                                                <span className="mb-2 inline-block rounded-full bg-[#f8c3fa] p-3 text-pink-500">
                                                    <BsUpload className="h-7 w-7" />
                                                </span>
                                                <h6 className="mb-1 font-semibold text-sm md:text-lg">
                                                    Select video file to upload
                                                </h6>
                                                <p className="text-gray-400 text-sm">
                                                    Your video will be publised
                                                    by default after upload is
                                                    complete.
                                                </p>
                                                <label
                                                    htmlFor="upload-video"
                                                    className="mt-3 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-pink-500 px-3 py-2 text-sm text-center font-semibold text-black transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px]"
                                                >
                                                    <input
                                                        type="file"
                                                        id="upload-video"
                                                        className="sr-only"
                                                        {...register(
                                                            "videoFile",
                                                            {
                                                                required: true,
                                                                validate: (
                                                                    file
                                                                ) => {
                                                                    const allowedExtensions =
                                                                        [
                                                                            "video/mp4",
                                                                        ];
                                                                    const fileType =
                                                                        file[0]
                                                                            .type;
                                                                    return allowedExtensions.includes(
                                                                        fileType
                                                                    )
                                                                        ? true
                                                                        : "Invalid file type! Only .mp4 files are accepted";
                                                                },
                                                            }
                                                        )}
                                                    />
                                                    Select File
                                                </label>
                                            </div>
                                            {errors.videoFile?.type ===
                                                "required" && (
                                                <div className="text-red-500">
                                                    VideoFile is required
                                                </div>
                                            )}
                                            {errors.videoFile?.type ===
                                                "validate" && (
                                                <div className="text-red-500">
                                                    {errors.videoFile.message}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="w-full">
                                        <label
                                            htmlFor="thumbnail"
                                            className="mb-1 inline-block"
                                        >
                                            Thumbnail
                                            {!video && (
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            id="thumbnail"
                                            className="w-full border p-1 file:mr-4 file:border-none cursor-pointer file:bg-pink-500 file:px-3 file:py-1.5"
                                            {...register("thumbnail", {
                                                required: !video,
                                                validate: (file) => {
                                                    if (video) return true;
                                                    if (!file[0]) return true;
                                                    const allowedExtensions = [
                                                        "image/jpeg",
                                                        "image/png",
                                                        "image/jpg",
                                                    ];
                                                    const fileType =
                                                        file[0]?.type;
                                                    return allowedExtensions.includes(
                                                        fileType
                                                    )
                                                        ? true
                                                        : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.thumbnail?.type === "required" && (
                                        <div className="text-red-500">
                                            Thumbnail is required
                                        </div>
                                    )}
                                    {errors.thumbnail?.type === "validate" && (
                                        <div className="text-red-500">
                                            {errors.thumbnail.message}
                                        </div>
                                    )}

                                    <div className="w-full">
                                        <label
                                            htmlFor="title"
                                            className="mb-1 inline-block"
                                        >
                                            Title
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Add video title"
                                            id="title"
                                            className="w-full border focus:border-pink-400 bg-transparent px-2 py-1 outline-none"
                                            {...register("title", {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    {errors.title?.type === "required" && (
                                        <div className="text-red-500">
                                            Title is required
                                        </div>
                                    )}

                                    <div className="w-full">
                                        <label
                                            htmlFor="desc"
                                            className="mb-1 inline-block"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Add some description"
                                            id="desc"
                                            className="h-24 md:h-32 w-full resize-none border focus:border-pink-400 bg-transparent px-2 py-1 outline-none"
                                            {...register("description")}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                reset();
                                                dialog.current.close();
                                            }}
                                            className="border px-4 py-2 hover:bg-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                errors.title ||
                                                errors.videoFile ||
                                                (!video && errors.thumbnail)
                                            }
                                            className="bg-pink-600 px-4 py-2 text-black hover:font-semibold hover:border disabled:bg-pink-700 disabled:cursor-not-allowed"
                                        >
                                            {video ? "Update" : "Publish"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </dialog>,
                    document.getElementById("popup-models")
                )}
        </div>
    );
}

export default React.forwardRef(VideoForm);
