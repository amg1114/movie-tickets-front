"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/_ui/components/modal";
import StyledInput from "@/_ui/components/forms/StyledInput";
import StyledSelect from "@/_ui/components/forms/StyledSelect";
import StyledDateTimePicker from "@/_ui/components/forms/StyledDateTimePicker";
import { IShow } from "@/_models/entities/show.interface";
import { IMovie } from "@/_models/entities/movie.interface";
import { IRoom } from "@/_models/entities/room.interface";
import { api } from "@/_lib/axios";

const showSchema = z.object({
  movieId: z.string().min(1, { message: "Movie is required" }),
  roomId: z.string().min(1, { message: "Room is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  price: z
    .number({ error: "Price must be a number" })
    .min(0, { message: "Price must be at least 0" }),
});

type ShowFormData = z.infer<typeof showSchema>;

interface ShowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShowFormData) => Promise<void>;
  show?: IShow;
}

export function ShowFormModal({ isOpen, onClose, onSubmit, show }: ShowFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShowFormData>({
    resolver: zodResolver(showSchema),
    defaultValues: {
      movieId: "",
      roomId: "",
      startTime: "",
      price: 0,
    },
  });

  // Fetch movies and rooms for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          api.get<IMovie[]>("/movies"),
          api.get<IRoom[]>("/rooms"),
        ]);
        setMovies(moviesRes.data);
        setRooms(roomsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Reset form with show data when show prop changes
  useEffect(() => {
    if (show) {
      reset({
        movieId: show.movie.id,
        roomId: show.room.id,
        startTime: new Date(show.startTime).toISOString().slice(0, 16),
        price: show.price,
      });
    } else {
      reset({
        movieId: "",
        roomId: "",
        startTime: "",
        price: 0,
      });
    }
  }, [show, reset]);

  const handleFormSubmit = async (data: ShowFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={show ? "Edit Show" : "Add New Show"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <StyledSelect
          label="Movie"
          id="movieId"
          options={[
            { value: "", label: "Select a movie" },
            ...movies.map((movie) => ({ value: movie.id, label: movie.title })),
          ]}
          {...register("movieId")}
          errors={errors.movieId?.message}
        />

        <StyledSelect
          label="Room"
          id="roomId"
          options={[
            { value: "", label: "Select a room" },
            ...rooms.map((room) => ({ value: room.id, label: room.name })),
          ]}
          {...register("roomId")}
          errors={errors.roomId?.message}
        />

        <StyledDateTimePicker
          label="Start Time"
          id="startTime"
          {...register("startTime")}
          errors={errors.startTime?.message}
        />

        <StyledInput
          label="Price"
          id="price"
          type="number"
          step="0.01"
          placeholder="Enter price"
          {...register("price", { valueAsNumber: true })}
          errors={errors.price?.message}
        />

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
            {isSubmitting ? "Saving..." : show ? "Update Show" : "Create Show"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
