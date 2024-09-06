import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoSearch } from "react-icons/go";
import Input from "../Input";
import Button from "../Button";

function Search() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        console.log(data);
        navigate(`/search/${data?.query}`);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center w-full max-w-lg"
        >
            <div className="relative flex-grow">
                <Input
                    placeholder="Search"
                    {...register("query", { required: true })}
                />
                <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
                type="submit"
                className="w-full rounded-r-3xl hover:bg-gray-500 transition-colors"
            >
                Search
            </Button>
        </form>
    );
}

export default Search;
