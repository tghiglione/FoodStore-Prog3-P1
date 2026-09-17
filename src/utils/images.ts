// Helper para mostrar la imagen de un producto.

export const crearImagenProducto = (rutaImagen: string, alt: string): HTMLDivElement => {
  const contenedor = document.createElement("div");
  contenedor.className = "producto-imagen";

  const img = document.createElement("img");
  img.src = rutaImagen;
  img.alt = alt;
  img.loading = "lazy";

  img.addEventListener("error", () => {
    img.remove();
    contenedor.classList.add("producto-imagen--sin-imagen");
    contenedor.title = `No se encontró la imagen: ${rutaImagen}`;
  });

  contenedor.append(img);
  return contenedor;
};
