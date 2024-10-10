import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoCloudUploadOutline } from "react-icons/io5";
import axiosInstance from "../utils/axios.helper";
import { setUser } from "../store/authSlice";
import Button from "../components/Button";
import EditPersonalInfo from "../components/Settings/EditPersonalInfo";
import EditChannelInfo from "../components/Settings/EditChannelInfo";
import ChangePassword from "../components/Settings/ChangePassword";
import streamify_cover from "../assets/Streamify_Cover.png"

function Settings() {
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
    } = useForm();

    const uploadCoverImage = async (data) => {
        const formData = new FormData();
        formData.append("coverImage", data.coverImage[0]);
        try {
            const response = await axiosInstance.patch(
                "/users/cover-image",
                formData
            );
            if (response.data?.data?.coverImage) {
                dispatch(
                    setUser({
                        ...userData,
                        coverImage: response.data.data.coverImage,
                    })
                );
                toast.success("Cover image updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
            console.log("Error while updating cover image", error);
        }
    };

    const uploadAvatar = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        try {
            const response = await axiosInstance.patch(
                "/users/avatar",
                formData
            );
            if (response.data?.data?.coverImage) {
                dispatch(
                    setUser({ ...userData, avatar: response.data.data.avatar })
                );
                toast.success("Profile image updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
            console.log("Error while updating profile image", error);
        }
    };

    return (
        <section className="w-full">
            <div className="relative min-h-[150px] w-full pt-[20%]">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={userData.coverImage || streamify_cover}
                        alt="cover-image"
                        className="object-cover"
                    />
                </div>
                <form
                    onChange={handleSubmit(uploadCoverImage)}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <input
                        id="cover-image"
                        type="file"
                        className="hidden"
                        required
                        {...register("coverImage", {
                            required: true,
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
                    {errors.coverImage &&
                        toast.error(errors.coverImage.message)}
                    <label
                        htmlFor="cover-image"
                        className="inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/50 p-1 text-gray-500 hover:bg-white"
                    >
                        <IoCloudUploadOutline className="text-pink-500 w-8 h-8" />
                    </label>
                </form>
            </div>
            <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-4 pb-4 pt-6">
                    <div className="relative -mt-12 inline-block h-32 w-32 shrink-0 overflow-hidden rounded-full border-2">
                        <img
                            src={userData.avatar}
                            alt="image"
                            className="h-full w-full object-cover"
                        />
                        <form
                            onChange={handleSubmit2(uploadAvatar)}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <input
                                id="profile-image"
                                type="file"
                                className="hidden"
                                required
                                {...register2("avatar", {
                                    required: true,
                                    validate: (file) => {
                                        if (!file[0]) return true;
                                        const allowedExtensions = [
                                            "image/jpeg",
                                            "image/png",
                                            "image/jpg",
                                        ];
                                        const fileType = file[0]?.type;
                                        return allowedExtensions.includes(
                                            fileType
                                        )
                                            ? true
                                            : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                                    },
                                })}
                            />
                            {errors2.avatar &&
                                toast.error(errors2.avatar.message)}
                            <label
                                htmlFor="profile-image"
                                className="inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/50 p-1 text-gray-500 hover:bg-white"
                            >
                                <IoCloudUploadOutline className="text-pink-500 w-6 h-6" />
                            </label>
                        </form>
                    </div>
                    <div className="mr-auto inline-block">
                        <h1 className="font-bold text-xl">
                            {userData.fullName}
                        </h1>
                        <p className="text-sm text-gray-400">
                            @{userData.username}
                        </p>
                    </div>
                    <div className="inline-block">
                        <Button
                            onClick={() =>
                                navigate(`/channel/${userData.username}`)
                            }
                            className="mr-1 font-semibold transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] rounded-md hover:bg-pink-600"
                            bgColor="bg-pink-700"
                        >
                            View Channel
                        </Button>
                    </div>
                </div>
                <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">
                    <li key="personal-info" className="w-full">
                        <Button
                            onClick={() => setCurrentTab(0)}
                            className={`w-full border-b-2 transition-all duration-100 ${
                                currentTab === 0
                                    ? "border-[#e14bc8] text-[#e14bc8] bg-white"
                                    : "border-transparent text-gray-400"
                            }`}
                            bgColor=""
                            textColor=""
                        >
                            Personal Information
                        </Button>
                    </li>
                    <li key="channel-info" className="w-full">
                        <Button
                            onClick={() => setCurrentTab(1)}
                            className={`w-full border-b-2 transition-all duration-100 ${
                                currentTab === 1
                                    ? "border-[#e14bc8] text-[#e14bc8] bg-white"
                                    : "border-transparent text-gray-400"
                            }`}
                            bgColor=""
                            textColor=""
                        >
                            Channel Information
                        </Button>
                    </li>
                    <li key="change-pwd" className="w-full">
                        <Button
                            onClick={() => setCurrentTab(2)}
                            className={`w-full border-b-2 transition-all duration-100 ${
                                currentTab === 2
                                    ? "border-[#e14bc8] text-[#e14bc8] bg-white"
                                    : "border-transparent text-gray-400"
                            }`}
                            bgColor=""
                            textColor=""
                        >
                            Change Password
                        </Button>
                    </li>
                </ul>
                {currentTab === 0 && <EditPersonalInfo />}
                {currentTab === 1 && <EditChannelInfo />}
                {currentTab === 2 && <ChangePassword />}
            </div>
        </section>
    );
}

export default Settings;
