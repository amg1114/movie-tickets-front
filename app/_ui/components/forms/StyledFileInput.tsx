"use client";

import { forwardRef, useState, useRef, ChangeEvent } from "react";
import clsx from "clsx";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface StyledFileInputProps {
  label?: string;
  errors?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileChange?: (file: File | null) => void;
  showPreview?: boolean;
}

const StyledFileInput = forwardRef<HTMLInputElement, StyledFileInputProps>(
  ({ label, errors, accept = "image/*", maxSizeMB = 5, onFileChange, showPreview = true }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setError("");

      if (!file) {
        setPreview(null);
        onFileChange?.(null);
        return;
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        setPreview(null);
        onFileChange?.(null);
        return;
      }

      // Validate file type
      if (accept && !file.type.match(accept.replace("*", ".*"))) {
        setError("Invalid file type");
        setPreview(null);
        onFileChange?.(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onFileChange?.(file);
    };

    const clearFile = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setPreview(null);
      setError("");
      onFileChange?.(null);
    };

    return (
      <div className="flex flex-col">
        {label && (
          <label className="font-bungee mb-2" htmlFor="file-input">
            {label}
          </label>
        )}

        <div className="space-y-3">
          {/* File Input Button */}
          <div className="relative">
            <input
              ref={inputRef}
              type="file"
              id="file-input"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className={clsx(
                "flex cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 transition-colors",
                {
                  "border-gray-200 bg-white text-black hover:bg-gray-50": !errors && !error,
                  "border-red-500 bg-red-50 text-red-700": errors || error,
                }
              )}
            >
              <Upload className="h-5 w-5" />
              <span>{preview ? "Change File" : "Choose File"}</span>
            </label>
          </div>

          {/* Preview */}
          {showPreview && preview && (
            <div className="relative inline-block">
              <div className="relative h-48 w-48 overflow-hidden rounded-lg border border-gray-700">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white transition-colors hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {(errors || error) && <span className="mt-1 text-sm text-red-500">{errors || error}</span>}
      </div>
    );
  }
);

StyledFileInput.displayName = "StyledFileInput";

export default StyledFileInput;
