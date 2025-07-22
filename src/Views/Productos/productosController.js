import { del, get } from "../../helpers/api.js";
import { crearCardsProductos } from "../../Modules/modules.js";

export const productosController=async()=>{

const contenedorCards=document.querySelector('.cards');

const productos=await get('productos')

crearCardsProductos(productos,contenedorCards);

window.addEventListener('click',async(event)=>{
    const clase=event.target.getAttribute('class');
    const id=event.target.getAttribute('id');

    // if(clase=="card__boton editar"){
    //     window.location.href=`actualizarProducto.html?id=${encodeURIComponent(id)}`
    // }
    if(clase=="card__boton eliminar"){
        const respuesta=await del(`productos/${id}`)
        if(respuesta.ok)alert('El producto se ha eliminado correctamente');
    }
})
}