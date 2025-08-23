import { del, get, post, put } from "../../../helpers/api.js";
import { confirmar, error, success } from "../../../helpers/alertas.js";
import { cargarSelecrProductos,crearFilaConsumos, crearTabla, quitarFOmatoIso, tienePermiso } from "../../../Modules/modules.js";
import { validar, } from "../../../Modules/validaciones.js";

/**
 * Controlador para la gestión de consumos en una reserva.
 * Permite agregar, editar, eliminar productos consumidos y gestionar el cobro/factura.
 * @param {Object|null} parametros - Objeto con los parámetros de la ruta, debe contener el id de la reserva.
 * No retorna nada, modifica el DOM y realiza peticiones a la API.
 */
export const consumosController = async (parametros = null) => {
    // Obtiene el nombre del usuario
    const nombreUsuario = document.querySelector('.nombreUsuario');
    // Contenedor del formulario para agregar productos
    const contenedorFomrulario = document.querySelector('.contenedorFormularioModal')
    // Elemento para mostrar hora de inicio y fin de la reserva
    const horaInicioFin = document.querySelector('.horaInicioFin');
    // Elemento para mostrar el nombre de la consola
    const cons = document.querySelector('.consola');
    // Elemento para mostrar el precio por hora de la consola
    const precHor = document.querySelector('.precioHora');
    // Botón para agregar producto
    const botonAgregarProducto = document.querySelector('.boton.boton--crear.agregar');
    // Botón para cobrar/facturar
    const botonCobrar = document.querySelector('.boton.boton--crear.cobrar')
    // Select de productos
    const select = document.querySelector('#id_producto');
    // Formulario principal de consumos
    const formulario = document.querySelector('form');
    // Input para cantidad a comprar
    const campoCantAComprar = document.querySelector('#cantidad');
    // Elemento para mostrar cantidades disponibles
    const cantDisponibles = document.querySelector('#cantDisponible');
    // Elemento para mostrar precio unitario
    const precioProducto = document.querySelector('#precio_unidad');
    // Botón para sumar cantidad
    const btnSumar = document.querySelector('#sumar');
    // Botón para restar cantidad
    const btnRestar = document.querySelector('#restar');
    // Input para mostrar subtotal
    const subtotal = document.querySelector('#subtotal');
    // Contenedor del campo de cantidad a comprar
    const contenedorCantComprar = document.querySelector('.contenedorCampo--displayFlex');
    // Contenedor de la tabla de consumos
    const contenedorTabla = document.querySelector('.contenedorTabla');
    //----FORMULARIO EDITAR ----//
    const contenedorFormEditar = document.querySelector('.contenedorFormularioModal.editar')
    const formEditarConsumo = document.querySelector('.formulario.Editar');
    const nombreProd = document.querySelector('#Producto');
    const cantDispo = document.querySelector('.formulario.Editar #cantidades_disponibles');
    const prec = document.querySelector('.formulario.Editar #precio_unidad');
    const cant = document.querySelector('.formulario.Editar #cantidad');
    const subt = document.querySelector('.formulario.Editar #subtotal');
    const btnCancel = document.querySelector('.boton.cancelEdit');
    const btnCobrar = botonCobrar;
    //-----FACTURA-------//
    const contenedorFactura = document.querySelector('.contenedorModal.fac');
    const consumoConsola = document.querySelector('#pago_consola');
    const consumoProductos = document.querySelector('#pago_consumo');
    const totPag = document.querySelector('#total');
    const btnCancelfac = document.querySelector('.boton.canfac');
    const btnConfirCobro = document.querySelector('.boton.cob');
    const selectMetodoPago = document.querySelector('#metodo_pago');
    const lblselecmetodo = document.querySelector('.lbl');


    // Obtiene el usuario actual desde localStorage
    const usu = JSON.parse(localStorage.getItem('usuario'));
    // Extrae el id de la reserva desde los parámetros
    const id_reserva = parametros.id;
    // Obtiene los datos de la reserva desde la API
    const reserva = await get(`reservas/${id_reserva}`);



    // Si el usuario no es admin o la reserva está finalizada, deshabilita acciones
    if (usu.id_rol != 1 || reserva.id_estado_reserva == 4) {
        botonCobrar.textContent = "Factura";
        botonAgregarProducto.classList.add('displayNone');
        btnConfirCobro.classList.add('displayNone');
        btnCancelfac.textContent = "Cerrar";
        selectMetodoPago.classList.add('displayNone');
        lblselecmetodo.classList.add('displayNone');
    } else {
        botonCobrar.textContent = "Cobrar";
        botonAgregarProducto.classList.remove('displayNone');
        btnConfirCobro.classList.remove('displayNone');
        btnCancelfac.textContent = "Cancelar"
        selectMetodoPago.classList.remove('displayNone');
        lblselecmetodo.classList.remove('displayNone');
    }

    // Carga los productos en el select
    cargarSelecrProductos(select);


    // Asigna el id de la reserva a los botones de cobro
    btnCobrar.setAttribute('id', id_reserva)
    botonCobrar.setAttribute('id', id_reserva);





    let usuario;
    // Si el usuario tiene permiso, obtiene los datos completos del usuario de la reserva
    if (tienePermiso("usuarios.index")) {
        usuario = await get(`usuarios/${reserva.id_usuario}`);
    } else usuario = usu;
    // Obtiene la consola de la reserva
    const consola = await get(`consolas/${reserva.id_consola}`);
    // Obtiene el tipo de consola
    const tipoConsola = await get(`tipos/${consola.id_tipo}`);


    /**
     * Carga los consumos de la reserva en la tabla.
     * @param {Array} consumosReserva - Array de consumos de la reserva.
     * @param {HTMLElement} contenedorTabla - Contenedor donde se inserta la tabla.
     * No retorna nada.
     */
    const cargarConsumosReserva = async (consumosReserva, contenedorTabla) => {
        // Limpia el contenido previo de la tabla
        contenedorTabla.innerHTML = '';


        // Si hay consumos, crea la tabla y muestra cada consumo
        if (consumosReserva.length > 0) {
            crearTabla(['producto', 'precio', 'cantidad', 'subtotal'], contenedorTabla);

            const cuerpoTabla = document.querySelector('.tabla__cuerpo');
            if (reserva.id_estado_reserva != 4) {
                for (const consumo of consumosReserva) {
                    await crearFilaConsumos([consumo.nombreProducto, consumo.precioProducto, consumo.cantidad, consumo.subtotal], consumo.idConsumo, cuerpoTabla, reserva)
                }
            } else {
                for (const consumo of consumosReserva) {
                    await crearFilaConsumos([consumo.nombre_producto, consumo.precio_unitario, consumo.cantidad, consumo.subtotal], null, cuerpoTabla, reserva)
                }
            }
        } else {
            // Si no hay consumos, muestra mensaje
            const mensaje = document.createElement('span');
            mensaje.classList.add('MensajeTabla');
            mensaje.textContent = "Aun no hay consumos registrados"
            contenedorTabla.append(mensaje)
        }
    }

    // Obtiene los consumos de la reserva según el estado
    let consumosReserva = null;
    if (reserva.id_estado_reserva == 4) {
        consumosReserva = await get(`detalle-factura-consumos/reservas/${reserva.id}`)
    } else {
        consumosReserva = await get(`consumos/reserva/${id_reserva}`);
    }
    // Carga los consumos en la tabla
    cargarConsumosReserva(consumosReserva, contenedorTabla)

    // Habilita o deshabilita botones según el estado de la reserva
    const btnsTabla = document.querySelectorAll('.registro__boton');
    [...btnsTabla].forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('boton-deshabilitado');
    });
    botonCobrar.disabled = false;
    botonAgregarProducto.disabled = false;
    if (reserva.id_estado_reserva == 1 || reserva.id_estado_reserva == 2) {
        botonCobrar.classList.add('boton-deshabilitado');
        botonCobrar.disabled = true;

    }
    if (reserva.id_estado_reserva == 1 || reserva.id_estado_reserva == 3) {
        [...btnsTabla].forEach(btn => {
            btn.disabled = true;
            btn.classList.add('boton-deshabilitado');
        });
    }
    if (reserva.id_estado_reserva == 1 || reserva.id_estado_reserva == 3) {
    // Se agrega la clase 'boton-deshabilitado' al botón para cambiar su apariencia a deshabilitado
    botonAgregarProducto.classList.add('boton-deshabilitado');
    // Se deshabilita el botón para evitar que el usuario lo presione
    botonAgregarProducto.disabled = true;
    }

    // Se agrega un evento al botón para mostrar el formulario de agregar producto cuando se hace clic
    botonAgregarProducto.addEventListener('click', () => {
        // Se muestra el formulario agregando la clase 'displayFlex' al contenedor
        contenedorFomrulario.classList.add('displayFlex');
    })

    // Se asigna el nombre del usuario al elemento correspondiente en la vista
    nombreUsuario.textContent = usuario.nombre;
    // Se muestra la hora de inicio y finalización de la reserva, quitando el formato ISO
    horaInicioFin.textContent = `${quitarFOmatoIso(reserva.hora_inicio)} - ${quitarFOmatoIso(reserva.hora_finalizacion)}`;
    // Se muestra el nombre de la consola reservada
    cons.textContent = consola.nombre;
    // Se muestra el precio por hora del tipo de consola
    precHor.textContent = `$${tipoConsola.precio_hora} c/h`;

    // Variable de control para la cantidad editada en el formulario de edición
    let cont = 0;

    // Se agrega un listener global para manejar los clicks en toda la ventana
    window.addEventListener('click', async (event) => {
        // Se obtiene el elemento que fue clickeado
        const target = event.target;
        // Si el botón presionado es para sumar cantidad en el formulario de agregar (no edición)
        if (target.classList.contains("sumar") && !target.classList.contains("editar")) {
            // Se obtiene el producto seleccionado mediante una petición GET
            const producto = await get(`productos/${select.value}`);
            // Se obtiene la cantidad actual del campo de cantidad a comprar
            let actual = parseInt(campoCantAComprar.value);
            // Si la cantidad actual es menor a la cantidad disponible del producto
            if (actual < producto.cantidades_disponibles) {
                // Se incrementa la cantidad
                actual++;
                // Se actualiza el campo de cantidad a comprar
                campoCantAComprar.value = actual;
                // Se actualiza el subtotal multiplicando el precio por la cantidad
                subtotal.value = producto.precio * actual;
            }
            // Si existe un mensaje de error previo, se elimina
            if (contenedorCantComprar.nextElementSibling) contenedorCantComprar.nextElementSibling.remove();
        }
        // Si el botón presionado es para restar cantidad en el formulario de agregar (no edición)
        else if (target.classList.contains("restar") && !target.classList.contains("editar")) {
            // Se obtiene el producto seleccionado
            const producto = await get(`productos/${select.value}`);
            // Se obtiene la cantidad actual
            let actual = parseInt(campoCantAComprar.value);
            // Si la cantidad es mayor a 1, se puede restar
            if (actual > 1) {
                // Se decrementa la cantidad
                actual--;
                // Se actualiza el campo de cantidad
                campoCantAComprar.value = actual;
                // Se actualiza el subtotal
                subtotal.value = producto.precio * actual;
            }
        }
        // Si el botón presionado es para sumar cantidad en el formulario de edición
        else if (target.classList.contains("sumar") && target.classList.contains("editar")) {
            // Se obtiene la cantidad actual del campo de edición
            let actual = parseInt(cant.value);
            // Si el contador es menor a la cantidad disponible
            if (cont < parseInt(cantDispo.textContent)) {
                // Se incrementa la cantidad
                actual++;
                // Se incrementa el contador de edición
                cont++;
                // Se actualiza el campo de cantidad
                cant.value = actual;
                // Se actualiza el subtotal multiplicando el precio por la cantidad
                subt.value = parseFloat(prec.textContent) * actual;
            }
        }
        // Si el botón presionado es para restar cantidad en el formulario de edición
        else if (target.classList.contains("restar") && target.classList.contains("editar")) {
            // Se obtiene la cantidad actual
            let actual = parseInt(cant.value);
            // Si la cantidad es mayor a 1, se puede restar
            if (actual > 1) {
                // Se decrementa la cantidad
                actual--;
                // Se decrementa el contador de edición
                cont--;
                // Se actualiza el campo de cantidad
                cant.value = actual;
                // Se actualiza el subtotal
                subt.value = parseFloat(prec.textContent) * actual;
            }
        }
        // Cancelar agregar producto
        // Si el botón presionado es para cancelar el formulario de agregar producto
        else if (target.classList.contains("cancelAgProd")) {
            // Se reinician los valores de los campos del formulario
            select.value = 0;
            cantDisponibles.textContent = 0;
            precioProducto.textContent = 0;
            campoCantAComprar.value = 0;
            subtotal.value = 0;
            // Se cierra el formulario llamando a la función correspondiente
            cerrarFomrulario(contenedorFomrulario);
        }
        // Editar consumo existente
        // Si el botón presionado es para editar un consumo existente
        else if (target.classList.contains("editar") && target.classList.contains("boton--tabla")) {
            // Se obtiene el id del consumo a editar
            const id = target.getAttribute("id");
            // Se obtiene la información del consumo mediante una petición GET
            const consumo = await get(`consumos/dto/${id}`);

            // Se muestran los datos del consumo en el formulario de edición
            nombreProd.textContent = consumo.nombreProducto;
            cantDispo.textContent = consumo.cantidadRestanteProducto;
            prec.textContent = consumo.precioProducto;
            cant.value = consumo.cantidad;
            subt.value = consumo.subtotal;
            // Se asigna el id del consumo al campo oculto del formulario
            document.querySelector("#id_consumo").value = id;
            // Se muestra el formulario de edición
            contenedorFormEditar.classList.add("displayFlex");
        }
        
        // Si el botón presionado es para eliminar un consumo existente
        else if (target.classList.contains("eliminar") && target.classList.contains("boton--tabla")) {
            // Se obtiene el id del consumo a eliminar
            const id = target.getAttribute("id");
            // Se muestra una confirmación al usuario antes de eliminar
            const confirmacion = await confirmar("eliminar el producto");
            // Si el usuario confirma la eliminación
            if (confirmacion.isConfirmed) {
                // Se realiza la petición DELETE para eliminar el consumo
                const respuesta = await del(`consumos/${id}`);
                // Se obtiene la respuesta en formato JSON
                const res = await respuesta.json();
                // Si la respuesta es exitosa
                if (respuesta.ok) {
                    // Se muestra mensaje de éxito
                    await success(res.mensaje);
                    let consu = null;
                    // Si la reserva está finalizada, se obtiene el detalle de factura de consumos
                    if (reserva.id_estado_reserva == 4) {
                        consu = await get(`detalle-factura-consumos/reservas/${reserva.id}`)
                    } else {
                        // Si no, se obtienen los consumos de la reserva
                        consu = await get(`consumos/reserva/${id_reserva}`);
                    }

                    // Se recarga la tabla de consumos
                    cargarConsumosReserva(consu, contenedorTabla)
                } else {
                    // Si hay error, se muestra mensaje de error
                    error(res.error);
                }
            }
        }

    })


    /**
     * Cierra el formulario modal recibido como parámetro.
     * @param {HTMLElement} contenedor - Contenedor del formulario a cerrar.
     */
    /**
     * Cierra el formulario modal recibido como parámetro.
     * @param {HTMLElement} contenedor - Contenedor del formulario a cerrar.
     */
    const cerrarFomrulario = (contenedor) => {
        // Se elimina la clase 'displayFlex' para ocultar el formulario
        contenedor.classList.remove('displayFlex');
    }

    // Evento para actualizar los campos al seleccionar un producto en el formulario de agregar
    select.addEventListener('change', async (event) => {
        // Se obtiene el id del producto seleccionado
        const id = event.target.value;
        // Se reinician los valores de los campos relacionados
        campoCantAComprar.value = 0;
        cantDisponibles.textContent = 0;
        precioProducto.textContent = 0;
        subtotal.value = 0;

        // Si se selecciona un producto válido (id distinto de 0)
        if (id != 0) {
            // Se habilitan los botones de sumar y restar
            btnRestar.disabled = false;
            btnSumar.disabled = false;
            // Se obtiene la información del producto
            const producto = await get(`productos/${id}`);
            // Se muestra la cantidad disponible del producto
            cantDisponibles.textContent = producto.cantidades_disponibles;
            // Se muestra el precio del producto
            precioProducto.textContent = producto.precio;
            // Se inicializa la cantidad a comprar en 1
            campoCantAComprar.value = 1;
            // Se inicializa el subtotal con el precio del producto
            subtotal.value = producto.precio;
        } else {
            // Si no se selecciona producto, se deshabilitan los botones
            btnRestar.disabled = true;
            btnSumar.disabled = true;
        }
    })

    // Evento submit para agregar un consumo
    // Evento submit para agregar un consumo a la reserva
    formulario.addEventListener('submit', async (event) => {
        // Se previene el comportamiento por defecto del formulario
        event.preventDefault();
        // Si la cantidad a comprar es mayor a 0
        if (campoCantAComprar.value > 0) {
            // Si existe un mensaje de error previo, se elimina
            if (contenedorCantComprar.nextElementSibling) contenedorCantComprar.nextElementSibling.remove();
            // Se valida la información del formulario y se obtiene un objeto info
            const info = validar(event);
            // Se asigna el id de la reserva al objeto info
            info['id_reserva'] = Number(id_reserva);
            // Se convierte la cantidad a número
            info['cantidad'] = Number(info['cantidad']);
            // Se convierte el id del producto a número
            info['id_producto'] = Number(info['id_producto'])
            // Se convierte el subtotal a número
            info['subtotal'] = Number(info['subtotal'])

            // Se obtiene el producto seleccionado
            const producto = await get(`productos/${info['id_producto']}`);
            // Se descuenta la cantidad comprada del stock disponible
            producto['cantidades_disponibles'] = producto['cantidades_disponibles'] - info['cantidad'];

            // Se actualiza el producto en la base de datos
            const res = await put(`productos/${producto.id}`, producto);
            // Si la actualización fue exitosa
            if (res.ok) {
                // Se realiza la petición POST para agregar el consumo
                const respuesta = await post('consumos', info);
                // Se obtiene la respuesta en formato JSON
                const res = await respuesta.json();
                // Si la respuesta es exitosa
                if (respuesta.ok) {
                    // Se muestra mensaje de éxito
                    await success(res.mensaje)
                    // Se reinician los campos del formulario
                    select.value = 0;
                    cantDisponibles.textContent = 0;
                    precioProducto.textContent = 0;
                    campoCantAComprar.value = 0;
                    subtotal.textContent = 0;
                    // Se cierra el formulario
                    cerrarFomrulario(contenedorFomrulario);
                    let consu = null;
                    // Si la reserva está finalizada, se obtiene el detalle de factura de consumos
                    if (reserva.id_estado_reserva == 4) {
                        consu = await get(`detalle-factura-consumos/reservas/${reserva.id}`)
                    } else {
                        // Si no, se obtienen los consumos de la reserva
                        consu = await get(`consumos/reserva/${id_reserva}`);
                    }

                    // Se recarga la tabla de consumos
                    cargarConsumosReserva(consu, contenedorTabla)
                }
            }
        } else {
            // Si la cantidad es menor o igual a 0, se muestra mensaje de error
            if (contenedorCantComprar.nextElementSibling) contenedorCantComprar.nextElementSibling.remove();
            // Se crea un elemento span para mostrar el mensaje
            const span = document.createElement('span');
            span.textContent = "la cantidad minima para comprar es 1";
            // Se inserta el mensaje después del contenedor de cantidad
            contenedorCantComprar.insertAdjacentElement('afterend', span);
        }
    })

    // ------------------------------- FORMULARIO EDITAR------------------------------------//
    // Evento submit para editar un consumo existente
    formEditarConsumo.addEventListener('submit', async (event) => {
        // Se valida la información del formulario de edición
        const info = validar(event);
        // Se obtiene el consumo a editar mediante una petición GET
        const consumo = await get(`consumos/${info.id_consumo}`);

        // Se actualiza la cantidad y el subtotal del consumo
        consumo['cantidad'] = Number(info.cantidad);
        consumo['subtotal'] = Number(info.subtotal);

        // Se realiza la petición PUT para actualizar el consumo
        const respuesta = await put('consumos', consumo);
        // Se obtiene la respuesta en formato JSON
        const res = await respuesta.json();

        // Si la respuesta es exitosa
        if (respuesta.ok) {
            // Se muestra mensaje de éxito
            await success(res.mensaje)
            let consu = null;
            // Si la reserva está finalizada, se obtiene el detalle de factura de consumos
            if (reserva.id_estado_reserva == 4) {
                consu = await get(`detalle-factura-consumos/reservas/${reserva.id}`)
            } else {
                // Si no, se obtienen los consumos de la reserva
                consu = await get(`consumos/reserva/${id_reserva}`);
            }

            // Se recarga la tabla de consumos
            cargarConsumosReserva(consu, contenedorTabla)
        }

        // Se cierra el formulario de edición
        cerrarFomrulario(contenedorFormEditar)

    })

    // Evento para cancelar la edición de un consumo y cerrar el formulario
    btnCancel.addEventListener('click', () => {
        // Se cierra el formulario de edición
        cerrarFomrulario(contenedorFormEditar)
    })

    /*------------------COBRAR-------------------------*/

    // Evento para cobrar la reserva y mostrar la factura
    btnCobrar.addEventListener('click', async (event) => {
        // Se obtiene el id de la reserva a cobrar
        const id_reser = event.target.getAttribute('id');

        // Se realiza la petición POST para generar la factura de la reserva
        const factura = await post(`facturas/reserva/${id_reser}`);

        // Se obtiene la respuesta en formato JSON
        const res = await factura.json();
        // Si la respuesta no es exitosa, se muestra mensaje de error
        if (!factura.ok) error(res.error)

        // Se imprime la respuesta en consola (para depuración)
        console.log(res);

        // Se obtiene el subtotal de la consola y se muestra en la vista
        const consCons = res.subtotalConsola + "";
        const con = consCons.split('.');
        consumoConsola.textContent = con[0];

        // Se obtiene el total y se muestra en la vista
        const t = res.total + "";
        const to = t.split('.');
        consumoProductos.textContent = res.subtotalConsumos;
        totPag.textContent = `Total: ${to[0]}`;

        // Se muestra el contenedor de la factura
        contenedorFactura.classList.add('displayFlex');

    })

    // Evento para cancelar la visualización de la factura y ocultar el contenedor
    btnCancelfac.addEventListener('click', () => {
        // Se oculta el contenedor de la factura
        contenedorFactura.classList.remove('displayFlex');

    })

    // Si el usuario tiene permiso para ver los métodos de pago
    if (tienePermiso("metodos.index")) {

        // Se obtienen los métodos de pago mediante una petición GET
        const metodosPago = await get('metodospago');

        // Por cada método de pago recibido
        metodosPago.forEach(metodo => {
            // Se crea una opción para el select
            const option = document.createElement('option');
            // Se asigna el valor del id del método de pago
            option.setAttribute('value', metodo.id);
            // Se asigna el texto del método de pago
            option.textContent = metodo.metodoPago;
            // Se agrega la opción al select de métodos de pago
            selectMetodoPago.append(option);
        });
    }

    // Evento para confirmar el cobro y registrar el pago de la reserva
    btnConfirCobro.addEventListener('click', async () => {
        // Se realiza la petición POST para generar la factura de la reserva
        const factura = await post(`facturas/reserva/${id_reserva}`);
        // Se obtiene la respuesta en formato JSON
        const fac = await factura.json();

        // Si se seleccionó un método de pago válido
        if (selectMetodoPago.value != 0) {
            // Se realiza la petición POST para registrar el pago de la factura con el método seleccionado
            const pago = await post(`facturas/pago/${fac.id}/${selectMetodoPago.value}`);
            // Se obtiene la respuesta en formato JSON
            const pag = await pago.json();

            // Si el pago fue exitoso
            if (pago.ok) {
                // Se muestra mensaje de éxito
                await success(pag.mensaje);
                // Se oculta el contenedor de la factura
                contenedorFactura.classList.remove('displayFlex');
                // Se redirige a la vista de reservas
                window.location.href = "#/Reservas";
            }
        } else {
            // Si no se seleccionó método de pago, se muestra mensaje de error
            error('Debe seleccionar primero el metodo de pago');
        }
    })


}