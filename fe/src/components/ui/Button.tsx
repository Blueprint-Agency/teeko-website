import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    variant = "primary",
    size = "md",
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-2 border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-14 px-8 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

