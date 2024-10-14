import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper.js";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { icons } from "../../assets/Icons.jsx";
import { toast } from "react-toastify";

function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const signup = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append("avatar", data.avatar[0]);
        if (data.coverImage) {
            formData.append("coverImage", data.coverImage[0]);
        }
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                "/users/register",
                formData
            );
            if (response?.data?.data) {
                toast.success("Account created successfully 🥳");
                navigate("/login");
            }
        } catch (error) {
            if (error.status === 409) {
                setError("User with email or username already exists");
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full overflow-y-auto bg-[#121212] text-white">
            <div className="mx-auto my-10 flex w-full max-w-sm flex-col px-4">
                <div className="mx-auto inline-block">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                <div className="my-4 w-full text-center text-xl font-semibold">
                    Create an Account
                </div>
                <h6 className="mx-auto mb-1">
                    Already have an Account?{" "}
                    <Link
                        to={"/login"}
                        className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                        Sign in now
                    </Link>
                </h6>
                {error && (
                    <p className="text-red-600 mt-8 text-center">{error}</p>
                )}
                <form
                    onSubmit={handleSubmit(signup)}
                    className="mx-auto mt-2 flex w-full max-w-sm flex-col px-4"
                >
                    <Input
                        label="Full Name"
                        required
                        className="px-2 rounded-lg"
                        placeholder="Enter your full name"
                        {...register("fullName", {
                            required: true,
                            maxLength: {
                                value: 25,
                                message:
                                    "Full name cannot exceed 25 characters",
                            },
                        })}
                    />
                    {errors.fullName?.type === "required" && (
                        <p className="text-red-600 px-2 mt-1">
                            Full name is required
                        </p>
                    )}
                    {errors.fullName && (
                        <p className="text-red-600 px-2 mt-1">
                            {errors.fullName.message}
                        </p>
                    )}
                    <Input
                        label="Username"
                        required
                        className="px-2 rounded-lg"
                        className2="pt-5"
                        placeholder="Choose your username"
                        {...register("username", {
                            required: true,
                            maxLength: {
                                value: 25,
                                message:
                                    "User name cannot exceed 25 characters",
                            },
                        })}
                    />
                    {errors.username?.type === "required" && (
                        <p className="text-red-600 px-2 mt-1">
                            Username is required
                        </p>
                    )}
                    {errors.username && (
                        <p className="text-red-600 px-2 mt-1">
                            {errors.username.message}
                        </p>
                    )}
                    <Input
                        label="Email Address"
                        placeholder="Enter your email address"
                        type="email"
                        className="px-2 rounded-lg"
                        className2="pt-5"
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
                        placeholder="Create your password"
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
                    <Input
                        label="Avatar"
                        type="file"
                        required
                        className="px-2 rounded-lg"
                        className2="pt-5"
                        placeholder="Upload your avatar"
                        {...register("avatar", {
                            required: true,
                            validate: (file) => {
                                const allowedExtensions = [
                                    "image/jpeg",
                                    "image/png",
                                    "image/jpg",
                                ];
                                const fileType = file[0]?.type;
                                return allowedExtensions.includes(fileType)
                                    ? true
                                    : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                            },
                        })}
                    />
                    {errors.avatar && (
                        <p className="text-red-600 px-2 mt-1">
                            {errors.avatar.message}
                        </p>
                    )}
                    <Input
                        label="Cover Image"
                        type="file"
                        className="px-2 rounded-lg"
                        className2="pt-5"
                        placeholder="Upload your Cover Image"
                        {...register("coverImage", {
                            required: false,
                            validate: (file) => {
                                if (!file[0]) return true;
                                const allowedExtensions = [
                                    "image/jpeg",
                                    "image/png",
                                    "image/jpg",
                                ];
                                const fileType = file[0]?.type;
                                return allowedExtensions.includes(fileType)
                                    ? true
                                    : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                            },
                        })}
                    />
                    {errors.coverImage && (
                        <p className="text-red-600 px-2 mt-1">
                            {errors.coverImage.message}
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="mt-5 disabled:cursor-not-allowed py-2 rounded-lg"
                        bgColor={loading ? "bg-pink-800" : "bg-pink-600"}
                    >
                        {loading ? <span>{icons.loading}</span> : "Sign Up"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
