import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  cornerStyle?: "tl" | "tr" | "bl" | "br";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  cornerStyle = "br",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseClasses =
    "font-bold uppercase transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-primary-yellow text-black hover:bg-yellow-600 focus:ring-primary-yellow",
    secondary:
      "bg-primary-dark text-white hover:bg-gray-800 focus:ring-primary-dark",
    outline:
      "border-2 border-primary-yellow text-primary-yellow hover:bg-primary-yellow hover:text-black focus:ring-primary-yellow",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const cornerClasses = {
    tl: "rounded-tl",
    tr: "rounded-tr",
    bl: "rounded-bl",
    br: "rounded-br",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${cornerClasses[cornerStyle]}
        ${disabledClasses}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
