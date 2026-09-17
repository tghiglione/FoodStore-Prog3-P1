import type { ICartItem, IProduct } from "../types/product";

// Clave de localStorage para el carrito 
const CART_KEY = "cart";

//  localStorage

export const getCartItems = (): ICartItem[] => {
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];

  try {
    const parseCart: unknown = JSON.parse(data);
    return Array.isArray(parseCart) ? (parseCart as ICartItem[]) : [];
  } catch {
    return [];
  }
};

const saveCartItems = (items: ICartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};


// Agrega un producto. Si ya estaba, suma la cantidad en lugar de duplicarlo.
export const addToCart = (product: IProduct, cantidad: number = 1): ICartItem => {
  if (!product.disponible || product.stock <= 0) {
    throw new Error(`"${product.nombre}" no está disponible`);
  }

  const items = getCartItems();
  const existente = items.find((item) => item.id === product.id);
  const cantidadActual = existente ? existente.cantidad : 0;

  if (cantidadActual + cantidad > product.stock) {
    throw new Error(`Solo hay ${product.stock} unidades de "${product.nombre}"`);
  }

  if (existente) {
    existente.cantidad += cantidad;
    saveCartItems(items);
    return existente;
  }

  const nuevoItem: ICartItem = {
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    imagen: product.imagen,
    stock: product.stock,
    cantidad,
  };

  items.push(nuevoItem);
  saveCartItems(items);
  return nuevoItem;
};

// Cambia la cantidad de un item. Si queda en 0 o menos, se elimina.
export const updateQuantity = (productId: number, cantidad: number): void => {
  const items = getCartItems();
  const item = items.find((i) => i.id === productId);
  if (!item) return;

  if (cantidad <= 0) {
    removeFromCart(productId);
    return;
  }

  item.cantidad = Math.min(cantidad, item.stock);
  saveCartItems(items);
};

export const removeFromCart = (productId: number): void => {
  const items = getCartItems().filter((item) => item.id !== productId);
  saveCartItems(items);
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};


export const getSubtotal = (item: ICartItem): number => item.precio * item.cantidad;

// suma de los subtotales de todos los ítems
export const getCartTotal = (items: ICartItem[] = getCartItems()): number =>
  items.reduce((total, item) => total + getSubtotal(item), 0);

// Cantidad total de unidades 
export const getCartCount = (items: ICartItem[] = getCartItems()): number =>
  items.reduce((total, item) => total + item.cantidad, 0);


const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export const formatPrice = (valor: number): string => formatoPesos.format(valor);
