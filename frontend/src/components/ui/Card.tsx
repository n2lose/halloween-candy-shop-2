import { ReactNode } from "react";

type CardProps = {
  padding?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
};

const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

export default function Card({ padding = "md", children, className = "" }: CardProps) {
  return (
    <div className={`bg-surface-container-high rounded-xl ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
