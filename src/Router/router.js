import { error } from "../helpers/alertas";
import { tienePermiso } from "../Modules/modules";
import { routes } from "./routes";

/**
 * Función principal del enrutador SPA.
 * Se encarga de analizar el hash de la URL, buscar la ruta correspondiente,
 * verificar permisos y cargar la vista y el controlador adecuado.
 * @param {HTMLElement} elemento - Elemento del DOM donde se cargará la vista.
 * No retorna nada, modifica el DOM y puede redirigir la navegación.
 */
export const router = async (elemento) => {
  // Obtiene el hash de la URL y elimina los dos primeros caracteres ("#/")
  const hash = location.hash.slice(2);
  // Divide el hash en segmentos separados por "/" y filtra vacíos
  const segmentos = hash.split("/").filter(seg => seg);

  // Si no hay segmentos, redirige a la vista de Login
  if (segmentos.length === 0) {
    redirigirARuta("Login");
    return;
  }

  // Busca la ruta correspondiente y extrae parámetros si existen
  const resultadoRuta = encontrarRuta(routes, segmentos);

  // Si no se encuentra la ruta, muestra mensaje de error en el elemento
  if (!resultadoRuta) {
    elemento.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  // Desestructura la ruta encontrada y los parámetros
  const [ruta, parametros] = resultadoRuta;

  // Si la ruta es privada, verifica el token y los permisos
  if (ruta.private) {
    // Obtiene el token del localStorage
    const token = localStorage.getItem('token');
    // Si no hay token, muestra error y redirige a Login
    if (!token) {
      await error('Su sesion ha caducado');
      redirigirARuta("Login");
      return;
    }
    // Si el usuario no tiene el permiso requerido, vuelve atrás y muestra error
    if (!tienePermiso(ruta.can)) {
      window.history.back();
      await error('Usted no tiene acceso a este lugar');
      return;
    }
  }

  // Carga la vista HTML correspondiente en el elemento
  await cargarVista(ruta.path, elemento);
  // Ejecuta el controlador JS de la ruta, pasando los parámetros
  await ruta.controlador(parametros);
};

/**
 * Redirecciona la navegación a una ruta determinada cambiando el hash de la URL.
 * @param {string} ruta - Nombre de la ruta a la que se desea redirigir.
 * No retorna nada, modifica location.hash.
 */
const redirigirARuta = (ruta) => {
  // Cambia el hash de la URL para activar el enrutador
  location.hash = `#/${ruta}`;
};

/**
 * Busca la ruta correspondiente en la estructura de rutas y extrae parámetros si existen.
 * @param {Object} routes - Objeto de rutas definido en routes.js.
 * @param {Array} segmentos - Array de strings con los segmentos del hash.
 * @returns {[Object, Object]|null} Retorna un array con la ruta encontrada y los parámetros, o null si no existe.
 */
export const encontrarRuta = (routes, segmentos) => {
  // Variable para recorrer la estructura de rutas
  let rutaActual = routes;
  // Indica si se encontró la ruta
  let rutaEncontrada = false;
  // Objeto para almacenar los parámetros extraídos
  let parametros = {};

  // Si el último segmento contiene parámetros (ejemplo: id=1&modo=editar)
  if (segmentos.length === 3 && segmentos[2].includes("=")) {
    // Extrae los parámetros y los almacena en el objeto
    parametros = extraerParametros(segmentos[2]);
    // Elimina el segmento de parámetros para procesar solo la ruta
    segmentos.pop();
  }


  // Recorre cada segmento del hash para encontrar la ruta correspondiente
  segmentos.forEach(segmento => {
    // Si el segmento existe en el objeto de rutas actual, avanza al siguiente nivel
    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else {
      // Si el segmento no existe, marca la ruta como no encontrada
      rutaEncontrada = false;
    }

    // Si la ruta actual es un grupo de rutas (tiene subniveles)
    if (esGrupoRutas(rutaActual)) {
      // Si existe una ruta por defecto ("/") y solo hay un segmento, la toma como válida
      if (rutaActual["/"] && segmentos.length == 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      } else {
        // Si no cumple la condición, la ruta no es válida
        rutaEncontrada = false;
      }
    }
  });

  // Retorna la ruta encontrada y los parámetros, o null si no se halló una ruta válida
  return rutaEncontrada ? [rutaActual, parametros] : null;
}

/**
 * Extrae un objeto clave-valor desde un string de parámetros tipo "id=1&modo=editar".
 * @param {string} parametros - Cadena de parámetros en formato query string.
 * @returns {Object} Objeto con los parámetros como propiedades.
 */
const extraerParametros = (parametros) => {
  // Divide la cadena por "&" para obtener cada par clave-valor
  const pares = parametros.split("&");
  // Objeto donde se almacenan los parámetros
  const params = {};
  // Recorre cada par y lo divide por "=" para obtener clave y valor
  pares.forEach(par => {
    const [clave, valor] = par.split("=");
    params[clave] = valor;
  });
  // Retorna el objeto de parámetros
  return params;
};

/**
 * Carga una vista HTML externa dentro de un elemento del DOM.
 * @param {string} path - Ruta relativa al archivo HTML de la vista.
 * @param {HTMLElement} elemento - Elemento donde se insertará el contenido HTML.
 * No retorna nada, modifica el DOM.
 */
const cargarVista = async (path, elemento) => {
  try {
    // Realiza la petición fetch para obtener el archivo HTML
    const response = await fetch(`./src/Views/${path}`);
    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) throw new Error("Vista no encontrada");

    // Obtiene el contenido HTML como texto
    const contenido = await response.text();
    // Inserta el contenido en el elemento del DOM
    elemento.innerHTML = contenido;
  } catch (error) {
    // Si ocurre un error, lo muestra en consola y en el DOM
    console.error(error);
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
  }
};

/**
 * Verifica si un objeto representa un grupo de rutas (todas sus claves son objetos).
 * @param {Object} obj - Objeto a verificar.
 * @returns {boolean} true si todas las claves son objetos, false si alguna no lo es.
 */
const esGrupoRutas = (obj) => {
  // Recorre cada clave del objeto
  for (let key in obj) {
    // Si alguna clave no es un objeto o es null, retorna false
    if (typeof obj[key] !== 'object' || obj[key] === null) {
      return false;
    }
  }
  // Si todas las claves son objetos, retorna true
  return true;
}