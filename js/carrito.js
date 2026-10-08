export function agregarProducto(carrito, producto) {
  const { id, nombre, precio } = producto;
  const yaEnCarrito = carrito.some((item) => item.id === id);

  return yaEnCarrito
    ? carrito.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
      )
    : [...carrito, { id, nombre, precio, cantidad: 1 }];
}

export function cambiarCantidad(carrito, idProducto, variacion) {
  const item = carrito.find(({ id }) => id === idProducto);
  if (!item) return carrito;

  const nuevaCantidad = item.cantidad + variacion;

  return nuevaCantidad > 0
    ? carrito.map((actual) =>
        actual.id === idProducto
          ? { ...actual, cantidad: nuevaCantidad }
          : actual,
      )
    : eliminarProducto(carrito, idProducto);
}

export function eliminarProducto(carrito, idProducto) {
  return carrito.filter(({ id }) => id !== idProducto);
}

export function calcularTotal(carrito) {
  return carrito.reduce(
    (total, { precio, cantidad }) => total + precio * cantidad,
    0,
  );
}

export function contarUnidades(carrito) {
  return carrito.reduce((total, { cantidad }) => total + cantidad, 0);
}
