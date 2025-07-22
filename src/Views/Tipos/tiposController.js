import { del, get } from "../../helpers/api.js";
import { crearFila, crearTabla } from "../../Modules/modules.js";

export const tiposController=async()=>{

    const contenedor=document.querySelector('.contenido__contenedor');

    const tipos=await get('tipos');

    if(tipos.length>0){
        crearTabla(['Tipo','Precio por hora'],contenedor)
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');


        tipos.forEach(tipo => {
            crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar');
        });
    }

    window.addEventListener('click',async(event)=>{
        const clase=event.target.getAttribute('class');
        const id=event.target.getAttribute('id');

        // if(clase=="registro__boton registro__boton--editar"){
        //     window.location.href=`actualizarTipo.html?id=${encodeURIComponent(id)}`
        // }
        if(clase=='registro__boton registro__boton--eliminar'){
            const respuesta=await del(`tipos/${id}`)
            if(respuesta.ok)alert('El tipo de consola se ha eliminado correctamente')
        }
    })
}