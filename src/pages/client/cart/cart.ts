import { initApp } from "../../../main";
import { logout } from "../../../utils/auth";
import { PRODUCTS } from "../../../data/data";
import type { ICartItem } from "../../../types/product";
import {
  clearCart,
  formatPrice,
  getCartCount,
  getCartItems,
  getCartTotal,
  getSubtotal,
  removeFromCart,
  updateQuantity,
} from "../../../utils/cart";
import { crearImagenProducto } from "../../../utils/images";

initApp();

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
const cartCount = document.getElementById("cartCount") as HTMLSpanElement;
const carritoVacio = document.getElementById("carritoVacio") as HTMLDivElement;
const carritoContenido = document.getElementById("carritoContenido") as HTMLDivElement;
const listaCarrito = document.getElementById("listaCarrito") as HTMLUListElement;
const resumenCantidad = document.getElementById("resumenCantidad") as HTMLSpanElement;
const totalCarrito = document.getElementById("totalCarrito") as HTMLSpanElement;
const btnVaciar = document.getElementById("btnVaciar") as HTMLButtonElement;

type AccionCarrito = "restar" | "sumar" | "quitar";


const getRutaImagen = (item: ICartItem): string =>
  PRODUCTS.find((p) => p.id === item.id)?.imagen ?? item.imagen;

const crearSpan = (clase: string, texto: string, etiqueta?: string): HTMLSpanElement => {
  const span = document.createElement("span");
  span.className = clase;
  span.textContent = texto;
  if (etiqueta) span.dataset.label = etiqueta;
  return span;
};

const crearBotonAccion = (
  accion: AccionCarrito,
  item: ICartItem,
  texto: string,
  ariaLabel: string
): HTMLButtonElement => {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = accion === "quitar" ? "cart-item__quitar" : "cantidad__boton";
  boton.dataset.accion = accion;
  boton.dataset.productoId = String(item.id);
  boton.textContent = texto;
  boton.setAttribute("aria-label", ariaLabel);
  return boton;
};

const crearItemCarrito = (item: ICartItem): HTMLLIElement => {
  const li = document.createElement("li");
  li.className = "cart-item";

  // Producto 
  const producto = document.createElement("div");
  producto.className = "cart-item__producto";
  const imagen = crearImagenProducto(getRutaImagen(item), item.nombre);
  imagen.classList.add("producto-imagen--mini");
  const nombre = crearSpan("cart-item__nombre", item.nombre);
  producto.append(imagen, nombre);

  // Precio 
  const precio = crearSpan("cart-item__precio", formatPrice(item.precio), "Precio");

  const cantidad = document.createElement("div");
  cantidad.className = "cantidad";
  cantidad.dataset.label = "Cantidad";

  const botonRestar = crearBotonAccion("restar", item, "−", `Restar una unidad de ${item.nombre}`);
  const valor = crearSpan("cantidad__valor", String(item.cantidad));
  const botonSumar = crearBotonAccion("sumar", item, "+", `Sumar una unidad de ${item.nombre}`);
  botonSumar.disabled = item.cantidad >= item.stock;

  cantidad.append(botonRestar, valor, botonSumar);

  // Subtotal
  const subtotal = crearSpan("cart-item__subtotal", formatPrice(getSubtotal(item)), "Subtotal");

  // Quitar
  const botonQuitar = crearBotonAccion("quitar", item, "✕", `Quitar ${item.nombre} del carrito`);

  li.append(producto, precio, cantidad, subtotal, botonQuitar);
  return li;
};


const renderCarrito = (): void => {
  const items = getCartItems(); // se lee siempre desde localStorage
  const cantidadTotal = getCartCount(items);

  cartCount.textContent = String(cantidadTotal);
  cartCount.classList.toggle("badge--vacio", cantidadTotal === 0);

  if (items.length === 0) {
    carritoVacio.hidden = false;
    carritoContenido.hidden = true;
    listaCarrito.replaceChildren();
    return;
  }

  carritoVacio.hidden = true;
  carritoContenido.hidden = false;

  listaCarrito.replaceChildren(...items.map(crearItemCarrito));

  resumenCantidad.textContent = String(cantidadTotal);
  totalCarrito.textContent = formatPrice(getCartTotal(items));
};

// Eventos

listaCarrito.addEventListener("click", (e: MouseEvent) => {
  const boton = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-accion]");
  if (!boton || boton.disabled) return;

  const productId = Number(boton.dataset.productoId);
  const accion = boton.dataset.accion as AccionCarrito;
  const item = getCartItems().find((i) => i.id === productId);
  if (!item) return;

  switch (accion) {
    case "restar":
      updateQuantity(productId, item.cantidad - 1);
      break;
    case "sumar":
      updateQuantity(productId, item.cantidad + 1);
      break;
    case "quitar":
      removeFromCart(productId);
      break;
  }

  renderCarrito();
});

btnVaciar.addEventListener("click", () => {
  clearCart();
  renderCarrito();
});

buttonLogout.addEventListener("click", () => {
  logout();
});

window.addEventListener("pageshow", (e: PageTransitionEvent) => {
  if (e.persisted) renderCarrito();
});
window.addEventListener("storage", (e: StorageEvent) => {
  if (e.key === "cart" || e.key === null) renderCarrito();
});

// Inicio

renderCarrito();
