import { IMovie } from "@/_models/entities/movie.interface";
import { FilmIcon } from "lucide-react";
import Image from "next/image";

export function MovieThumbnail({ movie }: { movie: IMovie }) {
  return (
    <figure className="aspect-3/4 w-full overflow-hidden rounded-lg bg-purple-500/20">
      {movie.thumbnailUrl && (
        <Image
          src={movie.thumbnailUrl}
          alt={movie.title}
          width={378}
          height={504}
          className="object-contain"
        />
      )}

      {!movie.thumbnailUrl && <FilmIcon className="text-3xl text-white" strokeWidth={2} />}
    </figure>
  );
}
