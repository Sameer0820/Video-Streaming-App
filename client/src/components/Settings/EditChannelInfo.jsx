import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { toast } from "react-toastify";
import { setUser } from "../../store/authSlice";
import axiosInstance from "../../utils/axios.helper";

function EditChannelInfo() {
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();

    const defaultValues = {
        username: userData?.username || "",
        description: userData.description || "",
    };
    const [data, setData] = useState(defaultValues);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleSaveChange = async (newData) => {
        if (defaultValues.username === newData?.username) {
            newData = { ...newData, username: "" };
        }
        try {
            const response = await axiosInstance.patch(
                `/users/update-account`,
                newData
            );
            dispatch(setUser(response.data.data));
            toast.success(response.data.message);
        } catch (error) {
            if (error.status === 409) {
                toast.error("Username already exists");
            } else {
                toast.error("Couldn't update account details. Try again!");
            }
            console.log("Error while updating account details", error);
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-y-4 py-4">
            <div className="w-full sm:w-1/2 lg:w-1/3">
                <h5 className="font-semibold">Channel Info</h5>
                <p className="text-gray-300">Update your channel details.</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-2/3">
                <form
                    onSubmit={handleSubmit(handleSaveChange)}
                    className="rounded-lg border"
                >
                    <div className="w-full px-4 py-2">
                        <label htmlFor="username" className="mb-1 inline-block">
                            Username
                        </label>
                        <div className="flex rounded-lg border">
                            <p className="flex shrink-0 items-center border-r border-white px-3 align-middle">
                                streamify.com/
                            </p>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-2 py-1.5 bg-transparent"
                                placeholder="Enter your username"
                                required
                                defaultValue={userData.username}
                                {...register("username", {
                                    required: true,
                                    maxLength: {
                                        value: 25,
                                        message:
                                            "User name cannot exceed 25 characters",
                                    },
                                })}
                                onChange={(e) =>
                                    setData((prevData) => ({
                                        ...prevData,
                                        username: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-600 px-2 mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="w-full px-4 py-2">
                        <label htmlFor="desc" className="mb-1 inline-block">
                            Description
                        </label>
                        <div className="relative">
                            <textarea
                                placeholder="Enter your channel description"
                                name="desc"
                                type="text"
                                className="w-full px-2 py-1.5 border rounded-lg bg-transparent"
                                rows="3"
                                defaultValue={userData.description}
                                {...register("description", {
                                    maxLength: {
                                        value: 200,
                                        message:
                                            "Description cannot exceed 200 characters",
                                    },
                                })}
                                onChange={(e) =>
                                    setData((prevData) => ({
                                        ...prevData,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        {errors.description && (
                            <p className="text-red-600 px-2 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    <hr className="border border-gray-300 mt-1" />
                    <div className="flex items-center justify-end gap-4 p-4">
                        <Button
                            onClick={() => {
                                reset();
                                setData(defaultValues);
                            }}
                            disabled={
                                JSON.stringify(data) ===
                                JSON.stringify(defaultValues)
                            }
                            className="inline-block rounded-lg border hover:bg-white/10 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                JSON.stringify(data) ===
                                JSON.stringify(defaultValues)
                            }
                            className="inline-block rounded-lg font-semibold hover:bg-pink-600 disabled:cursor-not-allowed"
                            bgColor="bg-pink-700"
                            textColor="text-black"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditChannelInfo;
