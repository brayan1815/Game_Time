// Importa funciones para mostrar mensajes de error y éxito
import { error, success } from "../../helpers/alertas.js";
// Importa funciones para peticiones HTTP POST y POST sin token
import {postSinToken } from "../../helpers/api.js";
// Importa función para contar campos requeridos en el formulario
import { contarCamposFormulario } from "../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { limpiar, validar, validarContrasenia, validarCorreo, validarLetras, validarMaximo, validarMinimo, validarNumeros} from "../../Modules/validaciones.js";

/**
 * Controlador para el registro de usuarios.
 * Gestiona el formulario de registro, valida los campos y envía la información al backend.
 * No recibe parámetros ni retorna nada. Modifica el DOM y realiza peticiones a la API.
 */
export const registroController=()=>{
    // Obtiene el formulario principal de la vista
    const formulario=document.querySelector('form');
    // Obtiene el input para el documento del usuario
    const documento=document.querySelector('#documento')
    // Obtiene el input para el nombre del usuario
    const nombre=document.querySelector('#nombre');
    // Obtiene el input para el teléfono del usuario
    const telefono=document.querySelector('#telefono');
    // Obtiene el input para el correo del usuario
    const correo=document.querySelector('#correo');
    // Obtiene el input para la contraseña del usuario
    const contrasenia=document.querySelector('#contrasenia');

    // Cuenta la cantidad de campos requeridos en el formulario
    const cantidadCampos=contarCamposFormulario(formulario);

    /**
     * Función que gestiona el envío del formulario de registro.
     * Valida los campos, construye el objeto usuario y lo envía al backend.
     * @param {Event} event - Evento submit del formulario.
     * No retorna nada.
     */
    const nuevoUsuario=async(event)=>{
        // Si la cantidad de campos validados es igual a los requeridos
        if(Object.keys(validar(event)).length==cantidadCampos){
            // Valida los campos y construye el objeto usuario
            let objeto=validar(event);
            // Asigna el rol de usuario (2)
            objeto['id_rol']=2; 
            // Convierte el teléfono a número
            objeto['telefono'] = Number(objeto['telefono']);
            // Convierte el documento a número
            objeto['documento'] = Number(objeto['documento']);
            // Asigna el estado inicial del usuario (1 = activo)
            objeto['id_estado']=1;
            // Envía el usuario al backend sin token
            const respuesta=await postSinToken('usuarios',objeto);
            // Convierte la respuesta a JSON
            const res=await respuesta.json();
            // Si la respuesta es exitosa, muestra mensaje y limpia los campos
            if(respuesta.ok){
                success(res.mensaje);
                documento.value="";
                nombre.value="";
                telefono.value="";
                correo.value="";
                contrasenia.value="";
            }
            // Si hay error, muestra el mensaje de error
            else error(res.error);
        }
    }

    // Evento submit del formulario para registrar usuario
    formulario.addEventListener('submit',nuevoUsuario)
    // Validaciones y limpieza en el input de nombre
    nombre.addEventListener('keydown',validarLetras);
    // Validaciones y limpieza en el input de teléfono
    telefono.addEventListener('keydown',validarNumeros);
    telefono.addEventListener('keydown',validarMaximo);
    telefono.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    // Validaciones y limpieza en el input de documento
    documento.addEventListener('keydown',validarNumeros);
    documento.addEventListener('keydown',validarMaximo);
    documento.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    // Validaciones y limpieza en el input de nombre
    nombre.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    nombre.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    // Validaciones y limpieza en el input de correo
    correo.addEventListener('blur',(event)=>{if(validarCorreo(event.target))limpiar(event.target)})
    // Validaciones y limpieza en el input de teléfono
    telefono.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    // Validaciones y limpieza en el input de documento
    documento.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    // Validaciones y limpieza en el input de correo
    correo.addEventListener('keydown',(event)=>{if(validarCorreo(event.target))limpiar(event.target)});
    // Validaciones y limpieza en el input de contraseña
    contrasenia.addEventListener('keydown',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)});
    contrasenia.addEventListener('blur',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)});
}