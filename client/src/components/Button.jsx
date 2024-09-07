import React from "react";

function Button({
    children,
    type = "button",
    bgColor = "bg-black",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            className={`px-4 py-1 ${className} ${textColor} ${bgColor}`}
            {...props}
            type={type}
        >
            {children}
        </button>
    );
}

export default Button;
