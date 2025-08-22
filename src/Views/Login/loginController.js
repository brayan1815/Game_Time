import { limpiar, validarMinimo, validarCorreo } from "../../Modules/validaciones.js";
import { validarIngreso } from "../../Modules/modules.js";

export const loginController=()=>{


    const formulario = document.querySelector('form');
    const correo=document.querySelector('#correo');
    const contrasenia=document.querySelector('#contrasenia');


    correo.addEventListener('blur',(event)=>{if(validarCorreo(event.target))limpiar(event.target)})
    correo.addEventListener('keydown',(event)=>{if(validarCorreo(event.target))limpiar(event.target)})
    formulario.addEventListener('submit',validarIngreso);
    contrasenia.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    contrasenia.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
}