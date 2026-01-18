import { IShow } from "@/_models/entities/show.interface";
import { IUser } from "@/_models/entities/user.interface";

export interface ITicket {
  id: string;
  quantity: string;
  total_amount: number;
  payment_method: string;
  status: string;
  user: IUser;
  show: IShow;
}
