import { initApp } from "../../../main";
import { logout } from "../../../utils/auth";
import { getCategories, PRODUCTS } from "../../../data/data";
import type { IProduct } from "../../../types/product";
import type { ICategoria } from "../../../types/categoria";
import { addToCart, formatPrice, getCartCount } from "../../../utils/cart";
import { crearImagenProducto } from "../../../utils/images";

initApp();

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
const listaCategorias = document.getElementById("listaCategorias") as HTMLUListElement;
const inputBusqueda = document.getElementById("inputBusqueda") as HTMLInputElement;
const tituloCatalogo = document.getElementById("tituloCatalogo") as HTMLHeadingElement;
const resultadoInfo = document.getElementById("resultadoInfo") as HTMLParagraphElement;
const gridProductos = document.getElementById("gridProductos") as HTMLElement;
const sinResultados = document.getElementById("sinResultados") as HTMLDivElement;
const sinResultadosTexto = document.getElementById("sinResultadosTexto") as HTMLParagraphElement;
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros") as HTMLButtonElement;
const cartCount = document.getElementById("cartCount") as HTMLSpanElement;
const toast = document.getElementById("toast") as HTMLDivElement;


const productos: IProduct[] = PRODUCTS.filter((producto) => !producto.eliminado);
const categorias: ICategoria[] = getCategories();

let categoriaSeleccionada: number | null = null; // null = todas
let textoBusqueda = "";


// Pasa a min y quita tildes para la busqueda
const normalizar = (texto: string): string =>
  texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

const filtrarProductos = (
  lista: IProduct[],
  texto: string,
  categoriaId: number | null
): IProduct[] => {
  const busqueda = normalizar(texto);

  return lista.filter((producto) => {
    const coincideNombre = normalizar(producto.nombre).includes(busqueda);
    const coincideCategoria =
      categoriaId === null ||
      producto.categorias.some((categoria) => categoria.id === categoriaId);

    return coincideNombre && coincideCategoria;
  });
};

const getCategoriaSeleccionada = (): ICategoria | undefined =>
  categorias.find((categoria) => categoria.id === categoriaSeleccionada);

// Categorias

const crearBotonCategoria = (
  texto: string,
  cantidad: number,
  categoriaId: number | null
): HTMLLIElement => {
  const li = document.createElement("li");
  const boton = document.createElement("button");
  const activo = categoriaId === categoriaSeleccionada;

  boton.type = "button";
  boton.className = activo ? "categoria categoria--activa" : "categoria";
  boton.dataset.categoriaId = categoriaId === null ? "todas" : String(categoriaId);
  boton.setAttribute("aria-pressed", String(activo));

  const nombre = document.createElement("span");
  nombre.textContent = texto;

  const contador = document.createElement("span");
  contador.className = "categoria__contador";
  contador.textContent = String(cantidad);

  boton.append(nombre, contador);
  li.append(boton);
  return li;
};

const renderCategorias = (): void => {
  listaCategorias.replaceChildren();

  listaCategorias.append(crearBotonCategoria("Todas", productos.length, null));

  categorias.forEach((categoria) => {
    const cantidad = filtrarProductos(productos, "", categoria.id).length;
    const texto = categoria.nombre;
    listaCategorias.append(crearBotonCategoria(texto, cantidad, categoria.id));
  });
};

// Productos

const crearCardProducto = (producto: IProduct): HTMLElement => {
  const sinStock = !producto.disponible || producto.stock <= 0;
  const categoriaPrincipal = producto.categorias[0];

  const card = document.createElement("article");
  card.className = sinStock ? "card card--agotado" : "card";

  const imagen = crearImagenProducto(producto.imagen, producto.nombre);

  if (sinStock) {
    const etiqueta = document.createElement("span");
    etiqueta.className = "card__etiqueta";
    etiqueta.textContent = "Sin stock";
    imagen.append(etiqueta);
  }

  const cuerpo = document.createElement("div");
  cuerpo.className = "card__cuerpo";

  const categoria = document.createElement("span");
  categoria.className = "card__categoria";
  categoria.textContent = categoriaPrincipal?.nombre ?? "";

  const titulo = document.createElement("h3");
  titulo.className = "card__titulo";
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "card__descripcion";
  descripcion.textContent = producto.descripcion;

  const pie = document.createElement("div");
  pie.className = "card__pie";

  const precio = document.createElement("span");
  precio.className = "card__precio";
  precio.textContent = formatPrice(producto.precio);

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn btn--primary card__boton";
  boton.dataset.productoId = String(producto.id);
  boton.textContent = sinStock ? "No disponible" : "Agregar";
  boton.disabled = sinStock;

  pie.append(precio, boton);
  cuerpo.append(categoria, titulo, descripcion, pie);
  card.append(imagen, cuerpo);

  return card;
};

const renderProductos = (): void => {
  const filtrados = filtrarProductos(productos, textoBusqueda, categoriaSeleccionada);
  const categoria = getCategoriaSeleccionada();

  tituloCatalogo.textContent = categoria ? categoria.nombre : "Todos los productos";

  gridProductos.replaceChildren(...filtrados.map(crearCardProducto));

  if (filtrados.length === 0) {
    const enCategoria = categoria ? ` en ${categoria.nombre}` : "";
    sinResultadosTexto.textContent = textoBusqueda.trim()
      ? `No encontramos productos que coincidan con "${textoBusqueda.trim()}"${enCategoria}.`
      : `No hay productos${enCategoria}.`;
    sinResultados.hidden = false;
    resultadoInfo.textContent = "";
    return;
  }

  sinResultados.hidden = true;
  resultadoInfo.textContent =
    filtrados.length === 1 ? "1 producto" : `${filtrados.length} productos`;
};

const render = (): void => {
  renderCategorias();
  renderProductos();
};

// Carrito

const actualizarContadorCarrito = (): void => {
  const cantidad = getCartCount();
  cartCount.textContent = String(cantidad);
  cartCount.classList.toggle("badge--vacio", cantidad === 0);
};

let toastTimeout: number | undefined;

const mostrarToast = (mensaje: string, tipo: "ok" | "error" = "ok"): void => {
  toast.textContent = mensaje;
  toast.className = `toast toast--visible toast--${tipo}`;

  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.className = "toast";
  }, 2200);
};

const marcarBotonAgregado = (boton: HTMLButtonElement): void => {
  boton.textContent = "✓ Agregado";
  boton.classList.add("btn--ok");

  window.setTimeout(() => {
    boton.textContent = "Agregar";
    boton.classList.remove("btn--ok");
  }, 1200);
};

// Eventos

inputBusqueda.addEventListener("input", () => {
  textoBusqueda = inputBusqueda.value;
  renderProductos();
});

listaCategorias.addEventListener("click", (e: MouseEvent) => {
  const boton = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-categoria-id]");
  if (!boton) return;

  const id = boton.dataset.categoriaId;
  categoriaSeleccionada = id === "todas" || id === undefined ? null : Number(id);
  render();
});

btnLimpiarFiltros.addEventListener("click", () => {
  textoBusqueda = "";
  inputBusqueda.value = "";
  categoriaSeleccionada = null;
  render();
  inputBusqueda.focus();
});

gridProductos.addEventListener("click", (e: MouseEvent) => {
  const boton = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-producto-id]");
  if (!boton || boton.disabled) return;

  const producto = productos.find((p) => p.id === Number(boton.dataset.productoId));
  if (!producto) return;

  try {
    addToCart(producto);
    actualizarContadorCarrito();
    marcarBotonAgregado(boton);
    mostrarToast(`✓ ${producto.nombre} se agregó al carrito`);
  } catch (error) {
    mostrarToast(error instanceof Error ? error.message : "No se pudo agregar el producto", "error");
  }
});

buttonLogout.addEventListener("click", () => {
  logout();
});

window.addEventListener("pageshow", (e: PageTransitionEvent) => {
  if (e.persisted) actualizarContadorCarrito();
});
window.addEventListener("storage", (e: StorageEvent) => {
  if (e.key === "cart" || e.key === null) actualizarContadorCarrito();
});

// Inicio

render();
actualizarContadorCarrito();
