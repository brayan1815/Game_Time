import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";
import { crearFila, crearTabla } from "../../Modules/modules.js";

export const tiposController=async()=>{

    const contenedor=document.querySelector('.contenido__contenedor');

    const tipos=await get('tipos');

    if(tipos.length>0){
        crearTabla(['Tipo','Precio por hora'],contenedor)
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');


        tipos.forEach(tipo => {
            console.log(tipo);
            
            if(tipo.id_estado_tipo!=2){
                crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar');
            }else{
                crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',true);
            }
        });
    }

    window.addEventListener('click',async(event)=>{
        const clase=event.target.getAttribute('class');
        const id=event.target.getAttribute('id');

        if(clase=='boton boton--tabla eliminar'){

            const confirm=await confirmar("eliminar el tipo de consola")

            if(confirm.isConfirmed){
                const respuesta=await del(`tipos/${id}`)
                const res=await respuesta.json();

                if(respuesta.ok){
                  await success(res.mensaje);  
                  location.reload();
                } 
                else error(res.error)
            }

        }
    })
}