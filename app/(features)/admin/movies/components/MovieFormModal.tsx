"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/_ui/components/modal";
import StyledInput from "@/_ui/components/forms/StyledInput";
import { IMovie } from "@/_models/entities/movie.interface";
import StyledDatePicker from "@/_ui/components/forms/StyledDatePicker";
import FormFeedback, { IFormFeedbackProps } from "@/_ui/components/forms/FormFeedback";
import { AxiosError } from "axios";

const movieSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  duration: z
    .number({ error: "Duration must be a number" })
    .min(1, { message: "Duration must be at least 1 minute" }),
  director: z.string().min(1, { message: "Director is required" }),
  releaseDate: z.string().min(1, { message: "Release date is required" }),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MovieFormData) => Promise<void>;
  movie?: IMovie;
}

export function MovieFormModal({ isOpen, onClose, onSubmit, movie }: MovieFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    status: IFormFeedbackProps["status"];
    error?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      director: "",
      releaseDate: "",
    },
  });

  useEffect(() => {
    if (movie) {
      reset({
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        director: movie.director,
        releaseDate: movie.releaseDate,
      });
    } else {
      reset({
        title: "",
        description: "",
        duration: 0,
        director: "",
        releaseDate: "",
      });
    }
  }, [movie, reset]);

  const handleFormSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);
    setSubmitState({ status: "loading" });
    try {
      await onSubmit(data);
      setSubmitState({ status: "success" });
      reset();
      setTimeout(() => {
        onClose();
        setSubmitState(null);
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        setSubmitState({ status: "error", error: error.response.data.message });
      } else {
        setSubmitState({ status: "error", error: "Failed to save movie. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitState(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={movie ? "Edit Movie" : "Add New Movie"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <StyledInput
          label="Movie Title"
          id="title"
          placeholder="Enter movie title"
          {...register("title")}
          errors={errors.title?.message}
        />
        <StyledInput
          label="Movie Description"
          id="description"
          placeholder="Enter movie description"
          {...register("description")}
          errors={errors.description?.message}
        />

        <StyledInput
          label="Duration (minutes)"
          id="duration"
          type="number"
          placeholder="Enter movie duration"
          {...register("duration", { valueAsNumber: true })}
          errors={errors.duration?.message}
        />

        <StyledInput
          label="Director"
          id="director"
          placeholder="Enter movie director"
          {...register("director")}
          errors={errors.director?.message}
        />

        <StyledDatePicker
          label="Release Date"
          id="releaseDate"
          placeholder="Enter movie release date"
          {...register("releaseDate")}
          errors={errors.releaseDate?.message}
        />

        {submitState && (
          <FormFeedback
            status={submitState.status}
            errorMessage={submitState.error}
            successMessage="Movie saved successfully!"
          />
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded bg-gray-700 px-4 py-2 font-medium text-gray-200 transition-colors hover:bg-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : movie ? "Update Movie" : "Create Movie"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
