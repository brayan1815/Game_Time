// Importa funciones para mostrar alertas personalizadas (confirmar, error, success)
import { confirmar, error, success } from "../../helpers/alertas.js";
// Importa funciones para realizar peticiones DELETE y GET a la API
import { del, get } from "../../helpers/api.js";
// Importa funciones para crear filas, tablas y verificar permisos
import { crearFila, crearTabla, tienePermiso } from "../../Modules/modules.js";

/**
 * Controlador principal para la gestión de tipos de consola.
 * Se encarga de mostrar, crear y eliminar tipos, así como de manipular la tabla y los permisos.
 */
export const tiposController=async()=>{

    // Selecciona el botón para crear un nuevo tipo
    const btnNuevoTipo=document.querySelector('.boton--crear.tipo');

    // Si el usuario no tiene permiso para crear tipos, oculta el botón
    if(!tienePermiso('tipos.crear')){
        btnNuevoTipo.classList.add('displayNone')
    }

    /**
     * Carga la tabla de tipos de consola en el contenedor indicado.
     * @param {HTMLElement} contenedor - Contenedor donde se renderiza la tabla.
     * @param {Array} tipos - Lista de tipos de consola a mostrar.
     */
    const cargarTablaTipos=(contenedor,tipos)=>{
        // Obtiene el usuario actual desde el localStorage
        const usu=JSON.parse(localStorage.getItem('usuario'));
        // Limpia el contenido previo del contenedor
        contenedor.innerHTML="";
        // Si existen tipos, crea la tabla y agrega las filas
        if(tipos.length>0){
            // Crea la tabla con los encabezados indicados
            crearTabla(['Tipo','Precio por hora'],contenedor)
            // Selecciona el cuerpo de la tabla
            const cuerpoTabla=document.querySelector('.tabla__cuerpo');

            // Recorre cada tipo y crea una fila en la tabla según su estado y el rol del usuario
            tipos.forEach(tipo => {
                // Si el tipo no está inactivo (estado distinto de 2)
                if(tipo.id_estado_tipo!=2){
                    // Si el usuario es rol 2, no puede eliminar
                    if(usu.id_rol==2){
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',false,false);
                    }else{
                        // Si es admin, puede eliminar
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',false,true);
                    }
                }else{
                    // Si el tipo está inactivo, cambia los permisos de edición/eliminación
                    if(usu.id_rol==2){
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',true,false);
                    }else{
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',true,true);
                    }
                }
            });
        }
    }

    // Selecciona el contenedor principal donde se mostrará la tabla de tipos
    const contenedor=document.querySelector('.contenido__contenedor');
    // Realiza una petición GET para obtener todos los tipos de consola
    const tipos=await get('tipos');
    // Carga la tabla de tipos en el contenedor
    cargarTablaTipos(contenedor,tipos);


    // Evento global para manejar clicks en la ventana (eliminar tipos)
    window.addEventListener('click',async(event)=>{
        // Obtiene la clase y el id del elemento clickeado
        const clase=event.target.getAttribute('class');
        const id=event.target.getAttribute('id');

        // Si se hace clic en el botón de eliminar tipo
        if(clase=='boton boton--tabla eliminar'){
            // Muestra confirmación al usuario
            const confirm=await confirmar("eliminar el tipo de consola")

            // Si el usuario confirma la eliminación
            if(confirm.isConfirmed){
                // Realiza la petición DELETE para eliminar el tipo
                const respuesta=await del(`tipos/${id}`)
                // Obtiene la respuesta en formato JSON
                const res=await respuesta.json();

                // Si la eliminación fue exitosa
                if(respuesta.ok){
                    // Muestra mensaje de éxito
                    await success(res.mensaje);  
                    // Vuelve a cargar la tabla de tipos actualizada
                    const tipos=await get('tipos');
                    cargarTablaTipos(contenedor,tipos);
                } 
                else error(res.error)
            }
        }
    })
}