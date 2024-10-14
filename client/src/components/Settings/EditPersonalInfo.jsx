import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { GoMail } from "react-icons/go";
import Button from "../Button";
import axiosInstance from "../../utils/axios.helper";
import { toast } from "react-toastify";
import { setUser } from "../../store/authSlice";

function EditPersonalInfo() {
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();

    const defaultValues = {
        fullName: userData.fullName,
        email: userData.email,
    };
    const [data, setData] = useState(defaultValues);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleSaveChange = async (data) => {
        try {
            const response = await axiosInstance.patch(
                `/users/update-account`,
                data
            );
            dispatch(setUser(response.data.data));
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Couldn't update account details. Try again!");
            console.log("Error while updating account details", error);
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-y-4 py-4">
            <div className="w-full sm:w-1/2 lg:w-1/3">
                <h5 className="font-semibold">Personal Info</h5>
                <p className="text-gray-300">
                    Update your photo and personal details.
                </p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-2/3">
                <form
                    onSubmit={handleSubmit(handleSaveChange)}
                    className="rounded-lg border"
                >
                    <div className="w-full px-4 py-2">
                        <label htmlFor="fullname" className="mb-1 inline-block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            className="w-full px-2 py-1.5 border rounded-lg bg-transparent"
                            placeholder="Enter your full name"
                            required
                            defaultValue={userData.fullName}
                            {...register("fullName", {
                                required: true,
                                maxLength: {
                                    value: 25,
                                    message:
                                        "Full name cannot exceed 25 characters",
                                },
                            })}
                            onChange={(e) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    fullName: e.target.value,
                                }))
                            }
                        />
                        {errors.fullName && (
                            <p className="text-red-600 px-2 mt-1">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div className="w-full px-4 py-2">
                        <label htmlFor="email" className="mb-1 inline-block">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-[59%] -translate-y-1/2 text-gray-300 h-5 w-5">
                                <GoMail className="" />
                            </div>
                            <input
                                placeholder="Enter your email address"
                                type="email"
                                id="email"
                                className="w-full pr-2 py-1.5 pl-10 border rounded-lg bg-transparent"
                                required
                                defaultValue={userData.email}
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
                                onChange={(e) =>
                                    setData((prevData) => ({
                                        ...prevData,
                                        email: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-600 px-2 mt-1 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <hr className="border border-gray-300 mt-2" />
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

export default EditPersonalInfo;
