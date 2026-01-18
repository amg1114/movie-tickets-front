import { IUser } from "../entities/user.interface";

export interface IAuthResponse {
  access_token: string;
  user: IUser;
}
