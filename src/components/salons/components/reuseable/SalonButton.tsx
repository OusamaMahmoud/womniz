import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // Text to display inside the button
  variant?: string; // Button style variant
  isLoading?: boolean; // Show a loading indicator if true
  icon: React.ReactNode;
}

const SalonButton: React.FC<ButtonProps> = ({
  label,
  variant,
  isLoading = false,
  icon = "",
  ...props
}) => {
  return (
    <button
      className={`flex btn ${variant} ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
      {...props}
    >
      {icon}
      {isLoading ? "Loading..." : label}
    </button>
  );
};

export default SalonButton;
