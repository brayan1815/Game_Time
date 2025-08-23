import { error, success } from "../helpers/alertas.js";
import { get, post, postSinToken } from "../helpers/api.js";
import {
  validar
} from "./validaciones.js";

/**
 * Crea una tabla HTML y la inserta en el contenedor indicado.
 * @param {Array} encabezados - Arreglo de strings con los nombres de los encabezados.
 * @param {HTMLElement} contenedor - Elemento donde se insertará la tabla.
 * No retorna nada, modifica el DOM.
 */
export const crearTabla = (encabezados, contenedor) => {
  // Crea el elemento table
  const tabla = document.createElement('table');
  // Agrega la clase 'tabla' a la tabla
  tabla.classList.add('tabla');

  // Crea el elemento thead para los encabezados
  const encabezado = document.createElement('thead');
  // Crea el elemento tbody para el cuerpo de la tabla
  const cuerpo = document.createElement('tbody');
  // Agrega la clase al cuerpo
  cuerpo.classList.add('tabla__cuerpo')
  // Agrega la clase al encabezado
  encabezado.classList.add('tabla__encabezado');

  // Crea la fila de encabezados
  const fila = document.createElement('tr');

  // Recorre cada encabezado y lo agrega como th
  encabezados.forEach(item => {
    // Crea el elemento th
    const campo = document.createElement('th');
    // Asigna el texto del encabezado
    campo.textContent = item;
    // Agrega el th a la fila
    fila.append(campo);
  });
  // Agrega la fila al thead
  encabezado.append(fila)
  // Agrega thead y tbody a la tabla
  tabla.append(encabezado, cuerpo)

  // Inserta la tabla en el contenedor
  contenedor.append(tabla)
}

/**
 * Crea una fila de tabla con los datos y botones de acción.
 * @param {Array} info - Datos a mostrar en la fila.
 * @param {string|number} id - Identificador único de la fila.
 * @param {HTMLElement} contenedor - Elemento tbody donde se inserta la fila.
 * @param {string} hash - Hash para la ruta de edición.
 * @param {boolean} rojo - Si es true, la fila tendrá borde rojo.
 * @param {boolean} botones - Si es true, agrega botones de acción.
 * No retorna nada, modifica el DOM.
 */
export const crearFila = (info, id, contenedor, hash, rojo = false, botones = true) => {
  // Crea la fila
  const fila = document.createElement('tr');
  // Agrega la clase a la fila
  fila.classList.add('tabla__fila');
  // Asigna el id a la fila
  fila.setAttribute('id', `fila_${id}`);

  // Recorre los datos y los agrega como celdas
  info.forEach(item => {
    // Crea la celda
    const campo = document.createElement('td');
    // Si es rojo, agrega clase de borde rojo
    if (rojo) {
      campo.classList.add('tabla__campo', 'tabla__campo--bordeRojo');
    }
    // Si no, agrega clase de borde verde
    else {
      campo.classList.add('tabla__campo', 'tabla__campo--bordeVerde');
    }
    // Asigna el texto a la celda
    campo.textContent = item;
    // Agrega la celda a la fila
    fila.append(campo);
  });

  // Crea la celda para los botones
  const campo = document.createElement('td');
  // Aplica la clase según el color
  if (rojo) campo.classList.add('tabla__campo', 'tabla__campo--bordeRojo');
  else {
    campo.classList.add('tabla__campo', 'tabla__campo--bordeVerde');
  }

  // Crea el contenedor de botones
  const contenedorBotones = document.createElement('div');
  contenedorBotones.classList.add('contenedorBotonesTabla');

  // Si no es rojo, agrega el botón eliminar
  if (!rojo) {
    const botonEliminar = document.createElement('button');
    botonEliminar.classList.add('boton', 'boton--tabla', 'eliminar')

    const iconoEliminar = document.createElement('i');
    iconoEliminar.classList.add('bi', 'bi-trash-fill');

    botonEliminar.append(iconoEliminar);
    botonEliminar.setAttribute('id', id)

    contenedorBotones.append(botonEliminar);
  }

  // Crea el botón editar
  const botonEditar = document.createElement('a');
  botonEditar.classList.add('boton', 'boton--tabla', 'editar')
  botonEditar.setAttribute('id', id);
  botonEditar.setAttribute('href', `#/${hash}/id=${id}`)

  const iconoEditar = document.createElement('i');
  iconoEditar.classList.add('bi', 'bi-pencil-square');

  botonEditar.append(iconoEditar);
  contenedorBotones.append(botonEditar);

  campo.append(contenedorBotones);
  // Si se deben mostrar los botones, agrega la celda a la fila
  if (botones) {
    fila.append(campo)
  }

  // Agrega la fila al contenedor
  contenedor.append(fila);
}

/**
 * Crea una fila de consumos para una reserva en la tabla de consumos.
 * @param {Array} info - Array con los datos a mostrar en la fila (cada item es una celda).
 * @param {string|number} id - Identificador único de la fila de consumo.
 * @param {HTMLElement} contenedor - Elemento tbody donde se inserta la fila.
 * @param {Object} reserva - Objeto reserva para validar el estado de la reserva.
 * No retorna nada, modifica el DOM.
 */
export const crearFilaConsumos = (info, id, contenedor, reserva) => {
  // Crea el elemento tr para la fila
  const fila = document.createElement('tr');
  // Agrega la clase para el estilo de la fila
  fila.classList.add('tabla__fila');
  // Asigna el id único a la fila para identificarla en el DOM
  fila.setAttribute('id', `consumo_${id}`)
  // Obtiene el usuario actual desde el localStorage para validar permisos
  const usu = JSON.parse(localStorage.getItem('usuario'));

  // Recorre cada dato de info y lo agrega como celda a la fila
  info.forEach(item => {
    // Crea la celda td
    const campo = document.createElement('td');
    // Agrega las clases de estilo a la celda
    campo.classList.add('tabla__campo', 'tabla__campo--bordeVerde');
    // Asigna el texto del dato a la celda
    campo.textContent = item;
    // Agrega la celda a la fila
    fila.append(campo);
  });

  // Si la reserva no está cancelada y el usuario no es de rol 2 (por ejemplo, admin o encargado)
  if (reserva.id_estado_reserva != 4 && usu.id_rol != 2) {
    // Crea una celda extra para los botones de acción
    const campo = document.createElement('td');
    // Aplica el borde verde a la celda de botones
    campo.classList.add('tabla__campo', 'tabla__campo--bordeVerde');

    // Crea el contenedor de botones para agruparlos visualmente
    const contenedorBotones = document.createElement('div');
    contenedorBotones.classList.add('contenedorBotonesTabla');

    // Crea el botón eliminar
    const botonEliminar = document.createElement('button');
    // Agrega las clases para el estilo del botón eliminar
    botonEliminar.classList.add('boton', 'boton--tabla', 'eliminar')

    // Crea el ícono de eliminar y lo agrega al botón
    const iconoEliminar = document.createElement('i');
    iconoEliminar.classList.add('bi', 'bi-trash-fill');

    // Inserta el ícono dentro del botón eliminar
    botonEliminar.append(iconoEliminar);
    // Agrega el botón eliminar al contenedor de botones
    contenedorBotones.append(botonEliminar);

    // Crea el botón editar
    const botonEditar = document.createElement('button');
    botonEditar.classList.add('boton', 'boton--tabla', 'editar')
    botonEditar.setAttribute('id', id);

    const iconoEditar = document.createElement('i');
    iconoEditar.classList.add('bi', 'bi-pencil-square');
    botonEliminar.setAttribute('id', id)

    botonEditar.append(iconoEditar);
    contenedorBotones.append(botonEditar);

    campo.append(contenedorBotones);
    fila.append(campo)
  }


  contenedor.append(fila);//agrega al contenedor la fila
}

/**
 * Quita el formato ISO de una fecha, reemplazando la T por un espacio para hacerla más legible.
 * @param {string} fecha - Fecha en formato ISO (ejemplo: 2025-08-23T15:00:00).
 * @returns {string} La fecha con el formato modificado (ejemplo: 2025-08-23 15:00:00).
 */
export function quitarFOmatoIso(fecha) {
  // Reemplaza la letra T por un espacio en la cadena de fecha
  return fecha.replace("T", " ");
}

/**
 * Crea una fila de tabla para mostrar la información de una reserva.
 * @param {Object} info - Objeto con la información de la reserva (documentoUsuario, nombreUsuario, horaInicio, horaFinalizacion, nombreConsola, idEstadoReserva).
 * @param {Number} id - Identificador único de la reserva.
 * @param {HTMLElement} contenedor - Elemento tbody donde se inserta la fila.
 * @param {boolean} historial - Si es true, la fila es para historial y cambia el enlace de acción.
 * No retorna nada, modifica el DOM.
 */
export const crearFilaTablaReservas = async (info, id, contenedor, historial = false) => {
  // Crea el elemento tr para la fila de la reserva
  const fila = document.createElement('tr');
  // Asigna el id único a la fila
  fila.setAttribute('id', `reserva_${id}`);
  // Agrega la clase general de fila de tabla
  fila.classList.add('tabla__fila')

  // Aplica color según el estado de la reserva
  if (info.idEstadoReserva == 1) fila.classList.add('tabla__fila--blanco'); // Pendiente
  else if (info.idEstadoReserva == 2) fila.classList.add('tabla__fila--verde'); // Activa
  else if (info.idEstadoReserva == 3) fila.classList.add('tabla__fila--rojo'); // Finalizada

  // Crea las celdas para cada dato de la reserva
  const campoDocumento = document.createElement('td'); // Celda para el documento del usuario
  const campoUsuario = document.createElement('td');   // Celda para el nombre del usuario
  const HoraInicio = document.createElement('td');     // Celda para la hora de inicio
  const HoraFin = document.createElement('td');        // Celda para la hora de finalización
  const Consola = document.createElement('td');        // Celda para el nombre de la consola
  const Boton = document.createElement('td');          // Celda para el botón de acción

  // Aplica las clases de estilo a cada celda
  campoDocumento.classList.add('tabla__campo');
  campoUsuario.classList.add('tabla__campo');
  HoraInicio.classList.add('tabla__campo');
  HoraFin.classList.add('tabla__campo');
  Consola.classList.add('tabla__campo');
  Boton.classList.add('tabla__campo');

  // Asigna los valores a cada celda
  campoDocumento.textContent = info.documentoUsuario;
  campoUsuario.textContent = info.nombreUsuario;
  HoraInicio.textContent = quitarFOmatoIso(String(info.horaInicio));
  HoraFin.textContent = quitarFOmatoIso(String(info.horaFinalizacion));
  Consola.textContent = info.nombreConsola;

  // Crea el enlace de acción (ver info o consumos)
  const bot = document.createElement('a');
  if (historial) {
    // Si es historial, el enlace lleva a la info del historial
    bot.setAttribute('href', `#/Historial/Info/id=${id}`)
  } else {
    // Si no, el enlace lleva a los consumos de la reserva
    bot.setAttribute('href', `#/Reservas/Consumos/id=${id}`)
  }
  // Aplica clases y atributos al botón
  bot.classList.add('boton', 'boton--tabla', 'Info');
  bot.setAttribute('id', id)
  // Crea el ícono de info y lo agrega al botón
  const iconBot = document.createElement('i');
  iconBot.classList.add('bi', 'bi-info-circle');
  bot.append(iconBot);

  // Agrega el botón a la celda correspondiente
  Boton.append(bot);

  // Agrega todas las celdas a la fila
  fila.append(campoDocumento, campoUsuario, HoraInicio, HoraFin, Consola, Boton);

  // Si no es historial, agrega el botón de cancelar
  if (historial == false) {
    // Crea la celda para el botón cancelar
    const BotonCan = document.createElement('td');
    BotonCan.classList.add('tabla__campo');

    // Crea el botón cancelar
    const btnCan = document.createElement('button');
    btnCan.classList.add('boton', 'boton--tabla', 'cancel');
    btnCan.setAttribute('id', id);
    // Crea el ícono de cancelar y lo agrega al botón
    const ic = document.createElement('i');
    ic.classList.add('bi', 'bi-ban');
    btnCan.append(ic)

    // Agrega borde verde a la fila
    fila.classList.add('borde-verde')

    // Agrega el botón cancelar a la celda y la celda a la fila
    BotonCan.append(btnCan);
    fila.append(BotonCan)
  }

  // Inserta la fila en el contenedor (tbody)
  contenedor.append(fila)
  // Si es historial, aplica borde verde a todas las celdas
  if (historial) {
    const campos = document.querySelectorAll('.tabla__campo');
    [...campos].forEach(campo => {
      campo.classList.add('.tabla__campo', 'tabla__campo--bordeVerde')
    });
  }
}


/**
 * Cuenta la cantidad de campos requeridos en un formulario HTML.
 * @param {HTMLFormElement} formulario - Formulario a analizar.
 * @returns {number} Cantidad de campos con el atributo required.
 */
export const contarCamposFormulario = (formulario) => {
  // Convierte el formulario en un array y filtra los campos que tienen el atributo required
  const campos = [...formulario].filter((campo) => campo.hasAttribute('required'));
  // Retorna la cantidad de campos requeridos
  return campos.length;
}

/**
 * Crea y muestra cards de productos en el contenedor indicado.
 * @param {Array} productos - Arreglo de productos a mostrar (cada producto es un objeto con info de producto).
 * @param {HTMLElement} contenedor - Elemento donde se insertan las cards.
 * No retorna nada, modifica el DOM.
 */
export const crearCardsProductos = async (productos, contenedor) => {
  // Recorre cada producto del array
  for (const producto of productos) {
    // Si el producto está eliminado (estado 3), lo omite
    if (producto.id_estado_producto == 3) continue
    // Obtiene la imagen del producto desde la API
    const imagen = await get(`imagenes/${producto.id_imagen}`);
    // Crea el contenedor principal de la card
    const card = document.createElement('div');
    // Asigna un id único a la card
    card.setAttribute('id', 'card_' + producto.id)
    // Agrega la clase general de card
    card.classList.add('card');
    // Si el producto está inactivo (estado 2), agrega borde rojo
    if (producto.id_estado_producto == 2) card.classList.add('card--bordeRojo')

    // Crea el elemento img para la imagen del producto
    const imagenCard = document.createElement('img');
    // Asigna la ruta de la imagen
    imagenCard.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    // Agrega la clase de estilo a la imagen
    imagenCard.classList.add('card__imagen');
    // Inserta la imagen en la card
    card.append(imagenCard)

    // Crea una línea separadora visual
    const lineaSeparadora = document.createElement('hr');
    lineaSeparadora.classList.add('card__linea');
    // Si el producto está inactivo, la línea es roja
    if (producto.id_estado_producto == 2) lineaSeparadora.classList.add('card__linea--roja')
    // Inserta la línea en la card
    card.append(lineaSeparadora);

    // Crea y agrega el nombre del producto
    const cardNombre = document.createElement('h3');
    cardNombre.classList.add('card__nombre');
    cardNombre.textContent = producto.nombre;
    card.append(cardNombre);

    // Crea y agrega la descripción del producto
    const cardDescripcion = document.createElement('p');
    cardDescripcion.classList.add('card__descripcion');
    cardDescripcion.textContent = producto.descripcion;
    card.append(cardDescripcion);

    // Crea y agrega el precio del producto
    const cardPrecio = document.createElement('h3');
    cardPrecio.classList.add('card__precio');
    cardPrecio.textContent = `$${producto.precio}`;
    card.append(cardPrecio);

    // Crea y agrega la cantidad restante del producto
    const cantRest = document.createElement('h3');
    cantRest.classList.add('card__cantidades');
    cantRest.textContent = `Cantidades restantes: ${producto.cantidades_disponibles}`;
    card.append(cantRest);

    // // Obtiene el usuario actual (por si se requiere para permisos)
    // const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Crea el contenedor de botones de acción para la card
    const contenedorBotones = document.createElement('div');
    contenedorBotones.classList.add('card__botones');

    // Si el usuario tiene permiso para editar productos, agrega el botón editar
    if (tienePermiso('productos.editar')) {
      const botonEditar = document.createElement('a');
      botonEditar.setAttribute('id', producto.id);
      botonEditar.setAttribute('href', `#/Productos/Editar/id=${producto.id}`)
      botonEditar.classList.add('boton', 'boton--cardIcono', 'editar');

      const iconoEditar = document.createElement('i');
      iconoEditar.classList.add('bi', 'bi-pencil-square');
      // iconoEditar.classList.add('bi','bi-pencil-square')
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
    }

    // Si el usuario tiene permiso para eliminar productos, agrega el botón eliminar
    if (tienePermiso('productos.eliminar')) {
      const botonEliminar = document.createElement('button');
      botonEliminar.setAttribute('id', producto.id)
      botonEliminar.classList.add('boton', 'boton--cardIcono', 'eliminar');

      const iconoEliminar = document.createElement('i');
      iconoEliminar.classList.add('bi', 'bi-trash-fill');
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
    }

    // Agrega el contenedor de botones a la card
    card.append(contenedorBotones);
    // Inserta la card en el contenedor principal
    contenedor.append(card);
  }
}

/**
 * Carga y muestra cards de consolas en el contenedor indicado.
 * @param {Array} consolas - Arreglo de consolas a mostrar (cada consola es un objeto con info de consola).
 * @param {HTMLElement} contenedor - Elemento donde se insertan las cards.
 * No retorna nada, modifica el DOM.
 */
export const cargarCardsConsolas = async (consolas, contenedor) => {
  // Limpia el contenido previo del contenedor
  contenedor.innerHTML = "";
  // Recorre cada consola del array
  for (const consola of consolas) {
    // Crea el contenedor principal de la card
    const card = document.createElement('div');
    // Si la consola está inactiva (estado 2), agrega borde rojo
    if (consola.idEstado == 2) {
      card.classList.add('card', 'card--bordeRojo', 'card--horizontal');
    } else {
      card.classList.add('card', 'card--horizontal');
    }
    // Asigna un id único a la card
    card.setAttribute('id', `consola_${consola.id}`)

    // Obtiene la imagen de la consola desde la API
    const imagen = await get(`imagenes/${consola.idImagen}`);

    // Crea el elemento img para la imagen de la consola
    const img_card = document.createElement('img');
    img_card.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    img_card.classList.add('card__imagen');
    // Inserta la imagen en la card
    card.append(img_card)

    // Crea el contenedor de información de la card
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo');

    // Crea y agrega el nombre de la consola
    const cardName = document.createElement('h3');
    cardName.classList.add('card__nombre');
    cardName.textContent = consola.nombre;
    cardInfo.append(cardName);

    // Crea y agrega la descripción de la consola
    const cardDescripcion = document.createElement('p');
    cardDescripcion.classList.add('card__descripcion', 'card__descripcion--consola');
    cardDescripcion.textContent = consola.descripcion;
    cardInfo.append(cardDescripcion)

    // Crea y agrega el precio por hora de la consola
    const cardPrecio = document.createElement('h3');
    cardPrecio.classList.add('card__precio');
    cardPrecio.textContent = `$${consola.precioHora}`;
    cardInfo.append(cardPrecio);

    // Obtiene el usuario actual (por si se requiere para permisos)
    // const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Crea el contenedor de botones de acción para la card
    const contenedorBotones = document.createElement('div');
    contenedorBotones.classList.add('card__botones');

    // Si el usuario tiene permiso para editar consolas, agrega el botón editar
    if (tienePermiso('consolas.editar')) {
      const botonEditar = document.createElement('a');
      botonEditar.setAttribute('id', consola.id);
      botonEditar.setAttribute('href', `#/Consolas/Editar/id=${consola.id}`)
      botonEditar.classList.add('boton', 'boton--cardIcono', 'editar');

      const iconoEditar = document.createElement('i');
      iconoEditar.classList.add('bi', 'bi-pencil-square');
      // iconoEditar.classList.add('bi','bi-pencil-square')
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
    }
    // Si el usuario tiene permiso para eliminar consolas y la consola está activa, agrega el botón eliminar
    if (tienePermiso('consolas.eliminar') && consola.idEstado != 2) {
      const botonEliminar = document.createElement('button');
      botonEliminar.setAttribute('id', consola.id)
      botonEliminar.classList.add('boton', 'boton--cardIcono', 'eliminar');

      const iconoEliminar = document.createElement('i');
      iconoEliminar.classList.add('bi', 'bi-trash-fill');
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
    }

    // Agrega el contenedor de botones a la info de la card
    cardInfo.append(contenedorBotones);
    // Agrega la info a la card principal
    card.append(cardInfo)
    // Inserta la card en el contenedor principal
    contenedor.append(card)
  }
}

/**
 * Carga y muestra cards de consolas disponibles para reservar.
 * @param {Array} consolas - Arreglo de consolas a mostrar (cada consola es un objeto con info de consola).
 * @param {HTMLElement} contenedor - Elemento donde se insertan las cards.
 * No retorna nada, modifica el DOM.
 */
export const cargarCardsConsolasReservar = async (consolas, contenedor) => {
  // Recorre cada consola del array
  for (const consola of consolas) {
    // Si la consola está inactiva (estado 2), la omite
    if (consola.id_estado == 2) continue

    // Crea el contenedor principal de la card
    const card = document.createElement('div');
    card.classList.add('card', 'card--horizontal');

    // Obtiene la imagen de la consola desde la API
    const imagen = await get(`imagenes/${consola.id_imagen}`);

    // Crea el elemento img para la imagen de la consola
    const img_card = document.createElement('img');
    img_card.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    img_card.classList.add('card__imagen');
    // Inserta la imagen en la card
    card.append(img_card)

    // Crea el contenedor de información de la card
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo');

    // Crea y agrega el nombre de la consola
    const cardName = document.createElement('h3');
    cardName.classList.add('card__nombre');
    cardName.textContent = consola.nombre;
    cardInfo.append(cardName);

    // Crea y agrega la descripción de la consola
    const cardDescripcion = document.createElement('p');
    cardDescripcion.classList.add('card__descripcion', 'card__descripcion--consola');
    cardDescripcion.textContent = consola.descripcion;
    cardInfo.append(cardDescripcion)

    // Obtiene el tipo de consola para mostrar el precio por hora
    const tipo = await get(`tipos/${consola.id_tipo}`)

    // Crea y agrega el precio por hora de la consola
    const cardPrecio = document.createElement('h3');
    cardPrecio.classList.add('card__precio');
    cardPrecio.textContent = `$${tipo.precio_hora}`;
    cardInfo.append(cardPrecio);

    // Crea el contenedor de botones de acción para la card
    const contenedorBotones = document.createElement('div');
    contenedorBotones.classList.add('card__botones');

    // Crea el botón para reservar la consola
    const botonReservar = document.createElement('button');
    botonReservar.textContent = "Reservar";
    botonReservar.id = consola.id;
    botonReservar.classList.add('boton', 'boton--textoCard')
    contenedorBotones.append(botonReservar)

    // Agrega el contenedor de botones a la info de la card
    cardInfo.append(contenedorBotones);
    // Agrega la info a la card principal
    card.append(cardInfo)
    // Inserta la card en el contenedor principal
    contenedor.append(card)
  }
}

/**
 * Formatea una fecha en formato ISO a un formato legible (YYYY-MM-DD HH:mm:ss).
 * @param {string} fechaIso - Fecha en formato ISO (ejemplo: 2025-08-23T15:00:00.000Z).
 * @returns {string} Fecha formateada como YYYY-MM-DD HH:mm:ss.
 */
export const formatearFecha = (fechaIso) => {
  // Crea un objeto Date a partir de la cadena ISO
  const fecha = new Date(fechaIso);
  // Obtiene el año
  const anio = fecha.getFullYear();
  // Obtiene el mes (se suma 1 porque los meses van de 0 a 11)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  // Obtiene el día del mes
  const dia = String(fecha.getDate()).padStart(2, '0');
  // Obtiene la hora
  const horas = String(fecha.getHours()).padStart(2, '0');
  // Obtiene los minutos
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  // Obtiene los segundos
  const segundos = String(fecha.getSeconds()).padStart(2, '0');

  // Retorna la fecha formateada como string
  return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

/**
 * Carga los tipos de consolas activos en un elemento select.
 * @param {HTMLSelectElement} select - Elemento select donde se agregan las opciones.
 * No retorna nada, modifica el DOM.
 */
export const cargarSelectTiposConsols = async (select) => {
  // Obtiene los tipos de consola desde la API
  const tipos = await get('tipos');

  // Recorre cada tipo y agrega solo los activos (id_estado_tipo != 2)
  tipos.forEach(tipo => {
    if (tipo.id_estado_tipo != 2) {
      // Crea la opción para el select
      const option = document.createElement('option');
      option.setAttribute('value', tipo.id);
      option.textContent = tipo.tipo;
      // Agrega la opción al select
      select.append(option);
    }
  });
}

/**
 * Carga los estados de consola en un elemento select.
 * @param {HTMLSelectElement} select - Elemento select donde se agregan las opciones.
 * No retorna nada, modifica el DOM.
 */
export const cargarSelectEstadoConsola = async (select) => {
  // Obtiene los estados de consola desde la API
  const estados = await get('estadosConsolas');

  // Recorre cada estado y lo agrega como opción al select
  estados.forEach(estado => {
    const option = document.createElement('option');
    option.setAttribute('value', estado.id)
    option.textContent = estado.estado;
    select.append(option)
  });
}

/**
 * Carga los productos activos en un elemento select.
 * @param {HTMLSelectElement} select - Elemento select donde se agregan las opciones.
 * No retorna nada, modifica el DOM.
 */
export const cargarSelecrProductos = async (select) => {
  // Obtiene los productos desde la API
  const productos = await get('productos');

  // Recorre cada producto y agrega solo los activos (id_estado_producto != 2 ni 3)
  productos.forEach(producto => {
    if (producto.id_estado_producto != 2 && producto.id_estado_producto != 3) {
      // Crea la opción para el select
      const option = document.createElement('option');
      option.setAttribute('value', producto.id);
      option.textContent = producto.nombre;
      // Agrega la opción al select
      select.append(option);
    }
  });
}



/**
 * Valida el ingreso de un usuario y realiza el login si los datos son correctos.
 * @param {Event} event - Evento submit del formulario de login.
 * No retorna nada, realiza acciones sobre el DOM y almacenamiento local.
 */
export const validarIngreso = async (event) => {
  // Valida los datos del formulario usando la función validar
  const datos = await validar(event);
  // Si hay dos campos válidos (correo y contraseña)
  if (Object.keys(datos).length == 2) {
    // Realiza la petición de login a la API sin token
    const respuesta = await postSinToken('usuarios/login', datos)
    if (respuesta.ok) {
      // Si la respuesta es exitosa, obtiene los tokens y permisos
      const resultado = await respuesta.json();
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('refreshToken', resultado.refreshToken)
      localStorage.setItem('permisos', resultado.permisos)

      // Obtiene la información del usuario por correo
      const usuario = await get(`usuarios/correo/${datos.correo}`);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      // Muestra mensaje de bienvenida
      await success(`Bienvenido ${usuario.nombre}`)

      // Redirige a la página de reservas
      window.location.href = `#/Reservas`
    }
    else {
      // Si hay error, muestra el mensaje de error
      const res = await respuesta.json();
      error(res.error)
    }
  }
}

/**
 * Convierte un string de permisos en un array, eliminando espacios y caracteres no deseados.
 * @param {string} permisos - Cadena de permisos separada por comas (ejemplo: ",permiso1,permiso2,").
 * @returns {Array} Array de permisos limpios.
 */
export const convertirPermisosArray = (permisos) => {
  // Convierte la cadena de permisos en un array de caracteres
  permisos = permisos.split("");
  // Variable auxiliar para construir la cadena limpia
  let aux = "";
  // Recorre cada carácter de la cadena de permisos
  for (let n = 0; n < permisos.length; n++) {
    // Si es el primer carácter, el último o un espacio, lo omite
    if (n == 0 || n == permisos.length - 1 || permisos[n] == " ") continue
    // Agrega el carácter a la variable auxiliar
    aux += permisos[n];
  }
  // Divide la cadena auxiliar por comas para obtener el array de permisos
  permisos = aux.split(",");
  // Retorna el array de permisos
  return permisos;
}

/**
 * Carga los roles disponibles en un elemento select.
 * @param {HTMLSelectElement} select - Elemento select donde se agregan las opciones.
 * No retorna nada, modifica el DOM.
 */
export const cargarSelectRoles = async (select) => {
  // Obtiene los roles desde la API
  const roles = await get('roles');

  // Recorre cada rol recibido
  roles.forEach(rol => {
    // Crea el elemento option para el select
    const valor = document.createElement('option');
    // Asigna el id del rol como valor de la opción
    valor.setAttribute('value', rol.id)
    // Asigna el nombre del rol como texto visible
    valor.textContent = rol.rol;
    // Agrega la opción al select
    select.append(valor);
  });
}

/**
 * Verifica si el usuario tiene un permiso específico.
 * @param {string} permiso - Permiso a verificar (ejemplo: 'productos.editar').
 * @returns {boolean} true si el usuario tiene el permiso, false si no.
 */
export const tienePermiso = (permiso) => {
  // Obtiene la cadena de permisos del localStorage y la convierte en array
  const permisos = convertirPermisosArray(localStorage.getItem('permisos'));
  // Busca si el permiso existe en el array de permisos
  const existe = permisos.some(perm => perm == permiso);
  // Retorna true si existe, false si no
  return existe
}

/**
 * Carga los estados de usuario en un elemento select.
 * @param {HTMLSelectElement} select - Elemento select donde se agregan las opciones.
 * No retorna nada, modifica el DOM.
 */
export const cargarEstadosUsuarios = async (select) => {
  // Obtiene los estados de usuario desde la API
  const estados = await get('estadosUsuarios');

  // Recorre cada estado recibido
  estados.forEach(estado => {
    // Crea el elemento option para el select
    const value = document.createElement('option');
    // Asigna el id del estado como valor de la opción
    value.setAttribute('value', estado.id);
    // Asigna el nombre del estado como texto visible
    value.textContent = estado.estado;
    // Agrega la opción al select
    select.append(value)
  });
}