let carrito = [];


function actualizarContador() {
  const contador = document.getElementById('contador');
  contador.textContent = carrito.length;
  actualizarDetalleCarrito();
}

function actualizarDetalleCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalElem = document.getElementById('total');

  lista.innerHTML = '';

  let total = 0;
  carrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.textContent = `${producto.nombre} - $${producto.precio.toLocaleString()}`;
    lista.appendChild(li);
    total += producto.precio;
  });

  totalElem.textContent = total.toLocaleString();
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  alert(`${nombre} agregado al carrito.`);
  actualizarContador();
  console.log("Carrito actual:", carrito);
}

function limpiarCarrito() {
  carrito = [];
  actualizarContador();
  alert("El carrito ha sido vaciado.");
}

function finalizarCompra() {
  if(carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de comprar.");
    return;
  }

  let mensaje = "Gracias por tu compra! Compraste:\n";
  carrito.forEach(producto => {
    mensaje += `- ${producto.nombre} - $${producto.precio.toLocaleString()}\n`;
  });
  mensaje += `Total a pagar: $${carrito.reduce((acc, p) => acc + p.precio, 0).toLocaleString()}`;

  alert(mensaje);
  limpiarCarrito();
}
