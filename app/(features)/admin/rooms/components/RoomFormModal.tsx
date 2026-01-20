"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/_ui/components/modal";
import StyledInput from "@/_ui/components/forms/StyledInput";
import { IRoom } from "@/_models/entities/room.interface";
import FormFeedback, { IFormFeedbackProps } from "@/_ui/components/forms/FormFeedback";
import { AxiosError } from "axios";

const roomSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  capacity: z
    .number({ error: "Capacity must be a number" })
    .min(1, { message: "Capacity must be at least 1" }),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoomFormData) => Promise<void>;
  room?: IRoom;
}

export function RoomFormModal({ isOpen, onClose, onSubmit, room }: RoomFormModalProps) {
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
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 0,
    },
  });

  // Reset form with room data when room prop changes
  useEffect(() => {
    if (room) {
      reset({
        name: room.name,
        description: room.description,
        capacity: room.capacity,
      });
    } else {
      reset({
        name: "",
        description: "",
        capacity: 0,
      });
    }
  }, [room, reset]);

  const handleFormSubmit = async (data: RoomFormData) => {
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
        setSubmitState({ status: "error", error: "Failed to save room. Please try again." });
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
      title={room ? "Edit Room" : "Add New Room"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <StyledInput
          label="Room Name"
          id="name"
          placeholder="Enter room name"
          {...register("name")}
          errors={errors.name?.message}
        />
        <StyledInput
          label="Room Description"
          id="description"
          placeholder="Enter room description"
          {...register("description")}
          errors={errors.description?.message}
        />

        <StyledInput
          label="Capacity"
          id="capacity"
          type="number"
          placeholder="Enter room capacity"
          {...register("capacity", { valueAsNumber: true })}
          errors={errors.capacity?.message}
        />

        {submitState && (
          <FormFeedback
            status={submitState.status}
            errorMessage={submitState.error}
            successMessage="Room saved successfully!"
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
            {isSubmitting ? "Saving..." : room ? "Update Room" : "Create Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
