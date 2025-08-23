
// Importa las funciones para mostrar alertas de error y éxito
import { error, success } from "../../../helpers/alertas.js";
// Importa las funciones para hacer peticiones GET y PUT al backend
import { get, put } from "../../../helpers/api.js";
// Importa funciones para cargar roles, estados y contar campos del formulario
import { cargarEstadosUsuarios, cargarSelectRoles, contarCamposFormulario } from "../../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { limpiar, validar, validarLetras, validarMaximo, validarMinimo, validarNumeros} from "../../../Modules/validaciones.js";


/**
 * Controlador para la edición de usuarios.
 * Se encarga de cargar los datos del usuario, validar el formulario y actualizar el usuario en el sistema.
 * @param {Object} parametros - Parámetros que contienen el id del usuario a editar.
 */
export const usuariosEditarController=async(parametros=null)=>{
    // Obtiene el formulario de edición de usuario
    const formulario = document.querySelector('form')
    // Obtiene el input del documento
    const documento=document.querySelector('#documento')
    // Obtiene el input del nombre
    const nombre=document.querySelector('#nombre')
    // Obtiene el input del teléfono
    const telefono=document.querySelector('#telefono')
    // Obtiene el input del correo
    const correo=document.querySelector('#correo')
    // Obtiene el select de roles
    const rol=document.querySelector('#id_rol')
    // Obtiene el select de estado del usuario
    const estadoUsuario=document.querySelector('#id_estado')

    // Carga los roles disponibles en el select
    await cargarSelectRoles(rol);
    // Carga los estados de usuario en el select
    await cargarEstadosUsuarios(estadoUsuario)

    // Obtiene el id del usuario a editar desde los parámetros
    const id = parametros.id;

    // Solicita los datos del usuario al backend
    const usuario=await get(`usuarios/${id}`);

    // Asigna los valores obtenidos a los campos del formulario
    documento.value = usuario.documento;
    nombre.value=usuario.nombre
    telefono.value=usuario.telefono
    correo.value=usuario.correo
    rol.value = usuario.id_rol
    estadoUsuario.value=usuario.id_estado;

    // Cuenta los campos requeridos en el formulario
    const cantCamposFormulario = contarCamposFormulario(formulario);

    // Función para actualizar el usuario cuando se envía el formulario
    const actuasslizarUsuario = async (event) => {
        // Valida todos los campos del formulario y obtiene sus valores
        const objeto = validar(event);

        // Si todos los campos requeridos están completos
        if (Object.keys(objeto).length == cantCamposFormulario) {
            // Convierte el documento y teléfono a tipo numérico
            objeto.documento = Number(objeto.documento)
            objeto.telefono = Number(objeto.telefono)
            // Envía la información actualizada al backend
            const respuesta = await put(`usuarios/${id}`,objeto);
            // Espera la respuesta y la convierte a JSON
            const res=await respuesta.json();

            // Si la respuesta es exitosa
            if (respuesta.ok){
                // Muestra mensaje de éxito
                success(res.mensaje);
                // Redirige a la vista de usuarios
                window.location.href="#/Usuarios"
            } 
            // Si hubo un error, muestra el mensaje de error
            else error(res.error)
        }
    }


    // Asigna el evento submit al formulario para actualizar el usuario
    formulario.addEventListener('submit', actuasslizarUsuario)

    // Validaciones y limpieza de campos para el documento
    documento.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    documento.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    documento.addEventListener('keydown',validarNumeros)

    // Validaciones y limpieza de campos para el nombre
    nombre.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('keydown',validarLetras)

    // Validaciones y limpieza de campos para el teléfono
    telefono.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    telefono.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    telefono.addEventListener('keydown', validarMaximo);
    telefono.addEventListener('keydown',validarNumeros)

    // Limpia el campo de rol si se selecciona un valor distinto de 0
    rol.addEventListener('change', (event) => { if (event.target.value != 0) limpiar(event.target) });
}