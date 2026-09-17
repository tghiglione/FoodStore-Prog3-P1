import type { Rol } from "./types/Rol";
import { checkAuhtUser, seedAdmin } from "./utils/auth";
import { ROUTES } from "./utils/navigate";

const HOME_POR_ROL: Record<Rol, string> = {
  admin: ROUTES.ADMIN_HOME,
  client: ROUTES.CLIENT_HOME,
};

const getRolRequerido = (path: string): Rol | null => {
  if (path.includes("/admin/")) return "admin";
  if (path.includes("/client/")) return "client";
  return null;
};


const protegerRuta = (): void => {
  const rolRequerido = getRolRequerido(window.location.pathname);

  if (!rolRequerido) return;

  const rolContrario: Rol = rolRequerido === "admin" ? "client" : "admin";

  checkAuhtUser(ROUTES.LOGIN, HOME_POR_ROL[rolContrario], rolRequerido);
};


export const initApp = (): void => {
  seedAdmin();
  protegerRuta();
};
