import clsx from "clsx";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md";
}

export function ActionButton({
  children,
  variant = "primary",
  size = "sm",
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={clsx(
        "rounded font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none",
        {
          "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500":
            variant === "primary",
          "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500": variant === "danger",
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500": variant === "success",
          "px-3 py-1.5 text-xs": size === "sm",
          "px-4 py-2 text-sm": size === "md",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
