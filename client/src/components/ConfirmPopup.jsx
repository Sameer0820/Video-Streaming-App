import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import Button from "./Button.jsx";

function ConfirmPopup(
    {
        title = "Are you sure",
        subtitle,
        message,
        confirm = "Confirm",
        cancel = "Cancel",
        critical = false,
        checkbox = false,
        actionFunction,
    },
    ref
) {
    const dialog = useRef();
    const [isChecked, setIsChecked] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            open() {
                setShowPopup(true);
            },
            close() {
                dialog.current?.close();
            },
        };
    });

    useEffect(() => {
        if (showPopup) {
            dialog.current.showModal();
        }
    }, [showPopup]);

    const handleClose = () => {
        dialog.current.close();
        setShowPopup(false);
        actionFunction(false);
    };

    const handleConfirm = (event) => {
        event.preventDefault();
        dialog.current.close();
        actionFunction(true);
    };

    return (
        <div className="absolute">
            {showPopup &&
                createPortal(
                    <dialog
                        ref={dialog}
                        onClose={handleClose}
                        className="h-full backdrop:backdrop-blur-sm items-center"
                    >
                        <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                            <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                                <form
                                    onSubmit={handleConfirm}
                                    className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 text-white bg-zinc-950 p-4"
                                >
                                    <div className="flex items-start justify-end">
                                        <button
                                            autoFocus
                                            type="button"
                                            onClick={handleClose}
                                            className="h-7 w-7 hover:border-dotted hover:border"
                                        >
                                            <IoClose className="w-7 h-7" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center text-center justify-center">
                                        <h6 className="text-3xl font-semibold mb-3 select-none">
                                            {title}
                                        </h6>
                                        {subtitle && (
                                            <span className=" text-xl text-gray-300">
                                                {subtitle}
                                            </span>
                                        )}
                                        {message && (
                                            <span className="text-gray-300 mt-1">
                                                {message}
                                            </span>
                                        )}
                                    </div>
                                    {checkbox && (
                                        <div className="flex justify-center items-center my-5">
                                            <input
                                                id={"confirm-checkbox"}
                                                type="checkbox"
                                                defaultChecked={false}
                                                className="size-4 mr-2"
                                                onChange={(e) =>
                                                    setIsChecked(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor={"confirm-checkbox"}
                                                className=" hover:cursor-pointer select-none"
                                            >
                                                {checkbox}
                                            </label>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <Button
                                            onClick={handleClose}
                                            className="border hover:bg-slate-700"
                                        >
                                            {cancel}
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={checkbox && !isChecked}
                                            textColor=""
                                            bgColor=""
                                            className={`${
                                                critical
                                                    ? "bg-zinc-900 text-red-500"
                                                    : "bg-pink-600 text-white"
                                            } border enabled:hover:text-black enabled:hover:bg-red-500/80 font-semibold disabled:cursor-not-allowed`}
                                        >
                                            {confirm}
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

export default React.forwardRef(ConfirmPopup);
