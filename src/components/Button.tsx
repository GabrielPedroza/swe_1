// components/Button.tsx

import React from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button = ({
  onClick,
  type = "button",
  disabled = false,
  children,
  className = "",
}: ButtonProps) => (
  <button
    onClick={onClick}
    type={type}
    disabled={disabled}
    className={`rounded-md bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700 ${
      disabled ? "cursor-not-allowed bg-gray-200" : ""
    } ${className}`}
  >
    {children}
  </button>
);

export default Button;
