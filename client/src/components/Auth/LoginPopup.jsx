import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setUser } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper.js";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { icons } from "../../assets/Icons.jsx";
import { IoClose } from "react-icons/io5";

function LoginPopup({ route, message = "Login to continue..." }, ref) {
    const dialog = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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

    const login = async (data) => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.post("/users/login", data);
            if (response?.data?.data) {
                dispatch(setUser(response.data.data.user));
                localStorage.setItem(
                    "accessToken",
                    response.data.data.accessToken
                );
                toast.success(response.data.message + "🤩");
                if (route) {
                    navigate(route);
                }
                dialog.current.close();
            }
        } catch (error) {
            if (error.status === 401) {
                setError("Invalid password");
            } else if (error.status === 500) {
                setError("Server is not working");
            } else if (error.status === 404) {
                setError("User does not exist");
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        dialog.current.close();
        setShowPopup(false);
        if (route) navigate(route);
    };

    return (
        <div className="absolute">
            {showPopup &&
                createPortal(
                    <dialog
                        ref={dialog}
                        onClose={handleClose}
                        className="mx-auto w-[90%] backdrop:backdrop-blur-sm sm:w-[60%] lg:w-[40%] xl:w-[30%] overflow-y-auto bg-gray-900/80 text-white"
                    >
                        <div className="mx-8 my-6 mb-8 flex flex-col relative">
                            <button
                                autoFocus
                                type="button"
                                onClick={handleClose}
                                className="absolute right-0 top-1 h-7 w-7 focus:border-dotted hover:border-dotted hover:border"
                            >
                                <IoClose className="w-7 h-7" />
                            </button>
                            <Logo />
                            <h6 className="mx-auto mt-6 mb-2 text-2xl font-semibold">
                                {message}
                            </h6>
                            <h6 className="mx-auto text-md mb-3">
                                Don't have an Account yet?{" "}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-blue-600 hover:text-blue-400"
                                >
                                    Sign up now
                                </Link>
                            </h6>
                            {error && (
                                <p className="text-red-600 mt-4 text-center">
                                    {error}
                                </p>
                            )}
                            <form
                                onSubmit={handleSubmit(login)}
                                className="mx-auto mt-2 flex w-full max-w-sm flex-col px-4"
                            >
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    type="email"
                                    className="px-2 rounded-lg"
                                    required
                                    {...register("email", {
                                        required: true,
                                        validate: {
                                            matchPattern: (value) =>
                                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                                                    value
                                                ) ||
                                                "Email address must be a valid address",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-600 px-2 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                                {errors.email?.type === "required" && (
                                    <p className="text-red-600 px-2 mt-1">
                                        Email is required
                                    </p>
                                )}
                                <Input
                                    label="Password"
                                    className="px-2 rounded-lg"
                                    className2="pt-5"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    {...register("password", {
                                        required: true,
                                    })}
                                />
                                {errors.password?.type === "required" && (
                                    <p className="text-red-600 px-2 mt-1">
                                        Password is required
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 disabled:cursor-not-allowed py-2 rounded-lg"
                                    bgColor={
                                        loading ? "bg-pink-800" : "bg-pink-600"
                                    }
                                >
                                    {loading ? (
                                        <span>{icons.loading}</span>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </dialog>,
                    document.getElementById("popup-models")
                )}
        </div>
    );
}

export default React.forwardRef(LoginPopup);
