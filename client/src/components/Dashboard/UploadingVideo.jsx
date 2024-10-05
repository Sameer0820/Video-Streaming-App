import React, { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { icons } from "../../assets/Icons.jsx";
import { TbMovie } from "react-icons/tb";

function UploadingVideo({ video, updating = false }, ref) {
    const dialog = useRef();
    const confirmCancelDialog = useRef();

    useImperativeHandle(
        ref,
        () => {
            return {
                open() {
                    dialog.current.showModal();
                },
                close() {
                    dialog.current.close();
                },
            };
        },
        []
    );

    return createPortal(
        <dialog
            ref={dialog}
            onClose={() => confirmCancelDialog.current?.close()}
            className="h-full text-white backdrop:backdrop-blur-sm"
        >
            <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                    <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
                        <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-zinc-950 p-4">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-xl font-semibold">
                                    {updating ? "Updating" : "Uploading"}{" "}
                                    Video...
                                    <span className="block text-sm text-gray-300">
                                        Track your video{" "}
                                        {updating ? "updating" : "uploading"}{" "}
                                        progress.
                                    </span>
                                </h2>
                                <button
                                    autoFocus
                                    type="button"
                                    onClick={() => dialog.current.close()}
                                    className="h-6 w-6 hover:text-red-500"
                                >
                                    <IoClose className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="mb-6 flex gap-x-2 border p-3">
                                <div className="shrink-0">
                                    <span className="inline-block w-full rounded-full bg-[#f8c3fa] p-1 text-pink-400">
                                        <TbMovie className="w-6 h-6" />
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <h6>
                                        {updating
                                            ? "Updating " + video.title
                                            : video?.videoFile?.length > 0 &&
                                              video?.videoFile[0].name}
                                    </h6>
                                    {!updating && (
                                        <p className="text-sm">
                                            {video?.videoFile?.length > 0 &&
                                                (
                                                    video?.videoFile[0].size /
                                                    1000000
                                                ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center">
                                        {icons.loading}
                                        {updating ? "Updating" : "Uploading"}
                                    </div>
                                </div>
                            </div>
                            {!updating && (
                                <div className="flex justify-center items-center mx-auto">
                                    <button
                                        onClick={() => dialog.current.close()}
                                         className="border px-4 py-2 hover:bg-gray-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>,
        document.getElementById("popup-models")
    );
}

export default React.forwardRef(UploadingVideo);
