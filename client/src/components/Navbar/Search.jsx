import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoSearch } from "react-icons/go";
import Input from "../Input";
import Button from "../Button";

function Search() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        navigate(`/search/${data?.query}`);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center w-full max-w-lg"
        >
            <div className="relative flex-grow">
                <Input
                    className="rounded-l-3xl px-8"
                    placeholder="Search"
                    {...register("query", { required: true })}
                />
                <GoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200" />
            </div>
            <Button
                type="submit"
                bgColor="bg-zinc-800"
                className="rounded-r-3xl hover:bg-gray-500 transition-colors outline-none border-gray-200 border"
            >
                Search
            </Button>
        </form>
    );
}

export default Search;
