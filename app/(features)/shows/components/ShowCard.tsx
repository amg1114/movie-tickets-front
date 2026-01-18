import { IShow } from "@/_models/entities/show.interface";
import { inter } from "@/_ui/components/fonts";
import { CirclePlay, ClapperboardIcon, FilmIcon, TimerIcon, UserStarIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export interface IShowCardProps {
  show: IShow;
}
export default function ShowCard({ show }: IShowCardProps) {
  const { movie, room } = show;

  const details = [
    {
      label: movie.director,
      icon: <UserStarIcon />,
    },
    {
      label: room.name,
      icon: <ClapperboardIcon />,
    },
    {
      label: moment(show.startTime).calendar(null, {
        sameDay: "[Today] h:mm a",
        nextDay: "[Tomorrow] h:mm a",
        sameElse: "DD MMM h:mm a",
      }),
      icon: <CirclePlay />,
    },
    {
      label: `${movie.duration} mins`,
      icon: <TimerIcon />,
    },
  ];
  return (
    <div className="relative flex flex-col rounded-xl bg-purple-500/20 p-4 transition-colors hover:bg-white/10">
      <figure className="mb-4 flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-xl bg-purple-500/20">
        {movie.thumbnailUrl && (
          <Image
            src={movie.thumbnailUrl}
            alt={movie.title}
            width={300}
            height={400}
            className="object-cover"
          />
        )}
        {!movie.thumbnailUrl && <FilmIcon className="text-3xl text-white" strokeWidth={2} />}
      </figure>
      <Link
        href={`/shows/${show.id}`}
        className="font-bungee mb-2 transition-colors hover:text-purple-500"
      >
        {movie.title} <span className="absolute inset-0"></span>
      </Link>
      <p>{movie.description}</p>
      <ul>
        {details.map((detail, index) => (
          <li key={index} className={`mt-2 flex items-center gap-2 text-sm ${inter.className}`}>
            {detail.icon}
            <span>{detail.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
