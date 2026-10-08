const CLAVE_CARRITO = "carrito";

export function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
}

// Guarda el estado completo: se usa al agregar, modificar cantidades y eliminar un ítem
export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

export function vaciarCarritoGuardado() {
  localStorage.removeItem(CLAVE_CARRITO);
}
