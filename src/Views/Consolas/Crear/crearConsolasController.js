import { error, success } from "../../../helpers/alertas.js";
import { post, post_imgs } from "../../../helpers/api.js";
import { cargarSelectTiposConsols, contarCamposFormulario } from "../../../Modules/modules.js";
import { limpiar,validar, validarImagen, validarLetras, validarMaximo, validarMinimo } from "../../../Modules/validaciones.js";
/**
 * Controlador para la creación de consolas.
 * Gestiona el formulario, valida los campos, sube la imagen y envía la información al backend.
 * No recibe parámetros ni retorna nada. Modifica el DOM y realiza peticiones a la API.
 */
export const crearConsolasController = async () => {
    // Obtiene el formulario principal de la vista
    const formulario = document.querySelector('form');
    // Obtiene el input de selección de imagen
    const inputImg = document.querySelector('#seleccionarImagen');
    // Obtiene el label donde se muestra la imagen seleccionada
    const labelImagen = document.querySelector('.formulario__insertarImagen');
    // Obtiene el input para el nombre de la consola
    const inputNombre = document.querySelector('#nombre');
    // Obtiene el textarea para la descripción de la consola
    const descripcionCosnola = document.querySelector('#descripcion');
    // Obtiene el input para el número de serie
    const numeroSerie = document.querySelector('#numero_serie');
    // Obtiene el select para el tipo de consola
    const select = document.querySelector('select');

    // Cuenta la cantidad de campos requeridos en el formulario
    const cantCampos = contarCamposFormulario(formulario);
    // Carga los tipos de consolas en el select
    await cargarSelectTiposConsols(select);

    // Evento submit del formulario para crear la consola
    formulario.addEventListener('submit', async (event) => {
        // Previene el comportamiento por defecto del formulario
        event.preventDefault();

        // Valida la imagen seleccionada
        const imagen = validarImagen(inputImg, labelImagen);
        // Valida los campos del formulario y obtiene la info
        const info = validar(event);

        // Si la imagen es válida
        if (imagen != false) {
            // Crea un objeto FormData para enviar la imagen
            const formData = new FormData();
            // Agrega la imagen al FormData
            formData.append('archivo', imagen);
            // Envía la imagen al backend y espera la respuesta
            const respuesta = await post_imgs(formData);
            // Convierte la respuesta a JSON
            const response = await respuesta.json();
            // Asigna el id de la imagen al objeto info
            info['id_imagen'] = response.id_imagen;

            // Si la cantidad de campos validados es igual a los requeridos
            if (Object.keys(info).length == cantCampos) {
                // Convierte el id_tipo a número entero
                info['id_tipo'] = parseInt(info.id_tipo);
                // Asigna el estado inicial de la consola (1 = activa)
                info['id_estado'] = 1;
                // Convierte el número de serie a minúsculas
                info['numero_serie'] = info['numero_serie'].toLowerCase();

                // Envía la información de la consola al backend
                const respuesta = await post('consolas', info);
                // Convierte la respuesta a JSON
                const res = await respuesta.json();
                // Si la respuesta es exitosa, muestra mensaje y redirige
                if (respuesta.ok) {
                    await success(res.mensaje);
                    window.location.href = "#/Consolas";
                }
                // Si hay error, muestra el mensaje de error
                else error(res.error);
            }
        }
    });

    // Validaciones y limpieza en el input de nombre
    inputNombre.addEventListener('keydown', validarLetras); // Solo permite letras
    inputNombre.addEventListener('keydown', validarMaximo); // Valida máximo de caracteres
    inputNombre.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target); }); // Limpia si es menor al mínimo
    inputNombre.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target); }); // Limpia al perder foco si es menor al mínimo

    // Validaciones y limpieza en la descripción
    descripcionCosnola.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target); });
    descripcionCosnola.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target); });

    // Al enfocar los campos, valida la imagen seleccionada
    inputNombre.addEventListener('focus', () => { validarImagen(inputImg, labelImagen); });
    descripcionCosnola.addEventListener('focus', () => { validarImagen(inputImg, labelImagen); });
    select.addEventListener('focus', () => { validarImagen(inputImg, labelImagen); });

    // Validaciones y limpieza en el número de serie
    numeroSerie.addEventListener('keydown', validarMaximo); // Valida máximo de caracteres
    numeroSerie.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target); });
    numeroSerie.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target); });
}