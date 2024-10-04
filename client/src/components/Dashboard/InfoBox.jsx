import React from "react";

function InfoBox({ title, value, icon }) {
    return (
        <div className="border p-4">
            <div className="mb-4 block">
                <span className="inline-block rounded-full bg-[#f8c3fa] p-1 text-pink-400">
                    {icon}
                </span>
            </div>
            <h6 className="text-gray-300">{title}</h6>
            <p className="text-3xl font-semibold">{value}</p>
        </div>
    );
}

export default InfoBox;
