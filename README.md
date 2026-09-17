# Food Store – Evaluación 1 · Programación 3

Aplicación frontend de un local de comidas (**Food Store**) hecha con **HTML5, CSS3 y TypeScript**, usando **Vite** y sin frameworks.

Es la continuación del Trabajo Práctico Integrador de TypeScript (registro, login y protección de rutas por rol). En esta evaluación agregué la parte del cliente:

- **Catálogo de productos** con render dinámico desde `src/data/data.ts`.
- **Búsqueda por nombre** (coincidencia total o parcial, sin importar mayúsculas ni tildes).
- **Filtro por categoría** desde el menú lateral, con la opción "Todas" para volver al catálogo completo.
- **Carrito con persistencia en `localStorage`** (clave `"cart"`): agregar productos, sumar/restar cantidad, quitar ítems, vaciar el carrito y ver el total.

---

## Enlance de video

[Explicación del código] ()

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- [pnpm](https://pnpm.io/) (si no lo tenés: `corepack enable pnpm`)

## Cómo ejecutarlo

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar el servidor de desarrollo
pnpm dev
```

Abrir **http://localhost:5173**. La app redirige al login.

### Usuarios para probar

Cliente | Crear una cuenta desde **Registrarme** y después iniciar sesión.
Admin   | `admin@gmail.com` / `admin123` (se crea solo al abrir la app).  

El catálogo y el carrito están en la vista de **cliente**.

### Build de producción

```bash
pnpm build     # compila TypeScript (tsc) y genera /dist
pnpm preview   # sirve el build en http://localhost:4173
```

---

## Funcionalidades

### Catálogo (`src/pages/client/home`)

- Los productos y categorías se leen desde `src/data/data.ts` (`PRODUCTS` y `getCategories()`) y se renderizan con `document.createElement`.
- **Búsqueda:** el campo de búsqueda filtra mientras se escribe. Si no hay coincidencias se muestra un mensaje y un botón para ver el catálogo completo.
- **Categorías:** el menú lateral muestra cada categoría con la cantidad de productos. Al elegir una, se muestran solo sus productos. La búsqueda y la categoría se pueden usar juntas.
- **Agregar al carrito:** cada tarjeta tiene un botón "Agregar". Al presionarlo:
  - el producto se guarda en `localStorage` bajo la clave `"cart"`;
  - si ya estaba, se suma 1 a su cantidad (no se duplica);
  - el botón cambia a "✓ Agregado", aparece un aviso abajo y se actualiza el contador del carrito en el header.
- Los productos sin stock o no disponibles se muestran con la etiqueta "Sin stock" y el botón deshabilitado. Tampoco se puede agregar más cantidad que el stock.

### Carrito (`src/pages/client/cart`)

- Lee los ítems desde `localStorage` (`"cart"`).
- Muestra **nombre, precio, cantidad y subtotal** de cada producto.
- Botones `−` / `+` para cambiar la cantidad y `✕` para quitar el producto.
- **Total general** = suma de los subtotales. Se recalcula cada vez que cambia el carrito.
- Si el carrito está vacío se muestra un mensaje con un link al catálogo.
- Botón **Vaciar carrito**.

> No se implementa checkout ni conexión con backend.

---

## Estructura del proyecto

```
src/
├── pages/
│   ├── auth/                  ← registro y login (TP integrador)
│   ├── admin/                 ← vista de admin (TP integrador)
│   └── client/
│       ├── home/
│       │   ├── home.html      ← catálogo: buscador, categorías y contenedor de productos
│       │   └── home.ts        ← render, búsqueda, filtros y botón "Agregar"
│       └── cart/
│           ├── cart.html      ← vista del carrito y total
│           └── cart.ts        ← render de ítems, cantidades y total
├── types/
│   ├── product.ts             ← interfaces IProduct e ICartItem
│   ├── categoria.ts           ← interface ICategoria
│   ├── IUser.ts               ← (TP integrador)
│   └── Rol.ts                 ← (TP integrador)
├── data/
│   └── data.ts                ← PRODUCTS y getCategories()
├── utils/
│   ├── cart.ts                ← lógica del carrito sobre localStorage ("cart")
│   ├── images.ts              ← crea la imagen del producto (con aviso si falta el archivo)
│   ├── auth.ts                ← (TP integrador)
│   ├── localStorage.ts        ← (TP integrador)
│   └── navigate.ts            ← rutas de la app
├── main.ts                    ← initApp(): admin por defecto + protección de rutas
└── style.css                  ← estilos del catálogo y del carrito
```

Todas las páginas están registradas en `vite.config.ts` (`build.rollupOptions.input`): `index`, `authRegistro`, `authLogin`, `adminHome`, `clientHome` y `clientCart`.

### Lógica del carrito (`src/utils/cart.ts`)

| Función                           | Qué hace                                                        |
| --------------------------------- | --------------------------------------------------------------- |
| `getCartItems()`                  | Lee y parsea el carrito desde `localStorage`.                   |
| `addToCart(producto, cantidad)`   | Agrega un producto o suma cantidad si ya existe (valida stock). |
| `updateQuantity(id, cantidad)`    | Cambia la cantidad; si llega a 0 quita el ítem.                 |
| `removeFromCart(id)`              | Quita un ítem.                                                  |
| `clearCart()`                     | Vacía el carrito.                                               |
| `getSubtotal(item)`               | `precio × cantidad`.                                            |
| `getCartTotal()`                  | Suma de todos los subtotales.                                   |
| `getCartCount()`                  | Cantidad total de unidades (contador del header).               |

Las vistas (`home.ts` y `cart.ts`) solo renderizan y escuchan eventos; toda la lógica del carrito está en este archivo.

### Claves de `localStorage`

| Clave      | Contenido                                     |
| ---------- | --------------------------------------------- |
| `users`    | Usuarios registrados (TP integrador).         |
| `userData` | Sesión del usuario logueado (TP integrador).  |
| `cart`     | Ítems del carrito (`ICartItem[]`).            |

---

## Imágenes de productos

Cada producto tiene en `data.ts` el campo `imagen` con la ruta de su foto (por ejemplo `"/images/pizza-muzzarella.jpg"`). Vite sirve esas rutas desde la carpeta **`public/images/`**, tanto en `pnpm dev` como en el build.

---

## Tecnologías

- HTML5 y CSS3 (diseño responsive con Grid y Flexbox)
- TypeScript (interfaces con prefijo `I`, sin `any`)
- Vite
- `localStorage`

**Autor:** Tomás Ghiglione – Tecnicatura Universitaria en Programación a Distancia (UTN)
