import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper";

function ChangePassword() {
    const defaultValues = {
        oldPassword: "",
        newPassword: "",
        confPassword: "",
    };
    const [data, setData] = useState(defaultValues);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleSaveChange = async (newdata) => {
        if (data?.newPassword !== data?.confPassword) {
            toast.error("Confirm Password not matching");
            return;
        }
        try {
            const response = await axiosInstance.post(
                `/users/change-password`,
                newdata
            );
            toast.success(response.data.message);
        } catch (error) {
            if (error.status === 400) {
                toast.error("Invalid current password");
            } else {
                toast.error("Couldn't update password. Try again!");
            }
            console.log("Error while updating password", error);
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-y-4 py-4">
            <div className="w-full sm:w-1/2 lg:w-1/3">
                <h5 className="font-semibold">Password</h5>
                <p className="text-gray-300">Update your password</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-2/3">
                <form
                    onSubmit={handleSubmit(handleSaveChange)}
                    className="rounded-lg border"
                >
                    <div className="w-full px-4 py-2">
                        <label htmlFor="old-pwd" className="mb-1 inline-block">
                            Current password
                        </label>
                        <input
                            type="password"
                            id="old-pwd"
                            className="w-full px-2 py-1.5 border rounded-lg bg-transparent"
                            placeholder="Enter your current password"
                            required
                            {...register("oldPassword", { required: true })}
                            onChange={(e) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    oldPassword: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="w-full px-4 py-2">
                        <label htmlFor="new-pwd" className="mb-1 inline-block">
                            New Password
                        </label>
                        <input
                            placeholder="Enter your new password"
                            type="password"
                            className="w-full px-2 py-1.5 border rounded-lg bg-transparent"
                            required
                            {...register("newPassword", {
                                required: true,
                                validate: {
                                    passLength: (value) =>
                                        value.length > 8 ||
                                        "Password must be more than 8 characters",
                                },
                            })}
                            onChange={(e) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    newPassword: e.target.value,
                                }))
                            }
                        />
                        {errors.newPassword && (
                            <p className="text-red-600 px-2 mt-0.5 text-sm">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full px-4 py-2">
                        <label htmlFor="cnf-pwd" className="mb-1 inline-block">
                            Confirm Password
                        </label>
                        <input
                            placeholder="Confirm password"
                            type="password"
                            className="w-full px-2 py-1.5 border rounded-lg bg-transparent"
                            required
                            onChange={(e) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    confPassword: e.target.value,
                                }))
                            }
                        />
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
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
