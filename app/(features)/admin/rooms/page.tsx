"use client";

import {
  StyledTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@/_ui/components/table";
import { ActionButton } from "@/_ui/components/table/ActionButton";
import { useEffect, useState } from "react";
import { api } from "@/_lib/axios";
import { IRoom } from "@/_models/entities/room.interface";
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import { Plus } from "lucide-react";
import { RoomFormModal } from "@/(features)/admin/rooms/components/RoomFormModal";
import { AxiosError } from "axios";

export default function RoomsPage() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | undefined>(undefined);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get<IRoom[]>("/rooms");
        setRooms(res.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setRooms([]);
        } else {
          console.error("Error fetching rooms:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setSelectedRoom(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (room: IRoom) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(undefined);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await api.delete(`/rooms/${roomId}`);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const fetchRooms = async () => {
    try {
      const res = await api.get<IRoom[]>("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bungee text-2xl">Rooms Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          Add Room
        </button>
      </div>

      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            <TableHeadCell>Capacity</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-gray-400">
                No rooms were found. Create your first room to get started.
              </TableCell>
            </TableRow>
          ) : (
            rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.description}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ActionButton variant="secondary" onClick={() => openEditModal(room)}>
                      Edit
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDeleteRoom(room.id)}>
                      Delete
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>

      <RoomFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        room={selectedRoom}
        onSubmit={async (data) => {
          try {
            if (selectedRoom) {
              // Update existing room
              await api.patch(`/rooms/${selectedRoom.id}`, data);
            } else {
              // Create new room
              await api.post("/rooms", data);
            }
            await fetchRooms();
          } catch (error) {
            console.error("Error saving room:", error);
          }
        }}
      />
    </div>
  );
}
