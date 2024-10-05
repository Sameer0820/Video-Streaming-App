import React, { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { TbMovie } from "react-icons/tb";
import { IoCloudDoneOutline } from "react-icons/io5";

function UploadSuccess({ video, updating = false }, ref) {
    const dialog = useRef();

    useImperativeHandle(
        ref,
        () => {
            return {
                open() {
                    dialog.current.showModal();
                },
            };
        },
        []
    );

    return createPortal(
        <dialog
            ref={dialog}
            className="h-full text-white backdrop:backdrop-blur-sm"
        >
            <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                    <div className="inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
                        <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-zinc-950 p-4">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-xl font-semibold">
                                    Video {updating ? "Updated" : "Uploaded"}{" "}
                                    Successfully...
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
                            <div className="mb-4 flex gap-x-2 border p-3">
                                <div className="shrink-0">
                                    <span className="inline-block w-full rounded-full bg-[#f8c3fa] p-1 text-pink-400">
                                        <TbMovie className="w-6 h-6" />
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <h6>
                                        {updating
                                            ? "Updated " + video.title
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
                                    <div className="mt-2 flex items-center gap-x-1">
                                        <IoCloudDoneOutline className="w-5 h-5" />
                                        Video{" "}
                                        {updating ? "Updated" : "Uploaded"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center items-center mx-auto">
                                    <button
                                        onClick={() => dialog.current.close()}
                                         className="bg-pink-500 hover:border text-black font-semibold px-4 py-1.5"
                                    >
                                        Finish
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>,
        document.getElementById("popup-models")
    );
}

export default React.forwardRef(UploadSuccess);
