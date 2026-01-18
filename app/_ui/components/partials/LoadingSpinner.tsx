import { LoaderCircleIcon } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center p-10">
      <LoaderCircleIcon className="animate-spin text-5xl" />
    </div>
  );
}
