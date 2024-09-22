import React from "react";
import { BiSupport } from "react-icons/bi";
import { IoIosLink } from "react-icons/io";

function Support() {
    return (
        <>
            <section className="w-full flex justify-center pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
                <div className="flex relative top-20 justify-center p-4">
                    <div className="w-full max-w-fit text-center">
                        <p className="mb-3 w-full">
                            <span className="inline-flex w-36 h-36 rounded-full bg-slate-900 p-2">
                                <span className="w-full h-full flex items-center p-4 pb-5">
                                    <BiSupport className="w-32 h-32" />
                                </span>
                            </span>
                        </p>
                        <h5 className="mt-6 mb-7 text-2xl font-semibold">
                            Facing any problem or need help?
                        </h5>
                        <ul className="text-center flex flex-col items-center space-y-2">
                            <li className="flex items-center">
                                <span className="w-9 h-9 rounded-full mr-4">
                                    <IoIosLink className="w-8 h-8" />
                                </span>
                                <div className="h-full">
                                    <h2 className="text-lg font-bold my-0">
                                        LinkedIn
                                    </h2>
                                    <a
                                        href="https://www.linkedin.com/in/sameer0820/"
                                        target="_blank"
                                        className="text-blue-500 text-sm hover:text-blue-400 "
                                    >
                                        /sameer0820
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center">
                                <span className="w-9 h-9 rounded-full mr-4">
                                    <IoIosLink className="w-8 h-8" />
                                </span>
                                <div className="h-full">
                                    <h2 className="text-lg font-bold my-0">
                                        GitHub
                                    </h2>
                                    <a
                                        href="https://github.com/Sameer0820"
                                        target="_blank"
                                        className="text-blue-500 text-sm hover:text-blue-400 "
                                    >
                                        /Sameer0820
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center">
                                <span className="w-9 h-9 rounded-full mr-4">
                                    <IoIosLink className="w-8 h-8" />
                                </span>
                                <div className="h-full">
                                    <h2 className="text-lg font-bold my-0">
                                        Discord
                                    </h2>
                                    <p className="text-blue-500 text-sm hover:text-blue-400 ">
                                        @sameerraj0820
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Support;
