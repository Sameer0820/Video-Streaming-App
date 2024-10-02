import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { icons } from "../../assets/Icons.jsx";
import Button from "../Button.jsx";
import Input from "../Input.jsx";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { updatePlaylist } from "../../store/playlistSlice.js";
import { getUserPlaylist } from "../../hooks/getUserPlaylist.js";

function PlaylistForm({ playlist, route }, ref) {
    const dialog = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state) => state?.user?.user?._id);

    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: playlist?.name || "",
            description: playlist?.description || "",
        },
    });

    useImperativeHandle(
        ref,
        () => {
            return {
                open() {
                    setShowPopup(true);
                },
                close() {
                    handleClose();
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

    const handleClose = () => {
        dialog.current.close();
        setShowPopup(false);
        reset();
        if (route) navigate(route);
    };

    const handleUpdatePlaylist = async (data) => {
        setLoading(true);
        try {
            if (playlist) {
                const response = await axiosInstance.patch(
                    `/playlist/${playlist._id}`,
                    data
                );
                if (response?.data?.success) {
                    dispatch(
                        updatePlaylist({
                            name: response.data.data.name,
                            description: response.data.data.description,
                        })
                    );
                    toast.success(response.data.message + "🤩");
                    if (route) {
                        navigate(route);
                    }
                    dialog.current.close();
                }
            } else {
                const response = await axiosInstance.post(`playlist/`, data);
                if (response?.data?.success) {
                    getUserPlaylist(dispatch, userId);
                }
                toast.success(response.data.message + "🤩");
                if (route) {
                    navigate(route);
                }
                dialog.current.close();
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute">
            {showPopup &&
                createPortal(
                    <dialog
                        ref={dialog}
                        className="h-full backdrop:backdrop-blur-sm items-center"
                        onClose={handleClose}
                    >
                        <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                            <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                                <form
                                    onSubmit={handleSubmit(handleUpdatePlaylist)}
                                    className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 text-white bg-zinc-950 p-4"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <h2 className="text-xl font-semibold">
                                            {playlist ? "Edit" : "Create"}{" "}
                                            Playlist
                                        </h2>
                                        <button
                                            autoFocus
                                            type="button"
                                            onClick={handleClose}
                                            className="h-7 w-7 hover:border-dotted hover:border"
                                        >
                                            <IoClose className="w-7 h-7" />
                                        </button>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-y-4">
                                        <Input
                                            label="Title"
                                            className="px-2 rounded-lg"
                                            className2="pt-5"
                                            placeholder="Enter name of the Playlist"
                                            required
                                            {...register("name", {
                                                required: true,
                                            })}
                                        />
                                        <div className="w-full">
                                            <label
                                                htmlFor="desc"
                                                className="mb-1 pl-1 inline-block"
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                id="desc"
                                                className="px-2 rounded-lg w-full py-1 bg-zinc-800 text-white outline-none duration-200 border focus:border-blue-800 border-gray-200"
                                                placeholder="Enter some description of the Playlist"
                                                {...register("description", {
                                                    required: false,
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            onClick={handleClose}
                                            className="mt-6 py-2 rounded-lg"
                                            bgColor="bg-gray-300"
                                            textColor="text-black"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="mt-6 disabled:cursor-not-allowed py-2 rounded-lg"
                                            bgColor={
                                                loading
                                                    ? "bg-pink-800"
                                                    : "bg-pink-600"
                                            }
                                        >
                                            {loading && (
                                                <span>{icons.loading}</span>
                                            )}
                                            {!loading && playlist
                                                ? "Update"
                                                : "Create"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>,
                    document.getElementById("popup-models")
                )}
        </div>
    );
}

export default React.forwardRef(PlaylistForm);
