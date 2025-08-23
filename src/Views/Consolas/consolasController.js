// Importa funciones para mostrar alertas de confirmación, error y éxito
import { confirmar, error, success } from "../../helpers/alertas.js";
// Importa funciones para peticiones HTTP DELETE y GET
import { del, get } from "../../helpers/api.js";
// Importa función para cargar cards de consolas y para verificar permisos
import { cargarCardsConsolas, tienePermiso } from "../../Modules/modules.js";

/**
 * Controlador principal para la vista de consolas.
 * Se encarga de mostrar las consolas, gestionar permisos de botones y manejar eventos de eliminación.
 * No recibe parámetros ni retorna nada. Modifica el DOM y realiza peticiones a la API.
 */
export const consolasController = async () => {
  // Obtiene el contenedor principal donde se mostrarán las cards de consolas
  const main = document.querySelector('.cards');
  // Obtiene el botón para crear una nueva consola
  const botonNuevaConsola = document.querySelector('.crearConsola');
  // Obtiene el botón para ver los tipos de consolas
  const botonVerTipos = document.querySelector('.verTipos');

  // Si el usuario no tiene permiso para crear consolas, oculta el botón
  if (!tienePermiso('consolas.crear')) botonNuevaConsola.classList.add('displayNone');
  else botonNuevaConsola.classList.remove('displayNone');

  // Si el usuario no tiene permiso para ver tipos de consolas, oculta el botón
  if (!tienePermiso('tipos.index')) botonVerTipos.classList.add('displayNone');
  else botonVerTipos.classList.remove('displayNone');



  // Obtiene la lista de consolas con precio desde la API
  const consolas = await get('consolas/con-precio');

  // Carga las cards de consolas en el contenedor principal
  cargarCardsConsolas(consolas, main);

  // Agrega un listener global para manejar eventos de click (eliminar consolas)
  window.addEventListener('click', async (event) => {
    // Obtiene la clase del elemento clickeado
    const clase = event.target.getAttribute('class');
    // Obtiene el id del elemento clickeado
    const id = event.target.getAttribute('id');
    // Si el click fue en el botón de eliminar consola
    if (clase == 'boton boton--cardIcono eliminar') {
      // Muestra confirmación antes de eliminar
      const confirm = await confirmar("Eliminar la consola");

      // Si el usuario confirma la eliminación
      if (confirm.isConfirmed) {
        // Realiza la petición DELETE a la API
        const respuesta = await del(`consolas/${id}`);
        // Convierte la respuesta a JSON
        const res = await respuesta.json();

        // Si la eliminación fue exitosa
        if (respuesta.ok) {
          // Muestra mensaje de éxito
          success(res.mensaje);
          // Vuelve a obtener la lista de consolas actualizada
          const consolas = await get('consolas/con-precio');
          // Recarga las cards de consolas
          cargarCardsConsolas(consolas, main);
        }
        // Si hubo error, muestra el mensaje de error
        else error(res.error);
      }
    }
  })
}