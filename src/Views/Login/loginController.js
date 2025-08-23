import { limpiar, validarMinimo, validarCorreo } from "../../Modules/validaciones.js";
import { validarIngreso } from "../../Modules/modules.js";

/**
 * Controlador para la vista de login.
 * Se encarga de agregar validaciones y limpiar errores en los campos del formulario de inicio de sesión.
 */
export const loginController=()=>{
    // Obtiene el formulario de login
    const formulario = document.querySelector('form');
    // Obtiene el input de correo
    const correo=document.querySelector('#correo');
    // Obtiene el input de contraseña
    const contrasenia=document.querySelector('#contrasenia');

    // Al perder el foco, valida el correo y limpia si es válido
    correo.addEventListener('blur',(event)=>{
        if(validarCorreo(event.target)) limpiar(event.target)
    })
    // Al presionar una tecla, valida el correo y limpia si es válido
    correo.addEventListener('keydown',(event)=>{
        if(validarCorreo(event.target)) limpiar(event.target)
    })
    // Al enviar el formulario, ejecuta la validación de ingreso
    formulario.addEventListener('submit',validarIngreso);
    // Al perder el foco en contraseña, valida mínimo y limpia si es válido
    contrasenia.addEventListener('blur',(event)=>{
        if(validarMinimo(event.target)) limpiar(event.target)
    })
    // Al presionar una tecla en contraseña, valida mínimo y limpia si es válido
    contrasenia.addEventListener('keydown',(event)=>{
        if(validarMinimo(event.target)) limpiar(event.target)
    })
}