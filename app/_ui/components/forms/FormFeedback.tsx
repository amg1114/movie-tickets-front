import clsx from "clsx";
import { LoaderCircleIcon } from "lucide-react";
import { ReactNode } from "react";

export interface IFormFeedbackProps {
  status: "loading" | "success" | "error";
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  isSubmitting?: boolean;
}

export default function FormFeedback({ status, successMessage, errorMessage }: IFormFeedbackProps) {
  return (
    <div
      className={clsx("rounded border p-4 text-center font-medium", {
        "border-red-500 bg-red-200 text-red-500": status === "error",
        "border-green-700 bg-green-200 text-green-700": status === "success",
        "border-blue-500 bg-blue-200 text-blue-500": status === "loading",
      })}
    >
      {status === "error" && errorMessage}

      {status === "success" && successMessage}

      {status === "loading" && (
        <LoaderCircleIcon className="mx-auto animate-spin stroke-3 text-xl" />
      )}
    </div>
  );
}
