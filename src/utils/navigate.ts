export const navigate = (route: string) => {
  window.location.href = route;
};

// Rutas de la app 
export const ROUTES = {
  LOGIN: "/src/pages/auth/login/login.html",
  REGISTRO: "/src/pages/auth/registro/registro.html",
  ADMIN_HOME: "/src/pages/admin/home/home.html",
  CLIENT_HOME: "/src/pages/client/home/home.html",
  CLIENT_CART: "/src/pages/client/cart/cart.html",
} as const;
