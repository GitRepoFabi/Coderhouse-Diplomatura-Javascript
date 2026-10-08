import {
  obtenerCarrito,
  guardarCarrito,
  vaciarCarritoGuardado,
} from "./storage.js";
import {
  agregarProducto,
  cambiarCantidad,
  eliminarProducto,
  calcularTotal,
  contarUnidades,
} from "./carrito.js";

const RUTA_PRODUCTOS = "./db/productos.json";

const contenedorProductos = document.querySelector("#contenedor-productos");
const contenedorCarrito = document.querySelector("#mi-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const indicadorCarga = document.querySelector("#indicador-carga");
const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtro-categoria");
const botonVaciar = document.querySelector("#btn-vaciar");
const botonFinalizar = document.querySelector("#btn-finalizar");

let productos = [];
let carrito = obtenerCarrito();

const formatearPrecio = (valor) => `$${valor.toLocaleString("es-UY")}`;

function notificar(texto, tipo = "exito") {
  Toastify({
    text: texto,
    position: "right",
    gravity: "top",
    duration: 3000,
    style: { background: tipo === "error" ? "#e63946" : "#2d6a4f" },
  }).showToast();
}

async function cargarProductos() {
  try {
    const respuesta = await fetch(RUTA_PRODUCTOS);
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

    productos = await respuesta.json();
    cargarOpcionesCategoria();
    aplicarFiltros();
  } catch (error) {
    contenedorProductos.innerHTML = `<p class="mensaje mensaje-error">No pudimos cargar el catálogo. Intentá nuevamente más tarde.</p>`;
    notificar(`Error al cargar productos: ${error.message}`, "error");
  } finally {
    indicadorCarga.hidden = true;
  }
}

function cargarOpcionesCategoria() {
  const categorias = [...new Set(productos.map(({ categoria }) => categoria))];

  categorias.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    filtroCategoria.appendChild(opcion);
  });
}

function aplicarFiltros() {
  const textoBusqueda = buscador.value.trim().toLowerCase();
  const categoriaElegida = filtroCategoria.value;

  const productosFiltrados = productos.filter(
    ({ nombre, categoria }) =>
      nombre.toLowerCase().includes(textoBusqueda) &&
      (categoriaElegida === "todas" || categoria === categoriaElegida),
  );

  renderizarProductos(productosFiltrados);
}

function renderizarProductos(lista) {
  contenedorProductos.innerHTML = lista.length
    ? lista
        .map(
          ({ id, nombre, imagen, categoria, precio }) => `
        <article class="producto-card">
          <h3>${nombre}</h3>
          <img src="${imagen}" alt="${nombre}" />
          <p><strong>Categoría:</strong> ${categoria}</p>
          <p class="precio">${formatearPrecio(precio)}</p>
          <button class="btn-agregar" data-id="${id}">Agregar al carrito</button>
        </article>`,
        )
        .join("")
    : `<p class="mensaje">No se encontraron productos.</p>`;
}

function renderizarCarrito() {
  const carritoVacio = carrito.length === 0;

  contenedorCarrito.innerHTML = carritoVacio
    ? `<p class="mensaje">Tu carrito está vacío.</p>`
    : carrito
        .map(
          ({ id, nombre, precio, cantidad }) => `
        <div class="carrito-item">
          <div class="carrito-item-info">
            <h4>${nombre}</h4>
            <p>${formatearPrecio(precio)} c/u</p>
          </div>
          <div class="carrito-cantidad">
            <button class="btn-cantidad" data-accion="restar" data-id="${id}">−</button>
            <span>${cantidad}</span>
            <button class="btn-cantidad" data-accion="sumar" data-id="${id}">+</button>
          </div>
          <p class="precio">${formatearPrecio(precio * cantidad)}</p>
          <button class="btn-eliminar" data-accion="eliminar" data-id="${id}">Eliminar</button>
        </div>`,
        )
        .join("");

  totalCarrito.textContent = carritoVacio
    ? ""
    : `Total (${contarUnidades(carrito)} unidades): ${formatearPrecio(calcularTotal(carrito))}`;

  botonVaciar.disabled = carritoVacio;
  botonFinalizar.disabled = carritoVacio;
}

function actualizarCarrito(nuevoCarrito) {
  carrito = nuevoCarrito;
  guardarCarrito(carrito);
  renderizarCarrito();
}

function manejarClickProductos({ target }) {
  if (!target.classList.contains("btn-agregar")) return;

  const producto = productos.find(({ id }) => id === Number(target.dataset.id));
  if (!producto) return;

  actualizarCarrito(agregarProducto(carrito, producto));
  notificar(`Se agregó "${producto.nombre}" al carrito`);
}

function manejarClickCarrito({ target }) {
  const { accion, id } = target.dataset;
  if (!accion) return;

  const idProducto = Number(id);
  const acciones = {
    sumar: () => actualizarCarrito(cambiarCantidad(carrito, idProducto, 1)),
    restar: () => actualizarCarrito(cambiarCantidad(carrito, idProducto, -1)),
    eliminar: () => {
      actualizarCarrito(eliminarProducto(carrito, idProducto));
      notificar("Producto eliminado del carrito", "error");
    },
  };

  acciones[accion]?.();
}

async function vaciarCarrito() {
  const { isConfirmed } = await Swal.fire({
    title: "¿Vaciar el carrito?",
    text: "Se eliminarán todos los productos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  });

  if (!isConfirmed) return;

  carrito = [];
  vaciarCarritoGuardado();
  renderizarCarrito();
  notificar("Carrito vaciado");
}

function generarResumenCompra() {
  const lineas = carrito
    .map(
      ({ nombre, cantidad, precio }) =>
        `<li>${cantidad} × ${nombre} — ${formatearPrecio(precio * cantidad)}</li>`,
    )
    .join("");

  return `<ul class="resumen-compra">${lineas}</ul><p><strong>Total: ${formatearPrecio(calcularTotal(carrito))}</strong></p>`;
}

async function finalizarCompra() {
  const { isConfirmed, value: nombreCliente } = await Swal.fire({
    title: "Confirmar compra",
    html: generarResumenCompra(),
    input: "text",
    inputLabel: "Nombre para el pedido",
    inputValidator: (valor) =>
      !valor.trim() && "Ingresá un nombre para el pedido",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Volver",
  });

  if (!isConfirmed) return;

  const codigoPedido = `CF-${Date.now().toString().slice(-6)}`;
  const totalPagado = formatearPrecio(calcularTotal(carrito));

  carrito = [];
  vaciarCarritoGuardado();
  renderizarCarrito();

  Swal.fire({
    title: "¡Compra realizada!",
    text: `Gracias, ${nombreCliente.trim()}. Pedido ${codigoPedido} por ${totalPagado}.`,
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

contenedorProductos.addEventListener("click", manejarClickProductos);
contenedorCarrito.addEventListener("click", manejarClickCarrito);
buscador.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
botonVaciar.addEventListener("click", vaciarCarrito);
botonFinalizar.addEventListener("click", finalizarCompra);

renderizarCarrito();
cargarProductos();
