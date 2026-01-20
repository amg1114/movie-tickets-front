"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/_ui/components/modal";
import StyledInput from "@/_ui/components/forms/StyledInput";

import { IShow } from "@/_models/entities/show.interface";
import StyledSelect from "@/_ui/components/forms/StyledSelect";
import { IMovie } from "@/_models/entities/movie.interface";
import { IRoom } from "@/_models/entities/room.interface";
import { api } from "@/_lib/axios";

const roomSchema = z.object({
  price: z
    .number({ error: "Price must be a number" })
    .min(0, { message: "Price must be at least 0" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  movie: z.string().min(1, { message: "Movie is required" }),
  room: z.string().min(1, { message: "Room is required" }),
});

type ShowFormData = z.infer<typeof roomSchema>;

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
    resolver: zodResolver(roomSchema),
    defaultValues: {
      price: 0,
      startTime: "",
      movie: "",
      room: "",
    },
  });

  useEffect(() => {
    const fetchMoviesAndRooms = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          api.get<IMovie[]>("/movies"),
          api.get<IRoom[]>("/rooms"),
        ]);

        const moviesData = moviesRes.data;
        const roomsData = roomsRes.data;

        setMovies(moviesData);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching movies or rooms:", error);
      }
    };

    fetchMoviesAndRooms();
  }, []);

  // Reset form with room data when room prop changes
  useEffect(() => {
    if (show) {
      reset({
        price: show.price,
        startTime: show.startTime.toISOString().slice(0, 16),
        movie: show.movie.id,
        room: show.room.id,
      });
    } else {
      reset({
        price: 0,
        startTime: "",
        movie: "",
        room: "",
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
          {...register("movie")}
          options={movies.map((movie) => ({ value: movie.id, label: movie.title }))}
        />
        <StyledSelect
          label="Room"
          {...register("room")}
          options={rooms.map((room) => ({ value: room.id, label: room.name }))}
        />
        <StyledInput
          label="Price"
          type="number"
          {...register("price")}
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
            {isSubmitting ? "Saving..." : show ? "Update Room" : "Create Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
