<h1>
Entrega final – Comisión 102315 – Diplomatura Javascript - Coderhouse
</h1>

<h3>Objetivos generales:</h3>

<p>
  
- Entregar el simulador final que demuestre el dominio de JavaScript, manipulación del DOM, asincronismo y persistencia de datos

</p>

<h3>Requisitos Técnicos del Proyecto (Checklist):</h3>

## A. Uso de DOM:

- Tu aplicación JavaScript debe interactuar integramente con HTML utilizando DOM y los eventos necesarios. 
- No se debe tener en ningun caso prompt ni alertas nativas del navegador.

## B. Arrays y Objetos:

- Todos los arrays de objetos que utilices dentro de tu aplicación deben ser convertidos obligatoriamente a un archivo en formato .JSON y accedidos mediante la tecnología Fetch.

## C. Funciones de Orden Superior:

- El proyecto debe contar con mínimo dos funciones de orden superior diferentes (ej. un forEach y un reduce) para interactuar con el simulador y realizar tareas de búsqueda o transformación de la información según sea necesario.

## D. Storage y Operadores Avanzados:

- El proyecto debe tener correctamente implementado el uso de storage, permitiendo que se pueda guardar, borrar, modificar informacion o vaciar el storage para una correcta experiencia del usuario.
- Se deben plantear mejoras en el script con operadores avanzados (ternario, or) y destructuring.

## E. Asincronismo y Peticiones:

- El proyecto debe tener correctamente implementado fetch para consumir una api/json local, planteando la estructura con async-await y un correcto manejo de errores con try-catch-finally.

## F. Uso de Librerias:

- Debes incluir al menos una librería JS externa(sweetalert/toastify) y debes eliminar el uso de herramientas más limitadas del lenguaje, como ser los cuadros de diálogo Prompt, Confirm y Alert.

## G. Lógica del simulador:

- El simulador interactivo debe completar todo el circuito o proceso de negocio, de acuerdo a la temática del mismo.
- Debes obviar temas más complejos como ser un registro de usuario y login, pero no puedes obviar armar un circuito completo de una compra online, o de la cotización de productos o servicios.

## H. Código claro:

- Todo tu código debe ser claro y estar correctamente estructurado para su lectura. Puedes dejar comentarios breves en el código, pero no puedes dejar código en desuso/comentado que complique la lectura y análisis del mismo.
- Toda la nomenclatura de variables, arrays, objetos, funciones debe ser semántica (evitar usar nombres genericos como "x", "a", "funcA")

# Prueba de flujo de la tienda:

<img width="658" height="408" alt="Flujo_Tienda" src="https://github.com/user-attachments/assets/307a825f-5a7a-4abd-99c6-886c910d736b" />

Repasando el checklist descrito, detallo las pruebas realizadas:

## 1) Se verifica que no hayan errores en consola:

<img width="1905" height="1132" alt="image" src="https://github.com/user-attachments/assets/a0a50fa0-d1a8-4435-96fd-107cc28c8a82" />

## 2) Se guarde el array correctamente en el Localstorage:

### Página:

<img width="1391" height="488" alt="image" src="https://github.com/user-attachments/assets/eb0f1155-bf07-4c0a-8e12-6efe912df4b4" />

### Local Storage:

<img width="1216" height="626" alt="image" src="https://github.com/user-attachments/assets/b0474f35-102e-41d0-8cd8-29840a193859" />

## 3) Uso de Librerías:

Se utilizaron ambas librerías (tanto Sweetalert como Toastify) para las alertas del sitio, tal cumo se muestra en el video.

## 4) Asincronismo y Peticiones:

La info de los productos que se renderiza vienen del archivo `bd\productos.json`:

<img width="580" height="638" alt="image" src="https://github.com/user-attachments/assets/7027b0d8-e0f0-4a72-bea0-761a812575bd" />

Aquí parte de la función donde hacemos el fetch de los datos:

### `js\main.js`

```javascript
const RUTA_PRODUCTOS = "./db/productos.json";

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

```

Si forzamos el error poniéndole un nombre inválido del archivo que trae los productos, muestra lo siguiente en pantalla:

<img width="1712" height="832" alt="image" src="https://github.com/user-attachments/assets/8cc8828e-6922-4e46-a412-4ce68fe04673" />


Con las pruebas realizadas y el código entregado, concluimos que el checklist estaría completo:

- [x] A. Uso de DOM
- [x] B. Arrays y Objetos
- [x] C. Funciones de Orden Superior
- [x] D. Storage y Operadores Avanzados
- [x] E. Asincronismo y Peticiones
- [x] F. Uso de Librerias
- [x] G. Lógica del simulador
- [x] H. Código claro
