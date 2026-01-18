import clsx from "clsx";
import { LoaderCircleIcon } from "lucide-react";
import { ReactNode } from "react";

export interface IFormFeedbackProps {
  status: "loading" | "success" | "error";
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  isSubmitting?: boolean;
}

export default function FormFeedback({
  status,
  successMessage,
  errorMessage,
}: IFormFeedbackProps) {
  return (
    <div
      className={clsx("p-4 rounded border text-center font-medium", {
        "text-red-500 bg-red-200 border-red-500": status === "error",
        "text-green-700 bg-green-200 border-green-700": status === "success",
        "text-blue-500 bg-blue-200 border-blue-500": status === "loading",
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
