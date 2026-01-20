"use client";

import { MovieFormModal } from "@/(features)/admin/movies/components/MovieFormModal";
import { ThumbnailUploadModal } from "@/(features)/admin/movies/components/ThumbnailUploadModal";
import { api } from "@/_lib/axios";
import { IMovie } from "@/_models/entities/movie.interface";
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import {
  StyledTable,
  TableHeader,
  TableRow,
  TableHeadCell,
  TableBody,
  TableCell,
} from "@/_ui/components/table";
import { ActionButton } from "@/_ui/components/table/ActionButton";
import { formatDate } from "@/_utils/dateUtils";
import { AxiosError } from "axios";
import { FilmIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MoviesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | undefined>(undefined);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get<IMovie[]>("/movies");
        setMovies(res.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setMovies([]);
        } else {
          console.error("Error fetching movies:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const openCreateModal = () => {
    setSelectedMovie(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: IMovie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const openThumbnailModal = (movie: IMovie) => {
    setSelectedMovie(movie);
    setIsThumbnailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  };

  const closeThumbnailModal = () => {
    setIsThumbnailModalOpen(false);
    setSelectedMovie(undefined);
  };

  const handleThumbnailSuccess = (updatedMovie: IMovie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie))
    );
  };

  const fetchMovies = async () => {
    try {
      const res = await api.get<IMovie[]>("/movies");
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    try {
      await api.delete(`/movies/${movieId}`);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          Add Movie
        </button>
      </div>

      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Thumbnail</TableHeadCell>
            <TableHeadCell>Details</TableHeadCell>
            <TableHeadCell>Duration</TableHeadCell>
            <TableHeadCell>Release</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell className="text-center">
                {movie.thumbnailUrl && (
                  <Image
                    src={movie.thumbnailUrl}
                    alt={movie.title}
                    width={50}
                    height={75}
                    className="mx-auto cursor-pointer rounded-md object-cover"
                  />
                )}
                {!movie.thumbnailUrl && <FilmIcon className="mx-auto text-3xl" />}
              </TableCell>
              <TableCell>
                <h3 className="font-bold">{movie.title}</h3>
                <p>
                  {movie.description} <br />
                  <span className="text-end italic">{movie.director}</span>{" "}
                </p>
              </TableCell>
              <TableCell>{movie.duration}</TableCell>
              <TableCell>{formatDate(movie.releaseDate)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <ActionButton variant="secondary" onClick={() => openEditModal(movie)}>
                    Edit
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDeleteMovie(movie.id)}>
                    Delete
                  </ActionButton>
                  <ActionButton variant="primary" onClick={() => openThumbnailModal(movie)}>
                    Upload Thumbnail
                  </ActionButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
      <MovieFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        movie={selectedMovie}
        onSubmit={async (data) => {
          try {
            if (selectedMovie) {
              // Update existing room
              await api.patch(`/movies/${selectedMovie.id}`, data);
            } else {
              // Create new room
              await api.post("/movies", data);
            }
            await fetchMovies();
          } catch (error) {
            console.error("Error saving room:", error);
          }
        }}
      />
      {selectedMovie && (
        <ThumbnailUploadModal
          isOpen={isThumbnailModalOpen}
          onClose={closeThumbnailModal}
          movie={selectedMovie}
          onSuccess={handleThumbnailSuccess}
        />
      )}
    </>
  );
}
