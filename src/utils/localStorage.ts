import type { IUser, IUserRegistrado } from "../types/IUser";

const USER_KEY = "userData";
const USERS_KEY = "users";

export const saveUser = (user: IUser) => {
  const parseUser = JSON.stringify(user);
  localStorage.setItem(USER_KEY, parseUser);
};

export const getUSer = () => {
  return localStorage.getItem(USER_KEY);
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getUsers = (): IUserRegistrado[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) return [];

  try {
    const parseUsers: unknown = JSON.parse(data);
    return Array.isArray(parseUsers) ? (parseUsers as IUserRegistrado[]) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: IUserRegistrado[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
