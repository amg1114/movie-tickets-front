import { IMovie } from "@/_models/entities/movie.interface";
import { IRoom } from "@/_models/entities/room.interface";

export interface IShow {
  id: string;
  price: number;
  startTime: Date;
  endTime: Date;
  movie: IMovie;
  room: IRoom;
}
