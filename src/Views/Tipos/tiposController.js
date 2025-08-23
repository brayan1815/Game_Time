import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";
import { crearFila, crearTabla, tienePermiso } from "../../Modules/modules.js";
import { usuariosController } from "../Usuarios/usuariosController.js";

export const tiposController=async()=>{

    const btnNuevoTipo=document.querySelector('.boton--crear.tipo');

    if(!tienePermiso('tipos.crear')){
        btnNuevoTipo.classList.add('displayNone')
    }

    const cargarTablaTipos=(contenedor,tipos)=>{
        const usu=JSON.parse(localStorage.getItem('usuario'));
        contenedor.innerHTML="";
        if(tipos.length>0){
            crearTabla(['Tipo','Precio por hora'],contenedor)
            const cuerpoTabla=document.querySelector('.tabla__cuerpo');
    
    
            tipos.forEach(tipo => {
                console.log(tipo);
                
                if(tipo.id_estado_tipo!=2){
                    if(usu.id_rol==2){
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',false,false);
                    }else{
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',false,true);
                    }
                }else{
                    if(usu.id_rol==2){
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',true,false);
                    }else{
                        crearFila([tipo.tipo,"$"+tipo.precio_hora],tipo.id,cuerpoTabla,'Tipos/Editar',true,true);
                    }
                }
            });
        }
    }

    const contenedor=document.querySelector('.contenido__contenedor');
    const tipos=await get('tipos');
    
    cargarTablaTipos(contenedor,tipos);


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
                  const tipos=await get('tipos');
                  cargarTablaTipos(contenedor,tipos);
                } 
                else error(res.error)
            }

        }
    })
}