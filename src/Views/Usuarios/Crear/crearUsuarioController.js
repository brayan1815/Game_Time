
// Importa las funciones para hacer peticiones GET y POST al backend
import { get, post } from "../../../helpers/api.js";
// Importa las funciones para mostrar mensajes de error y éxito
import { error, success } from "../../../helpers/alertas.js";
// Importa la función para contar los campos requeridos en un formulario
import {contarCamposFormulario} from "../../../Modules/modules.js";
// Importa las funciones de validación y limpieza de campos
import { limpiar, validar, validarContrasenia, validarCorreo, validarLetras, validarMaximo, validarMinimo, validarNumeros} from "../../../Modules/validaciones.js";


/**
 * Controlador para la creación de usuarios.
 * Se encarga de validar el formulario y registrar el usuario en el sistema.
 */
export const crearUsuarioController=async()=>{
    // Obtiene el select de roles
    const select = document.querySelector('select');
    // Obtiene el formulario de creación de usuario
    const formulario = document.querySelector('form');
    // Obtiene el input del documento
    const docuemnto=document.querySelector('#documento');
    // Obtiene el input del nombre
    const nombre=document.querySelector('#nombre');
    // Obtiene el input del teléfono
    const telefono=document.querySelector('#telefono');
    // Obtiene el input del correo
    const correo=document.querySelector('#correo');
    // Obtiene el input de la contraseña
    const contrasenia=document.querySelector('#contrasenia');

    // Solicita los roles disponibles al backend
    const roles=await get('roles');

    // Llena el select con los roles obtenidos
    roles.forEach(item => {
        const option=document.createElement('option');
        option.setAttribute('value',item.id)
        option.textContent=item.rol;
        select.append(option);
    });

    // Cuenta los campos requeridos en el formulario
    const camposForm= contarCamposFormulario(formulario);

    // Evento submit del formulario para crear el usuario
    formulario.addEventListener('submit', async(event)=>{
        // Valida todos los campos del formulario y obtiene sus valores
        const info=validar(event);
        // Si todos los campos requeridos están completos
        if(Object.keys(info).length==camposForm){
            // Asigna el estado activo al usuario
            info['id_estado']=1;   
            // Envía la información del usuario al backend
            const respuesta=await post('usuarios',info);
            // Espera la respuesta y la convierte a JSON
            const res=await respuesta.json();
            // Si la respuesta es exitosa
            if(respuesta.ok){
                // Muestra mensaje de éxito
                await success(res.mensaje);
                // Redirige a la vista de usuarios
                window.location.href="#/Usuarios"
            } 
            // Si hubo un error, muestra el mensaje de error
            else{
                error(res.error)
            }
        }
    })

    // Validaciones y limpieza de campos para el documento
    docuemnto.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    docuemnto.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    docuemnto.addEventListener('keydown',validarNumeros);
    docuemnto.addEventListener('keydown',validarMaximo);

    // Validaciones y limpieza de campos para el nombre
    nombre.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    nombre.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    nombre.addEventListener('keydown',validarMaximo);
    nombre.addEventListener('keydown',validarLetras);

    // Validaciones y limpieza de campos para el teléfono
    telefono.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    telefono.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    telefono.addEventListener('keydown',validarNumeros);
    telefono.addEventListener('keydown',validarMaximo);

    // Validaciones y limpieza de campos para el correo
    correo.addEventListener('keydown',(event)=>{if(validarCorreo(event.target))limpiar(event.target)});
    correo.addEventListener('blur',(event)=>{if(validarCorreo(event.target))limpiar(event.target)});

    // Validaciones y limpieza de campos para la contraseña
    contrasenia.addEventListener('keydown',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)});
    contrasenia.addEventListener('blur',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)});
}