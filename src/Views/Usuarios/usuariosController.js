
// Importa la función para crear filas y tablas en el DOM
import { crearFila, crearTabla } from "../../Modules/modules.js"
// Importa las funciones para mostrar alertas de confirmación, error y éxito
import { confirmar, error, success } from "../../helpers/alertas.js";
// Importa las funciones para hacer peticiones al backend
import { del, get } from "../../helpers/api.js";
/**
 * Controlador para la vista de usuarios.
 * Carga la tabla de usuarios y permite eliminar usuarios si el usuario tiene permiso.
 */
export const usuariosController=async()=>{
    // Obtiene el contenedor principal donde se muestra la tabla de usuarios
    const main=document.querySelector('.contenido__contenedor');

    /**
     * Carga la tabla de usuarios en el contenedor principal.
     * @param {Array} usuarios - Lista de usuarios a mostrar.
     * @param {HTMLElement} main - Contenedor donde se inserta la tabla.
     */
    const cargarTablaUsuarios=(usuarios,main)=>{
        main.innerHTML=""; // Limpia el contenedor
        if(usuarios.length>0){
            // Crea la tabla con los encabezados especificados
            crearTabla(['Documento','Nombre','Correo','Rol'],main);
            // Obtiene el cuerpo de la tabla recién creada
            const cuerpoTabla=document.querySelector('.tabla__cuerpo');
            // Recorre la lista de usuarios y crea una fila para cada uno
            usuarios.forEach(usuario => {
                // Obtiene el usuario actual desde el localStorage
                const usu=JSON.parse(localStorage.getItem('usuario'));
                // Si el usuario está inhabilitado y no es el usuario actual, muestra la fila en rojo
                if(usuario.id_estado==2 && usuario.id!=usu.id){
                    crearFila([usuario.documento,usuario.nombre,usuario.correo,usuario.rol],usuario.id,cuerpoTabla,'Usuarios/Editar',true)
                }else if(usuario.id!=usu.id){
                    // Si el usuario está habilitado y no es el usuario actual, muestra la fila normalmente
                    crearFila([usuario.documento,usuario.nombre,usuario.correo,usuario.rol],usuario.id,cuerpoTabla,'Usuarios/Editar')
                }
            });   
        }
    }

    // Solicita la lista de usuarios con su rol al backend
    const usuarios=await get('usuarios/con-rol');

    // Carga la tabla de usuarios en el contenedor principal
    cargarTablaUsuarios(usuarios,main)

    // Evento global para eliminar usuarios al hacer click en el botón correspondiente
    window.addEventListener('click',async(event)=>{
        // Si el elemento clickeado es el botón eliminar de la tabla
        if (event.target.getAttribute('class') == 'boton boton--tabla eliminar') {
            // Obtiene el id del usuario a eliminar
            const id = event.target.getAttribute('id');
            // Muestra un cuadro de confirmación antes de eliminar
            const confirm=await confirmar("eliminar el usuario");
            // Si el usuario confirma la eliminación
            if(confirm.isConfirmed){
                // Realiza la petición DELETE al backend para eliminar el usuario
                const respuesta = await del(`usuarios/${id}`)
                // Espera la respuesta y la convierte a JSON
                const res=await respuesta.json();
                // Si la respuesta es exitosa
                if(respuesta.ok){
                    // Muestra mensaje de éxito
                    await success(res.mensaje);
                    // Solicita la lista actualizada de usuarios
                    const usuarios=await get('usuarios/con-rol');
                    // Recarga la tabla de usuarios
                    cargarTablaUsuarios(usuarios,main)
                }
                // Si hubo un error al eliminar, muestra el mensaje de error
                else error(res.error);
            }
        }
    })
}