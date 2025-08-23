// Importa funciones para mostrar mensajes de error y éxito
import { error, success } from "../../../helpers/alertas.js";
// Importa funciones para peticiones HTTP y subida de imágenes
import { get,put,post_imgs } from "../../../helpers/api.js";
// Importa funciones para cargar selects y contar campos requeridos
import { cargarSelectEstadoConsola, cargarSelectTiposConsols, contarCamposFormulario } from "../../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { limpiar, validar, validarLetras, validarMaximo, validarMinimo, validarNumeros, validarContrasenia, validarCorreo, validarImagen } from "../../../Modules/validaciones.js";

/**
 * Controlador para la edición de consolas.
 * Permite cargar los datos de una consola, editar sus campos, validar y guardar los cambios.
 * @param {Object|null} parametros - Objeto con los parámetros de la ruta, debe contener el id de la consola.
 * No retorna nada, modifica el DOM y realiza peticiones a la API.
 */
export const consolasEditarController=async(parametros=null)=>{
    // Extrae el id de la consola desde los parámetros
    const {id} = parametros;
    // Obtiene el formulario principal de la vista
    const formulario = document.querySelector('form');
    // Obtiene el input para el número de serie
    const numeroSerie=document.querySelector('#numero_serie');
    // Obtiene el input para el nombre de la consola
    const nombre = document.querySelector('#nombre');
    // Obtiene el textarea para la descripción de la consola
    const descripcion = document.querySelector('#descripcion');
    // Obtiene el select para el tipo de consola
    const tipo = document.querySelector('select');
    // Obtiene el select para el estado de la consola
    const estados=document.querySelector('#id_estado');
    // Obtiene el input de selección de imagen
    const inputImg = document.querySelector('#seleccionarImagen')
    // Obtiene el label donde se muestra la imagen seleccionada
    const lblSeleccionrImagen = document.querySelector('.formulario__insertarImagen');
    // Carga los tipos de consolas en el select correspondiente
    await cargarSelectTiposConsols(tipo);
    // Carga los estados de consola en el select correspondiente
    await cargarSelectEstadoConsola(estados)
    // Obtiene los datos actuales de la consola desde la API
    const consola = await get(`consolas/${id}`);
    // Guarda el id de la imagen actual de la consola
    const id_img=consola.id_imagen;
    // Asigna los valores actuales de la consola a los campos del formulario
    nombre.value = consola.nombre;
    descripcion.value = consola.descripcion;
    tipo.value = consola.id_tipo;
    numeroSerie.value=consola.numero_serie;
    estados.value=consola.id_estado;
    /**
     * Muestra el nombre del archivo seleccionado en el label correspondiente.
     * No recibe parámetros ni retorna nada. Modifica el DOM.
     */
    const cargarNombreArchivo = () => {
        // Si hay un archivo seleccionado en el input
        if (inputImg.files.length > 0) {
            // Si ya existe un span con el nombre anterior, lo elimina
            if (lblSeleccionrImagen.nextElementSibling) lblSeleccionrImagen.nextElementSibling.remove();
            // Obtiene el archivo seleccionado
            const archivo = inputImg.files[0];
            // Crea un span para mostrar el nombre del archivo
            const mensaje = document.createElement('span');
            mensaje.textContent = archivo.name;
            mensaje.classList.add('span--verde');
            // Inserta el span después del label
            lblSeleccionrImagen.insertAdjacentElement('afterend',mensaje)   
        }
    }
    // Cuenta la cantidad de campos requeridos en el formulario
    const cantCampos = contarCamposFormulario(formulario);
    // Evento submit del formulario para guardar los cambios de la consola
    formulario.addEventListener('submit', async (event) => {
        // Valida los campos del formulario y obtiene la info
        const info= validar(event)
        // Si la cantidad de campos validados es igual a los requeridos
        if(Object.keys(info).length==cantCampos){
            // Si se seleccionó una nueva imagen
            if(inputImg.files.length>0){
                // Crea un objeto FormData para enviar la imagen
                const formData = new FormData();
                // Agrega la imagen al FormData
                formData.append('archivo',inputImg.files[0])
                // Envía la imagen al backend y espera la respuesta
                const respuesta = await post_imgs(formData);
                // Convierte la respuesta a JSON
                const response = await respuesta.json();
                // Asigna el id de la nueva imagen al objeto info
                info['id_imagen'] = response.id_imagen
                

            }else{
                // Si no se seleccionó nueva imagen, mantiene la imagen actual
                info['id_imagen']=id_img;
            }
    
            // Convierte el número de serie a minúsculas
            info['numero_serie']=info['numero_serie'].toLowerCase();
            
            // Envía la información actualizada de la consola al backend
            const respuesta=await put(`consolas/${id}`,info);
            // Convierte la respuesta a JSON
            const res=await respuesta.json();
            // Si la respuesta es exitosa, muestra mensaje y redirige
            if(respuesta.ok){
                await success(res.mensaje);
                // Redirige a la vista de consolas
                window.location.href = "#/Consolas";
            }
            // Si hay error, muestra el mensaje de error
            else error(res.error)
        }
    })

    // Al enfocar los campos, muestra el nombre del archivo seleccionado
    nombre.addEventListener('focus', cargarNombreArchivo);
    descripcion.addEventListener('focus', cargarNombreArchivo);
    tipo.addEventListener('focus', cargarNombreArchivo);
    // Validaciones y limpieza en el input de nombre
    nombre.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('keydown',validarLetras);
    nombre.addEventListener('keydown', validarMaximo)
    // Validaciones y limpieza en la descripción
    descripcion.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    descripcion.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
}