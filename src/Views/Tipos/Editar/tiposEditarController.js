// Importa funciones para mostrar alertas personalizadas (error, success)
import { error, success } from "../../../helpers/alertas.js";
// Importa funciones para realizar peticiones GET y PUT a la API
import { get, put } from "../../../helpers/api.js";
// Importa función para contar los campos de un formulario
import { contarCamposFormulario } from "../../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { validar, validarMinimo, limpiar, validarMaximo, validarNumeros} from "../../../Modules/validaciones.js";

/**
 * Controlador para la edición de tipos de consola.
 * Se encarga de cargar los datos del tipo a editar, gestionar la lógica del formulario,
 * validar los datos, enviar la información a la API y mostrar alertas.
 * @param {Object} parametros - Parámetros recibidos, debe contener el id del tipo a editar.
 */
export const tiposEditarController=async(parametros=null)=>{

    // Selecciona el formulario principal de la vista
    const formulario=document.querySelector('form');
    // Selecciona el campo de tipo
    const inputTipo=document.querySelector('#tipo');
    // Selecciona el campo de precio por hora
    const inputPrecio=document.querySelector('#precio_hora');
    // Selecciona el select de estado
    const estadoSelect=document.querySelector('select');

    // Realiza una petición GET para obtener los estados posibles de tipo
    const estados=await get('estadosTipo');

    // Por cada estado recibido, crea una opción en el select
    estados.forEach(estado => {
        const option=document.createElement('option');
        option.setAttribute('value',estado.id);
        option.textContent=estado.estado;
        estadoSelect.append(option)
    });

    


    // Extrae el id del tipo a editar desde los parámetros
    const {id} = parametros;
    // Realiza una petición GET para obtener los datos del tipo a editar
    const tipo= await get(`tipos/${id}`)

    // Asigna el estado actual del tipo al select
    estadoSelect.value=tipo.id_estado_tipo;
    // Asigna el valor actual del tipo al input correspondiente
    inputTipo.value=tipo.tipo;
    // Asigna el precio actual al input correspondiente
    inputPrecio.value=tipo.precio_hora;

    // Cuenta la cantidad de campos que tiene el formulario para validación
    const cantCampos=contarCamposFormulario(formulario);

    // Evento submit del formulario para editar el tipo
    formulario.addEventListener('submit',async(event)=>{
        // Valida los campos del formulario y obtiene un objeto info
        const info=validar(event);

        // Si la cantidad de campos validados es igual a la cantidad de campos del formulario
        if(Object.keys(info).length==cantCampos){
            // Convierte el tipo a minúsculas
            info['tipo']=info['tipo'].toLowerCase();
            // Realiza la petición PUT para actualizar el tipo
            const respuesta=await put(`tipos/${id}`,info);
            // Obtiene la respuesta en formato JSON
            const res=await respuesta.json();
            // Si la actualización fue exitosa
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