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
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import { Plus } from "lucide-react";
import { ShowFormModal } from "@/(features)/admin/shows/components/ShowFormModal";
import { IShow } from "@/_models/entities/show.interface";
import Link from "next/link";
import { AxiosError } from "axios";
import { formatDateTime, formatCurrency } from "@/_utils/dateUtils";

export default function AdminShowsPage() {
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState<IShow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<IShow | undefined>(undefined);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get<IShow[]>("/shows");
        setShows(res.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setShows([]);
        } else {
          console.error("Error fetching shows:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setSelectedShow(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (show: IShow) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShow(undefined);
  };

  const handleDeleteShow = async (showId: string) => {
    try {
      await api.delete(`/shows/${showId}`);
      setShows((prevShows) => prevShows.filter((show) => show.id !== showId));
    } catch (error) {
      console.error("Error deleting show:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const fetchShows = async () => {
    try {
      const res = await api.get<IShow[]>("/shows");
      setShows(res.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setShows([]);
      } else {
        console.error("Error fetching shows:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bungee text-2xl">Shows Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          Add Show
        </button>
      </div>

      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Movie</TableHeadCell>
            <TableHeadCell>Start Time</TableHeadCell>
            <TableHeadCell>End Time</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-gray-400">
                No shows were found. Create your first show to get started.
              </TableCell>
            </TableRow>
          ) : (
            shows.map((show) => (
              <TableRow key={show.id}>
                <TableCell>
                  <Link href="/admin/movies">{show.movie.title}</Link>
                </TableCell>
                <TableCell>{formatDateTime(show.startTime)}</TableCell>
                <TableCell>{formatDateTime(show.endTime)}</TableCell>
                <TableCell>{formatCurrency(show.price)}</TableCell>
                <TableCell>
                  {new Date(show.startTime) >= new Date() && (
                    <div className="flex gap-2">
                      <ActionButton variant="secondary" onClick={() => openEditModal(show)}>
                        Edit
                      </ActionButton>
                      <ActionButton variant="danger" onClick={() => handleDeleteShow(show.id)}>
                        Delete
                      </ActionButton>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>

      <ShowFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={async (data) => {
          try {
            if (selectedShow) {
              await api.patch(`/shows/${selectedShow.id}`, data);
            } else {
              await api.post("/shows", data);
            }
            await fetchShows();
          } catch (error) {
            console.error("Error saving show:", error);
          }
        }}
        show={selectedShow}
      />
    </div>
  );
}
