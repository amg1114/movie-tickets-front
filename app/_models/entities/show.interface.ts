import { IMovie } from "@/_models/entities/movie.interface";
import { IRoom } from "@/_models/entities/room.interface";

export interface IShow {
  id: string;
  price: number;
  startTime: string;
  endTime: string;
  movie: IMovie;
  room: IRoom;
}
