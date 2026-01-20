"use client";

import { useState } from "react";
import { Modal } from "@/_ui/components/modal";
import StyledFileInput from "@/_ui/components/forms/StyledFileInput";
import { IMovie } from "@/_models/entities/movie.interface";
import { api } from "@/_lib/axios";
import { AxiosError } from "axios";
import FormFeedback, { IFormFeedbackProps } from "@/_ui/components/forms/FormFeedback";

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
  const [submitState, setSubmitState] = useState<{
    status: IFormFeedbackProps["status"];
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setSubmitState({ status: "error", error: "Please select a file" });
      return;
    }

    setIsUploading(true);
    setSubmitState({ status: "loading" });

    try {
      const formData = new FormData();
      formData.append("thumbnail", file);

      const response = await api.patch<IMovie>(`/movies/${movie.id}/thumbnail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitState({ status: "success" });
      onSuccess(response.data);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error: unknown) {
      console.error("Error uploading thumbnail:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        setSubmitState({ status: "error", error: error.response.data.message });
      } else {
        setSubmitState({ status: "error", error: "Failed to upload thumbnail. Please try again." });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setSubmitState(null);
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

        {submitState && (
          <FormFeedback
            status={submitState.status}
            errorMessage={submitState.error}
            successMessage="Thumbnail uploaded successfully!"
          />
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
