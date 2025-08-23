
// Importa las funciones para mostrar alertas de confirmación, error y éxito
import { confirmar, error, success } from "../../helpers/alertas.js";
// Importa las funciones para hacer peticiones al backend
import { del, get } from "../../helpers/api.js";
// Importa utilidades para cargar cards y verificar permisos
import { crearCardsProductos, tienePermiso } from "../../Modules/modules.js";


/**
 * Controlador para la vista de productos.
 * Carga los productos, muestra las cards y permite eliminar productos si el usuario tiene permiso.
 */
export const productosController=async()=>{
    // Obtiene el contenedor donde se mostrarán las cards de productos
    const contenedorCards=document.querySelector('.cards');
    // Obtiene el botón para crear un nuevo producto
    const btnNuevoProd=document.querySelector('.boton.boton--crear');

    // Si el usuario no tiene permiso para crear productos, oculta el botón
    if(!tienePermiso("productos.crear")){
        btnNuevoProd.classList.add('displayNone'); // Oculta el botón de nuevo producto
    }else{
        btnNuevoProd.classList.remove('displayNone'); // Muestra el botón de nuevo producto
    }

    // Solicita los productos al backend
    const productos=await get('productos')

    // Crea las cards de productos en el contenedor
    crearCardsProductos(productos,contenedorCards);

    // Evento global para eliminar productos al hacer click en el botón correspondiente
    window.addEventListener('click',async(event)=>{
        // Obtiene la clase del elemento clickeado
        const clase=event.target.getAttribute('class');
        // Obtiene el id del producto desde el elemento clickeado
        const id=event.target.getAttribute('id');
        // Si se hace click en el botón eliminar de una card de producto
        if(clase=="boton boton--cardIcono eliminar"){
            // Muestra un cuadro de confirmación antes de eliminar
            const confirm=await confirmar('eliminar el producto');
            // Si el usuario confirma la eliminación
            if(confirm.isConfirmed){
                // Realiza la petición DELETE al backend para eliminar el producto
                const respuesta=await del(`productos/${id}`);
                // Espera la respuesta y la convierte a JSON
                const res=await respuesta.json();

                // Si la respuesta es exitosa
                if(respuesta.ok){
                    // Muestra mensaje de éxito
                    success(res.mensaje);
                    // Busca la card del producto eliminado en el DOM
                    const card=document.querySelector(`.card#card_${id}`);
                    // Elimina la card del DOM
                    card.remove();
                }
                // Si hubo un error al eliminar, muestra el mensaje de error
                else error(res.error)
            }
        }
    })
}