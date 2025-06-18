document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos-lista'); 
    const btnCarrito = document.getElementById('btn-carrito');
    const carritoPanel = document.querySelector('.carrito-panel');
    const cerrarCarritoPanelBtn = document.getElementById('cerrar-carrito-panel');
    const listaCarritoPanel = document.getElementById('lista-carrito-panel');
    const totalCarritoPanel = document.getElementById('total-carrito-panel');
    const vaciarCarritoPanelBtn = document.getElementById('vaciar-carrito-panel');
    const procederAlPagoBtn = document.getElementById('proceder-al-pago'); 
    const overlay = document.querySelector('.overlay'); 

    const carritoView = document.getElementById('carrito-view');
    const checkoutFormView = document.getElementById('checkout-form-view');
    const orderSummaryView = document.getElementById('order-summary-view');

    const datosClienteForm = document.getElementById('datos-cliente-form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const direccionInput = document.getElementById('direccion');
    const ciudadInput = document.getElementById('ciudad');
    const codigoPostalInput = document.getElementById('codigoPostal');
    const notasInput = document.getElementById('notas');

    const volverAlCarritoBtn = document.getElementById('volver-al-carrito');
    const confirmarDatosBtn = document.getElementById('confirmar-datos');
    const editarDatosBtn = document.getElementById('editar-datos');
    const finalizarPedidoWhatsappBtn = document.getElementById('finalizar-pedido-whatsapp');

    const resumenContenido = document.getElementById('resumen-contenido');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const guardarCarrito = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    };

    const renderizarCarrito = () => {
        listaCarritoPanel.innerHTML = ''; 
        let total = 0;
        const carritoVacioMsg = carritoPanel.querySelector('.carrito-vacio-msg');
        const cartButtons = carritoPanel.querySelector('.cart-buttons');

        if (carrito.length === 0) {
            carritoVacioMsg.style.display = 'block';
            cartButtons.style.display = 'none'; 
        } else {
            carritoVacioMsg.style.display = 'none';
            cartButtons.style.display = 'flex'; 
            
            carrito.forEach(producto => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="item-info">
                        ${producto.name} x ${producto.quantity} 
                    </div>
                    <div class="item-quantity-control">
                        <button class="decrease-quantity" data-id="${producto.id}">-</button>
                        <input type="number" value="${producto.quantity}" min="1" readonly>
                        <button class="increase-quantity" data-id="${producto.id}">+</button>
                    </div>
                    <span class="item-price">$${(producto.price * producto.quantity).toLocaleString('es-AR')}</span>
                    <button class="remove-item-btn" data-id="${producto.id}">&times;</button>
                `;
                listaCarritoPanel.appendChild(li);
                total += producto.price * producto.quantity;
            });
        }
        totalCarritoPanel.textContent = total.toLocaleString('es-AR');
        actualizarContadorCarrito();
    };

    const actualizarContadorCarrito = () => {
        const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
        btnCarrito.innerHTML = `🛒 Carrito (${totalItems})`;
    };

    const agregarAlCarrito = (productoId, productoNombre, productoPrecio) => {
        const productoExistente = carrito.find(p => p.id === productoId);

        if (productoExistente) {
            productoExistente.quantity++;
        } else {
            carrito.push({
                id: productoId,
                name: productoNombre,
                price: productoPrecio,
                quantity: 1
            });
        }
        guardarCarrito();
        mostrarMensaje('Producto añadido al carrito', 'success');
    };

    const eliminarDelCarrito = (productoId) => {
        carrito = carrito.filter(producto => producto.id !== productoId);
        guardarCarrito();
        mostrarMensaje('Producto eliminado del carrito', 'info');
    };

    const cambiarCantidad = (productoId, delta) => {
        const producto = carrito.find(p => p.id === productoId);
        if (producto) {
            producto.quantity += delta;
            if (producto.quantity <= 0) {
                eliminarDelCarrito(productoId);
            } else {
                guardarCarrito();
            }
        }
    };

    const vaciarCarrito = () => {
        carrito = [];
        guardarCarrito();
        mostrarMensaje('Carrito vaciado', 'info');
        mostrarVista('carrito-view');
    };

    const mostrarMensaje = (mensaje, tipo) => {
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            document.body.appendChild(messageContainer);
        }

        messageContainer.textContent = mensaje;
        messageContainer.setAttribute('data-type', tipo);
        messageContainer.classList.add('show');

        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 3000);
    };

    const mostrarVista = (vistaId) => {
        carritoView.classList.add('hidden');
        checkoutFormView.classList.add('hidden');
        orderSummaryView.classList.add('hidden');

        document.getElementById(vistaId).classList.remove('hidden');

        const carritoTitle = carritoPanel.querySelector('h2');
        if (vistaId === 'carrito-view') {
            carritoTitle.textContent = 'Tu Carrito';
        } else if (vistaId === 'checkout-form-view') {
            carritoTitle.textContent = 'Datos de Envío';
        } else if (vistaId === 'order-summary-view') {
            carritoTitle.textContent = 'Confirmar Pedido';
        }
    };

    const rellenarFormulario = () => {
        const datosGuardados = JSON.parse(localStorage.getItem('datosCliente')) || {};
        nombreInput.value = datosGuardados.nombre || '';
        emailInput.value = datosGuardados.email || '';
        telefonoInput.value = datosGuardados.telefono || '';
        direccionInput.value = datosGuardados.direccion || '';
        ciudadInput.value = datosGuardados.ciudad || '';
        codigoPostalInput.value = datosGuardados.codigoPostal || '';
        notasInput.value = datosGuardados.notas || '';
    };

    const guardarDatosCliente = () => {
        const datos = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            direccion: direccionInput.value,
            ciudad: ciudadInput.value,
            codigoPostal: codigoPostalInput.value,
            notas: notasInput.value
        };
        localStorage.setItem('datosCliente', JSON.stringify(datos));
    };

    const generarResumenPedido = () => {
        const datosCliente = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            direccion: direccionInput.value,
            ciudad: ciudadInput.value,
            codigoPostal: codigoPostalInput.value,
            notas: notasInput.value
        };

        let resumenHTML = `
            <h4>Datos del Cliente:</h4>
            <p><strong>Nombre:</strong> ${datosCliente.nombre}</p>
            <p><strong>Email:</strong> ${datosCliente.email}</p>
            <p><strong>Teléfono:</strong> ${datosCliente.telefono}</p>
            <p><strong>Dirección:</strong> ${datosCliente.direccion}, ${datosCliente.ciudad}, ${datosCliente.codigoPostal}</p>
            ${datosCliente.notas ? `<p><strong>Notas:</strong> ${datosCliente.notas}</p>` : ''}
            
            <h4>Productos:</h4>
            <ul>
        `;

        let totalResumen = 0;
        carrito.forEach(item => {
            resumenHTML += `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}</li>`;
            totalResumen += item.price * item.quantity;
        });

        resumenHTML += `
            </ul>
            <p><strong>Total Final: $${totalResumen.toLocaleString('es-AR')}</strong></p>
        `;
        resumenContenido.innerHTML = resumenHTML;
    };

    const generarEnlaceWhatsApp = () => {
        const datosCliente = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            direccion: direccionInput.value,
            ciudad: ciudadInput.value,
            codigoPostal: codigoPostalInput.value,
            notas: notasInput.value
        };

        let mensaje = `¡Hola! Me gustaría hacer un pedido desde tu tienda online.\n\n`;
        mensaje += `*Datos del Cliente:*\n`;
        mensaje += `Nombre: ${datosCliente.nombre}\n`;
        mensaje += `Email: ${datosCliente.email}\n`;
        mensaje += `Teléfono: ${datosCliente.telefono}\n`;
        mensaje += `Dirección: ${datosCliente.direccion}, ${datosCliente.ciudad}, ${datosCliente.codigoPostal}\n`;
        if (datosCliente.notas) {
            mensaje += `Notas: ${datosCliente.notas}\n`;
        }
        mensaje += `\n*Detalle del Pedido:*\n`;

        let total = 0;
        carrito.forEach(item => {
            mensaje += `- ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
            total += item.price * item.quantity;
        });
        mensaje += `\n*Total a Pagar: $${total.toLocaleString('es-AR')}*\n\n`;
        mensaje += `¡Espero tu confirmación!`;

        const numeroWhatsApp = '5493442530793'; // Tu número de WhatsApp
        const enlace = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(enlace, '_blank');

        mostrarMensaje('Pedido enviado por WhatsApp!', 'success');
        vaciarCarrito(); 
        mostrarVista('carrito-view'); 
        datosClienteForm.reset(); 
    };


    btnCarrito.addEventListener('click', () => {
        carritoPanel.classList.add('mostrar');
        overlay.classList.add('mostrar');
        mostrarVista('carrito-view');
        renderizarCarrito(); 
    });

    cerrarCarritoPanelBtn.addEventListener('click', () => {
        carritoPanel.classList.remove('mostrar');
        overlay.classList.remove('mostrar');
    });

    overlay.addEventListener('click', () => {
        carritoPanel.classList.remove('mostrar');
        overlay.classList.remove('mostrar');
    });

    productosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            agregarAlCarrito(id, name, price);
        }
    });

    listaCarritoPanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const id = e.target.dataset.id;
            eliminarDelCarrito(id);
        } else if (e.target.classList.contains('increase-quantity')) {
            const id = e.target.dataset.id;
            cambiarCantidad(id, 1);
        } else if (e.target.classList.contains('decrease-quantity')) {
            const id = e.target.dataset.id;
            cambiarCantidad(id, -1);
        }
    });

    vaciarCarritoPanelBtn.addEventListener('click', vaciarCarrito);

    procederAlPagoBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            mostrarMensaje('Tu carrito está vacío. Agrega productos para continuar.', 'error');
            return;
        }
        rellenarFormulario(); 
        mostrarVista('checkout-form-view');
    });

    volverAlCarritoBtn.addEventListener('click', () => {
        mostrarVista('carrito-view');
    });

    editarDatosBtn.addEventListener('click', () => {
        mostrarVista('checkout-form-view');
        nombreInput.focus();
    });

    datosClienteForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const requiredFields = [nombreInput, emailInput, telefonoInput, direccionInput, ciudadInput, codigoPostalInput];
        let formValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid'); 
                formValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!formValid) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        guardarDatosCliente(); 
        generarResumenPedido(); 
        mostrarVista('order-summary-view'); 
    });

    finalizarPedidoWhatsappBtn.addEventListener('click', generarEnlaceWhatsApp);
    renderizarCarrito();
    actualizarContadorCarrito();
});



