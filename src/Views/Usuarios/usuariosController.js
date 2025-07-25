import { crearFila, crearTabla } from "../../Modules/modules.js"
import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";

export const usuariosController=async()=>{

    const main=document.querySelector('.contenido__contenedor');


    const usuarios=await get('usuarios/con-rol');

    if(usuarios.length>0){
        crearTabla(['Documento','Nombre','Correo','Rol'],main);
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');
        
        usuarios.forEach(usuario => {; 
            crearFila([usuario.documento,usuario.nombre,usuario.correo,usuario.rol],usuario.id,cuerpoTabla,'Usuarios/Editar')
        });
        
        
        
    }

    const tabla=document.querySelector('.tabla');

    window.addEventListener('click',async(event)=>{
    if(event.target.getAttribute('class')=='registro__boton registro__boton--editar'){
            const id=event.target.getAttribute('id');       
            window.location.href=`actualizarUsuario.html?id=${encodeURIComponent(id)}`
    }
    
    if (event.target.getAttribute('class') == 'registro__boton registro__boton--eliminar') {
        const id = event.target.getAttribute('id');

        const confirm=await confirmar("eliminar el usuario");

        if(confirm.isConfirmed){
            const respuesta = await del(`usuarios/${id}`)
            const res=await respuesta.json();

            if(respuesta.ok) success(res.mensaje);
            else error(res.error);
        }
        
        
        
    }
    })




}