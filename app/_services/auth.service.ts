import { api } from "@/_lib/axios";
import { ILoginRequest, IRegisterRequest } from "@/_models/requests/auth-req.interface";
import { IAuthResponse } from "@/_models/responses/auth-res.interface";

export function login(data: ILoginRequest) {
  return api.post<IAuthResponse>("/auth/login", data);
}

export function register(data: IRegisterRequest) {
  return api.post<IAuthResponse>("/auth/register", data);
}
