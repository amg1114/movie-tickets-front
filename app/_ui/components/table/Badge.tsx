import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-700 text-gray-200": variant === "default",
          "bg-green-900/50 text-green-300": variant === "success",
          "bg-red-900/50 text-red-300": variant === "error",
          "bg-yellow-900/50 text-yellow-300": variant === "warning",
          "bg-blue-900/50 text-blue-300": variant === "info",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
