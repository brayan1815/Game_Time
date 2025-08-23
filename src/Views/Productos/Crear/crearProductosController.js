
// Importa la función para mostrar mensajes de éxito
import { success } from "../../../helpers/alertas.js";
// Importa las funciones para hacer peticiones POST al backend
import { post, post_imgs } from "../../../helpers/api.js";
// Importa la función para contar los campos requeridos en un formulario
import { contarCamposFormulario } from "../../../Modules/modules.js";
// Importa las funciones de validación y limpieza de campos
import { limpiar, validar, validarImagen, validarLetras, validarMaximo, validarMinimo, validarNumeros} from "../../../Modules/validaciones.js";


/**
 * Controlador para la creación de productos.
 * Se encarga de validar el formulario, subir la imagen y registrar el producto en el sistema.
 */
export const crearProductosController=()=>{
    // Obtiene el formulario de creación de productos
    const formulario = document.querySelector('form');
    // Obtiene el input del nombre del producto
    const nombreprod = document.querySelector('#nombre')
    // Obtiene el input de la descripción del producto
    const descripcionProd=document.querySelector('#descripcion')
    // Obtiene el input del precio del producto
    const precio_prod=document.querySelector('#precio');
    // Obtiene el input de las cantidades disponibles
    const canti_disponi=document.querySelector('#cantidades_disponibles');
    // Obtiene el input para seleccionar la imagen
    const inputImg=document.querySelector('#seleccionarImagen');
    // Obtiene el label asociado a la imagen
    const labelImagen = document.querySelector('.formulario__insertarImagen')
    // Obtiene todos los inputs del formulario
    const camposForm = document.querySelectorAll('input');

    // Agrega un evento de focus a cada input para validar la imagen cuando se enfoca cualquier campo
    camposForm.forEach((campo) => {
        campo.addEventListener('focus', () => {
            validarImagen(inputImg,labelImagen)
        })
    })

    // Valida la imagen cuando se sale del input de imagen
    inputImg.addEventListener('focusout',()=>{validarImagen(inputImg,labelImagen)});

    // Evento submit del formulario para crear el producto
    formulario.addEventListener('submit',async(event)=>{
        event.preventDefault(); // Previene el envío por defecto del formulario

        // Valida la imagen seleccionada
        const imagen = validarImagen(inputImg, labelImagen);
        // Cuenta los campos requeridos en el formulario
        const cantCamposFormulario = contarCamposFormulario(event.target);
        // Valida todos los campos del formulario y obtiene sus valores
        const info=validar(event);

        // Si la imagen es válida
        if(imagen!=false){
            // Crea un objeto FormData para enviar la imagen
            const formData = new FormData();
            // Agrega la imagen al FormData
            formData.append('archivo',imagen)
            // Envía la imagen al backend y espera la respuesta
            const respuesta = await post_imgs(formData);
            // Convierte la respuesta a JSON
            const response = await respuesta.json();
            // Asigna el id de la imagen al objeto info
            info['id_imagen'] = response.id_imagen

            // Si todos los campos requeridos están completos
            if (Object.keys(info).length == cantCamposFormulario) {
                // Convierte las cantidades y el precio a número
                info['cantidades_disponibles']=Number(info['cantidades_disponibles'])
                info['precio']=Number(info.precio)

                // Por defecto el producto está activo
                info['id_estado_producto']=1;

                // Si no hay cantidades disponibles, el producto queda inactivo
                if(info['cantidades_disponibles']==0) info['id_estado_producto']=2

                // Envía la información del producto al backend
                const respuesta=await post('productos',info);
                // Espera la respuesta y la convierte a JSON
                const res=await respuesta.json();

                // Si la respuesta es exitosa
                if(respuesta.ok){
                    // Muestra mensaje de éxito
                    await success(res.mensaje);

                    // Limpia los campos del formulario
                    inputImg.value='';
                    labelImagen.nextElementSibling.remove();
                    nombreprod.value='';
                    descripcionProd.value='';
                    precio_prod.value="";
                    canti_disponi.value="";

                    // Redirige a la vista de productos
                    window.location.href="#/Productos"
                }
            }
        }
    })

    // Validaciones y limpieza de campos para el nombre del producto
    nombreprod.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombreprod.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombreprod.addEventListener('keydown',validarLetras)

    // Validaciones y limpieza de campos para la descripción del producto
    descripcionProd.addEventListener('blur',(event)=>{if(validarMinimo(event.target)) limpiar(event.target)})
    descripcionProd.addEventListener('keydown',(event)=>{if(validarMinimo(event.target)) limpiar(event.target)})

    // Validaciones y limpieza de campos para el precio del producto
    precio_prod.addEventListener('keydown',validarNumeros);
    precio_prod.addEventListener('keydown',validarMaximo);
    precio_prod.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    precio_prod.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});

    // Validaciones y limpieza de campos para las cantidades disponibles
    canti_disponi.addEventListener('keydown',validarNumeros);
    canti_disponi.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    canti_disponi.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
}