/** @format */

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function IconButton({
  icon,
  label,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantClasses = {
    default: "hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
    danger: "hover:bg-red-100",
  };

  return (
    <button
      className={`shrink-0 ${sizeClasses[size]} flex items-center justify-center rounded-full transition-colors cursor-pointer ${variantClasses[variant]} ${className}`}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
