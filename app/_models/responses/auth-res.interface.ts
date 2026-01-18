import { IUser } from "@/_models/entities/user.interface";

export interface IAuthResponse {
  access_token: string;
  user: IUser;
}
