import React, { useRef } from "react";
import { GrLogin } from "react-icons/gr";
import LoginPopup from "../Auth/LoginPopup";

function GuestComponent({
    icon,
    title = "Sign in to view this page",
    subtitle = "",
    route,
    guest = true,
}) {
    const LoginPopupDialog = useRef();

    return (
        <section className="w-full flex justify-center pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="flex relative top-20 justify-center p-4">
                <div className="w-full max-w-fit text-center">
                    <p className="mb-3 w-full">
                        <span className="inline-flex w-36 h-36 rounded-full bg-slate-900 p-2">
                            {icon}
                        </span>
                    </p>
                    <h5 className="mt-6 mb-2 text-2xl font-semibold">
                        {title}
                    </h5>
                    <p>{subtitle}</p>
                    {guest && (
                        <>
                            <LoginPopup
                                ref={LoginPopupDialog}
                                route={route || ""}
                            />
                            <button
                                onClick={() => LoginPopupDialog.current.open()}
                                className="mt-4 inline-flex items-center gap-x-2 hover:bg-pink-600 rounded bg-pink-700 hover:border-dotted border border-transparent hover:border-white px-3 py-2 font-semibold text-black"
                            >
                                <span className="w-5">
                                    <GrLogin />
                                </span>
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default GuestComponent;
