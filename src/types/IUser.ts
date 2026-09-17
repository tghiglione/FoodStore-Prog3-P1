import type { Rol } from "./Rol";

export interface IUser {
  email: string;
  loggedIn: boolean;
  role: Rol;
}

export interface IUserRegistrado {
  email: string;
  password: string;
  role: Rol;
}
