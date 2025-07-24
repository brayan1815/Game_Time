import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";
import { crearCardsProductos } from "../../Modules/modules.js";

export const productosController=async()=>{

const contenedorCards=document.querySelector('.cards');
const btnNuevoProd=document.querySelector('.contenido__Boton');

const usuarios=JSON.parse(localStorage.getItem('usuario'));

if(usuarios.id_rol!=1){
    btnNuevoProd.classList.add('displayNone');
}else{
    btnNuevoProd.classList.remove('displayNone');
}

const productos=await get('productos')

crearCardsProductos(productos,contenedorCards);

window.addEventListener('click',async(event)=>{
    const clase=event.target.getAttribute('class');
    const id=event.target.getAttribute('id');
    if(clase=="card__boton eliminar"){

        const confirm=await confirmar('eliminar el producto');
        if(confirm.isConfirmed){
            const respuesta=await del(`productos/${id}`);
            const res=await respuesta.json();

            if(respuesta.ok)success(res.mensaje);
            else error(res.error)
        }
    }
})
}