import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

let productos = [];

async function cargarProductos() {
  productos = [];

  const querySnapshot = await getDocs(collection(db, "productos"));

  querySnapshot.forEach((doc) => {
    productos.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  productos.sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", {
      sensitivity: "base",
    }),
  );

  mostrarProductos();
}

async function agregarProducto() {
  let nombre = document.getElementById("nombreProducto").value;

  let cantidad = document.getElementById("cantidadProducto").value;

  if (nombre === "" || cantidad === "") {
    alert("Completa todos los campos");
    return;
  }

  await addDoc(collection(db, "productos"), {
    nombre: nombre,
    cantidad: Number(cantidad),
  });

  cargarProductos();

  document.getElementById("nombreProducto").value = "";
  document.getElementById("cantidadProducto").value = "";
}

function mostrarProductos() {
  let lista = document.getElementById("listaProductos");

  lista.innerHTML = "";

  let textoBuscador = document.getElementById("buscador").value.toLowerCase();

  productos
    .filter((producto) =>
      producto.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          textoBuscador
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        ),
    )
    .forEach((producto, index) => {
      lista.insertAdjacentHTML(
        "beforeend",
        `
  
  
    
<div class="producto">

  <input 
    type="text"
    id="nombre-${index}"
    value="${producto.nombre}"
  >

  <p>Cantidad actual: ${producto.cantidad}</p>

  <input 
    type="number"
    id="entrada-${index}"
    placeholder="Cantidad entrada"
  >

  <button class="btn-entrada" onclick="entradaProducto(${index})">
    + Entrada
  </button>

  <input 
    type="number"
    id="salida-${index}"
    placeholder="Cantidad salida"
  >

  <button class="btn-salida" onclick="salidaProducto(${index})">
    - Salida
  </button>

  <button class="btn-actualizar" onclick="actualizarNombre(${index})">
    Guardar Nombre
  </button>

  <button class="btn-eliminar" onclick="eliminarProducto(${index})">
    Eliminar
  </button>

</div>

      `,
      );
    });
}

async function entradaProducto(index) {
  let entrada = document.getElementById(`entrada-${index}`).value;

  if (entrada === "") {
    alert("Ingresa una cantidad");
    return;
  }

  let confirmar = confirm("¿Agregar entrada al inventario?");

  if (confirmar) {
    let nuevaCantidad = productos[index].cantidad + Number(entrada);

    await updateDoc(doc(db, "productos", productos[index].id), {
      cantidad: nuevaCantidad,
    });

    productos[index].cantidad = nuevaCantidad;

    mostrarProductos();

    document.getElementById(`entrada-${index}`).value = "";
  }
}

async function salidaProducto(index) {
  let salida = document.getElementById(`salida-${index}`).value;

  if (salida === "") {
    alert("Ingresa una cantidad");
    return;
  }

  let confirmar = confirm("¿Registrar salida de inventario?");

  if (confirmar) {
    if (Number(salida) > productos[index].cantidad) {
      alert("No hay suficiente stock disponible");
      return;
    }

    let nuevaCantidad = productos[index].cantidad - Number(salida);

    await updateDoc(doc(db, "productos", productos[index].id), {
      cantidad: nuevaCantidad,
    });

    productos[index].cantidad = nuevaCantidad;

    mostrarProductos();

    document.getElementById(`salida-${index}`).value = "";
  }
}

async function actualizarNombre(index) {
  let confirmar = confirm("¿Actualizar nombre del producto?");

  if (confirmar) {
    let nuevoNombre = document.getElementById(`nombre-${index}`).value;

    if (nuevoNombre === "") {
      alert("El nombre no puede estar vacío");
      return;
    }

    await updateDoc(doc(db, "productos", productos[index].id), {
      nombre: nuevoNombre,
    });

    productos[index].nombre = nuevoNombre;

    mostrarProductos();

    alert("Nombre actualizado");
  }
}

async function eliminarProducto(index) {
  let confirmar = confirm("¿Seguro que deseas eliminar este producto?");

  if (confirmar) {
    await deleteDoc(doc(db, "productos", productos[index].id));

    cargarProductos();

    alert("Producto eliminado");
  }
}
function generarPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text("Inventario Zea", 20, 20);

  let y = 40;

  productos.forEach((producto) => {
    doc.setFontSize(12);

    doc.text(`${producto.nombre} - Cantidad: ${producto.cantidad}`, 20, y);

    y += 10;
  });

  doc.save("inventario-zea.pdf");
}
cargarProductos();

window.agregarProducto = agregarProducto;
window.entradaProducto = entradaProducto;
window.salidaProducto = salidaProducto;
window.actualizarNombre = actualizarNombre;
window.eliminarProducto = eliminarProducto;
window.generarPDF = generarPDF;
window.mostrarProductos = mostrarProductos;
