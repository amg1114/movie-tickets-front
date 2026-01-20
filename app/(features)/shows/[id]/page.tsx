"use client";

import { BuyForm } from "@/(features)/shows/[id]/components/BuyForm";
import { MovieDetails } from "@/(features)/shows/[id]/components/MovieDetails";
import { MovieThumbnail } from "@/(features)/shows/[id]/components/MovieThumbnail";
import ShowDay from "@/(features)/shows/[id]/components/show-details/ShowDay";
import { ShowDetails } from "@/(features)/shows/[id]/components/show-details/ShowDetails";
import { api } from "@/_lib/axios";
import { IShow } from "@/_models/entities/show.interface";
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import { AxiosError } from "axios";
import { CalendarDaysIcon, TimerIcon, UserStarIcon } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowDetailPage() {
  const { id } = useParams();

  const [show, setShow] = useState<IShow | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      if (!id) return;

      try {
        const response = await api.get<IShow>(`/shows/${id}`);
        setShow(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            return notFound();
          }
          console.log("Error fetching show details axios:", error.cause);
        }

        throw error;
      }
    };

    fetchShow();
  }, [id]);

  if (!show) {
    return <LoadingSpinner />;
  }

  const { movie } = show;

  const releaseDate = new Date(movie.releaseDate);
  const startTime = new Date(show.startTime);

  const details = [
    {
      label: movie.director,
      icon: <UserStarIcon className="text-2xl" strokeWidth={2.5} />,
    },
    { label: `${movie.duration} min`, icon: <TimerIcon className="text-2xl" strokeWidth={2.5} /> },
    {
      label: releaseDate.getFullYear().toString(),
      icon: <CalendarDaysIcon className="text-2xl" strokeWidth={2.5} />,
    },
  ];
  return (
    <div className="my-auto flex w-full flex-col gap-4 md:flex-row md:gap-8">
      <aside className="flex flex-1 flex-col gap-8">
        <MovieThumbnail movie={movie} />
        <MovieDetails details={details} />
      </aside>

      <div className="flex shrink-0 flex-col gap-8 md:w-3/5">
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold uppercase">{movie.title}</h1>
          <p className="text-xl">{movie.description}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="mb-2 text-2xl font-bold uppercase">Show details</h2>
          <div className="flex w-full flex-wrap items-start gap-8 md:flex-nowrap">
            <ShowDay startTime={startTime} />
            <ShowDetails show={show} />
          </div>
        </section>

        <section className="mt-auto flex flex-col gap-8">
          <BuyForm show={show} />
        </section>
      </div>
    </div>
  );
}
