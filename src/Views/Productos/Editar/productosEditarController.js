// Importa función para mostrar mensajes de éxito
import { success } from "../../../helpers/alertas.js";
// Importa funciones para peticiones HTTP GET, PUT y subida de imágenes
import { get, post_imgs, put} from "../../../helpers/api.js";
// Importa función para contar campos requeridos en el formulario
import { contarCamposFormulario } from "../../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { limpiar, validar, validarLetras, validarMaximo, validarMinimo, validarNumeros, validarContrasenia, validarCorreo, validarImagen } from "../../../Modules/validaciones.js";

/**
 * Controlador para la edición de productos.
 * Permite cargar los datos de un producto, editar sus campos, validar y guardar los cambios.
 * @param {Object|null} parametros - Objeto con los parámetros de la ruta, debe contener el id del producto.
 * No retorna nada, modifica el DOM y realiza peticiones a la API.
 */
export const productosEditarController=async(parametros=null)=>{
    // Obtiene el formulario principal de la vista
    const formulario=document.querySelector('form');
    // Obtiene el input para el nombre del producto
    const nombre=document.querySelector('#nombre');
    // Obtiene el textarea para la descripción del producto
    const descripcion=document.querySelector('#descripcion');
    // Obtiene el input para el precio del producto
    const precio=document.querySelector('#precio');
    // Obtiene el input para las cantidades disponibles
    const cantDis=document.querySelector('#cantidades_disponibles');
    // Obtiene el input de selección de imagen
    const inputImg=document.querySelector('#seleccionarImagen');

    
    // Extrae el id del producto desde los parámetros
    const {id} = parametros;

    // Cuenta la cantidad de campos requeridos en el formulario
    const cantCampos=contarCamposFormulario(formulario)

    // Obtiene los datos actuales del producto desde la API
    const producto=await get(`productos/${id}`)

    // Guarda el id de la imagen actual del producto
    const id_img=producto.id_imagen;

    // Asigna los valores actuales del producto a los campos del formulario
    nombre.value=producto.nombre;
    descripcion.value=producto.descripcion;
    precio.value=producto.precio;
    cantDis.value=producto.cantidades_disponibles;

    // Evento submit del formulario para guardar los cambios del producto
    formulario.addEventListener('submit',async(event)=>{
        // Valida los campos del formulario y obtiene la info
        const info=validar(event);
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
                info['id_imagen']=response.id_imagen
            }else{
                // Si no se seleccionó nueva imagen, mantiene la imagen actual
                info['id_imagen']=id_img;
            }
            // Asigna el estado del producto (1 = activo, 2 = inactivo si no hay stock)
            info['id_estado_producto']=1;
            if(info['cantidades_disponibles']==0) info['id_estado_producto']=2
            // Envía la información actualizada del producto al backend
            const respuesta=await put(`productos/${id}`,info);
            // Convierte la respuesta a JSON
            const res=await respuesta.json();
            // Si la respuesta es exitosa, muestra mensaje de éxito
            if(respuesta.ok)success(res.mensaje)
        }
    })

    // Validaciones y limpieza en el input de nombre
    nombre.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    nombre.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    nombre.addEventListener('keydown',validarLetras)

    // Validaciones y limpieza en la descripción
    descripcion.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    descripcion.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})

    // Validaciones y limpieza en el precio
    precio.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    precio.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    precio.addEventListener('keydown',(event)=>{validarMaximo(event)});
    precio.addEventListener('keydown',(event)=>{validarNumeros(event)});

    // Validaciones y limpieza en las cantidades disponibles
    cantDis.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    cantDis.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    cantDis.addEventListener('keydown',(event)=>{validarNumeros(event)});
}