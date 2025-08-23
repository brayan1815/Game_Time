import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";
import { cargarCardsConsolas, tienePermiso } from "../../Modules/modules.js";

export const consolasController = async () => {

  const main = document.querySelector('.cards');
  const botonNuevaConsola = document.querySelector('.crearConsola');
  const botonVerTipos = document.querySelector('.verTipos');

  if (!tienePermiso('consolas.crear')) botonNuevaConsola.classList.add('displayNone');
  else botonNuevaConsola.classList.remove('displayNone');

  if (!tienePermiso('tipos.index')) botonVerTipos.classList.add('displayNone');
  else botonVerTipos.classList.remove('displayNone');



  const consolas = await get('consolas/con-precio');

  cargarCardsConsolas(consolas, main);

  window.addEventListener('click', async (event) => {
    const clase = event.target.getAttribute('class');
    const id = event.target.getAttribute('id');
    if (clase == 'boton boton--cardIcono eliminar') {

      const confirm = await confirmar("Eliminar la consola");

      if (confirm.isConfirmed) {
        const respuesta = await del(`consolas/${id}`);
        const res = await respuesta.json();

        if (respuesta.ok) {
          success(res.mensaje);
          const consolas = await get('consolas/con-precio');
          cargarCardsConsolas(consolas, main);
        }
        else error(res.error);
      }
    }
  })
}