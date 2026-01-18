"use client";

import { useState } from "react";
import { Modal } from "@/_ui/components/modal";
import StyledFileInput from "@/_ui/components/forms/StyledFileInput";
import { IMovie } from "@/_models/entities/movie.interface";
import { api } from "@/_lib/axios";
import { AxiosError } from "axios";

interface ThumbnailUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: IMovie;
  onSuccess: (updatedMovie: IMovie) => void;
}

export function ThumbnailUploadModal({
  isOpen,
  onClose,
  movie,
  onSuccess,
}: ThumbnailUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("thumbnail", file);

      const response = await api.patch<IMovie>(`/movies/${movie.id}/thumbnail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess(response.data);
      handleClose();
    } catch (error: unknown) {
      console.error("Error uploading thumbnail:", error);
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message || "Failed to upload thumbnail");
      } else {
        setError("Failed to upload thumbnail");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Upload Thumbnail - ${movie.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <StyledFileInput
          label="Movie Thumbnail"
          accept="image/*"
          maxSizeMB={5}
          onFileChange={setFile}
          showPreview
        />

        {error && (
          <div className="rounded border border-red-500 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded bg-gray-700 px-4 py-2 font-medium text-gray-200 transition-colors hover:bg-gray-600"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload Thumbnail"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
