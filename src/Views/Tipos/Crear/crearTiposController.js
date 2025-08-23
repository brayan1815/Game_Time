// Importa funciones para mostrar alertas personalizadas (error, success)
import { error, success } from "../../../helpers/alertas.js";
// Importa función para realizar peticiones POST a la API
import { post } from "../../../helpers/api.js";
// Importa función para contar los campos de un formulario
import { contarCamposFormulario } from "../../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { limpiar, validar, validarMaximo, validarMinimo, validarNumeros} from "../../../Modules/validaciones.js";

/**
 * Controlador para la creación de tipos de consola.
 * Se encarga de gestionar la lógica del formulario para crear un nuevo tipo,
 * validando los datos, enviando la información a la API y mostrando alertas.
 */
export const crearTiposController=()=>{

    // Selecciona el formulario principal de la vista
    const formulario=document.querySelector('form');
    // Selecciona el campo de tipo
    const inputTipo=document.querySelector('#tipo');
    // Selecciona el campo de precio por hora
    const inputPrecio=document.querySelector('#precio_hora');

    // Cuenta la cantidad de campos que tiene el formulario para validación
    const camposForm=contarCamposFormulario(formulario);

    // Evento submit del formulario para crear un nuevo tipo
    formulario.addEventListener('submit',async(event)=>{
        // Valida los campos del formulario y obtiene un objeto info
        const info=validar(event);

        // Si la cantidad de campos validados es igual a la cantidad de campos del formulario
        if(Object.keys(info).length==camposForm){
            // Convierte el precio a número
            info['precio_hora']=Number(info['precio_hora'])
            // Asigna el estado activo al tipo
            info['id_estado_tipo']=1;
            // Convierte el tipo a minúsculas
            info['tipo']=info['tipo'].toLowerCase();
            // Realiza la petición POST para crear el tipo
            const respuesta=await post('tipos',info);
            // Obtiene la respuesta en formato JSON
            const res=await respuesta.json();
            // Si la creación fue exitosa
            if(respuesta.ok){
                // Muestra mensaje de éxito
                await success(res.mensaje);
                // Redirige a la vista de tipos
                window.location.href = "#/Tipos";
            } 
            else error(res.error)
        }
    })

    // Validaciones y eventos para el campo tipo
    inputTipo.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputTipo.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputTipo.addEventListener('keydown',validarMaximo);

    // Validaciones y eventos para el campo precio por hora
    inputPrecio.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputPrecio.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputPrecio.addEventListener('keydown',validarMaximo);
    inputPrecio.addEventListener('keydown',validarNumeros)
}