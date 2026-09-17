import type { IUser, IUserRegistrado } from "../types/IUser";
import type { Rol } from "../types/Rol";
import {
  getUSer,
  getUsers,
  removeUser,
  saveUser,
  saveUsers,
} from "./localStorage";
import { navigate, ROUTES } from "./navigate";


const ADMIN_POR_DEFECTO: IUserRegistrado = {
  email: "admin@gmail.com",
  password: "admin123",
  role: "admin",
};

export const seedAdmin = (): void => {
  const users = getUsers();

  const existeAdmin = users.some(
    (user) => user.email === ADMIN_POR_DEFECTO.email
  );
  if (existeAdmin) return;

  users.push(ADMIN_POR_DEFECTO);
  saveUsers(users);
};


export const registerUser = (
  email: string,
  password: string
): IUserRegistrado => {
  const emailLimpio = email.trim().toLowerCase();

  if (!emailLimpio || !password) {
    throw new Error("Completá el email y la contraseña");
  }

  const users = getUsers();
  const yaExiste = users.some((user) => user.email === emailLimpio);
  if (yaExiste) {
    throw new Error("Ese email ya está registrado");
  }

  const nuevoUsuario: IUserRegistrado = {
    email: emailLimpio,
    password,
    role: "client",
  };

  users.push(nuevoUsuario);
  saveUsers(users);

  return nuevoUsuario;
};

export const loginUser = (email: string, password: string): IUser => {
  const emailLimpio = email.trim().toLowerCase();

  if (!emailLimpio || !password) {
    throw new Error("Completá el email y la contraseña");
  }

  const users = getUsers();
  const usuarioEncontrado = users.find(
    (user) => user.email === emailLimpio && user.password === password
  );

  if (!usuarioEncontrado) {
    throw new Error("Email o contraseña incorrectos");
  }

  const sesion: IUser = {
    email: usuarioEncontrado.email,
    role: usuarioEncontrado.role,
    loggedIn: true,
  };

  saveUser(sesion);

  return sesion;
};

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
) => {
  const user = getUSer();

  if (!user) {
    navigate(redireccion1);
    return;
  }

  const parseUser: IUser = JSON.parse(user);

  if (!parseUser.loggedIn) {
    navigate(redireccion1);
    return;
  }

  if (parseUser.role !== rol) {
    navigate(redireccion2);
    return;
  }
};

export const logout = () => {
  removeUser();
  navigate(ROUTES.LOGIN);
};
