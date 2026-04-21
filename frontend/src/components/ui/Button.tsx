import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary: [
    "bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-bold",
    "shadow-[0_4px_20px_rgba(255,183,131,0.2)]",
    "hover:shadow-[0_8px_30px_rgba(255,183,131,0.35)] active:scale-[0.98]",
  ].join(" "),
  secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
  ghost: "bg-transparent text-primary hover:bg-surface-container",
  danger: "bg-error/10 text-error hover:bg-error/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-4 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 font-label font-medium",
        "transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
