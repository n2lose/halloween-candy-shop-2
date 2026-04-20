import { InputHTMLAttributes, ReactNode, useId } from "react";

type InputProps = {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, icon, rightIcon, className = "", ...props }: InputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-label text-xs uppercase tracking-widest text-secondary transition-colors group-focus-within:text-tertiary"
        >
          {label}
        </label>
      )}
      <div className="group/input relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 pointer-events-none select-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={[
            "w-full bg-surface-container-lowest rounded-lg py-4 text-on-surface outline-none",
            "placeholder:text-outline/40 transition-all",
            "focus:ring-1 focus:ring-tertiary/40",
            error ? "ring-1 ring-error/50" : "",
            icon ? "pl-11 pr-5" : "px-5",
            rightIcon ? "pr-11" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 pointer-events-none select-none">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
