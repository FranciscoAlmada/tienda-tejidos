let carrito = [];

// Mostrar panel lateral del carrito
function mostrarCarrito() {
  const panel = document.getElementById('carrito-panel');
  const overlay = document.getElementById('overlay');
  if (panel && overlay) {
    panel.classList.add('mostrar');
    overlay.classList.add('mostrar');
  }
}

// Ocultar panel lateral del carrito
function cerrarCarrito() {
  const panel = document.getElementById('carrito-panel');
  const overlay = document.getElementById('overlay');
  if (panel && overlay) {
    panel.classList.remove('mostrar');
    overlay.classList.remove('mostrar');
  }
}

// Actualizar la lista del carrito y contador
function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const contador = document.getElementById('contador');
  const totalElem = document.getElementById('total');

  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.textContent = `${producto.nombre} - $${producto.precio.toLocaleString('es-AR')}`;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'X';
    btnEliminar.style.marginLeft = '10px';
    btnEliminar.style.background = 'none';
    btnEliminar.style.border = 'none';
    btnEliminar.style.color = '#d17b88';
    btnEliminar.style.cursor = 'pointer';

    btnEliminar.onclick = () => {
      carrito.splice(index, 1);
      actualizarCarrito();
    };

    li.appendChild(btnEliminar);
    lista.appendChild(li);
    total += producto.precio;
  });

  contador.textContent = carrito.length;
  totalElem.textContent = total.toLocaleString('es-AR');
}

// Agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarCarrito();
  mostrarCarrito();
}

// Vaciar todo el carrito
function limpiarCarrito() {
  carrito = [];
  actualizarCarrito();
  cerrarCarrito();
}

// Finalizar compra
function finalizarCompra() {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  let mensaje = "¡Gracias por tu compra! Compraste:\n";
  carrito.forEach(p => {
    mensaje += `- ${p.nombre} - $${p.precio.toLocaleString('es-AR')}\n`;
  });

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  mensaje += `Total: $${total.toLocaleString('es-AR')}`;

  alert(mensaje);
  limpiarCarrito();
}

// Vincular botones después de que carga la página
document.addEventListener('DOMContentLoaded', () => {
  const btnCarrito = document.getElementById('btn-carrito');
  const cerrar = document.getElementById('cerrar-carrito');
  const vaciar = document.getElementById('vaciar-carrito');
  const comprar = document.getElementById('finalizar-compra');
  const overlay = document.getElementById('overlay');

  if (btnCarrito) btnCarrito.onclick = mostrarCarrito;
  if (cerrar) cerrar.onclick = cerrarCarrito;
  if (vaciar) vaciar.onclick = limpiarCarrito;
  if (comprar) comprar.onclick = finalizarCompra;
  if (overlay) overlay.onclick = cerrarCarrito;
});

