import { crearFila, crearTabla } from "../../Modules/modules.js"
import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";

export const usuariosController=async()=>{

    const main=document.querySelector('.contenido__contenedor');


    const usuarios=await get('usuarios/con-rol');

    if(usuarios.length>0){
        crearTabla(['Documento','Nombre','Correo','Rol'],main);
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');
        
        usuarios.forEach(usuario => {
            const usu=JSON.parse(localStorage.getItem('usuario'));
            
            if(usuario.id_estado==2 && usuario.id!=usu.id){
                crearFila([usuario.documento,usuario.nombre,usuario.correo,usuario.rol],usuario.id,cuerpoTabla,'Usuarios/Editar',true)
            }else if(usuario.id!=usu.id){
                crearFila([usuario.documento,usuario.nombre,usuario.correo,usuario.rol],usuario.id,cuerpoTabla,'Usuarios/Editar')

            }
        });
        
        
        
    }

    window.addEventListener('click',async(event)=>{
    
        if (event.target.getAttribute('class') == 'boton boton--tabla eliminar') {
            const id = event.target.getAttribute('id');

            const confirm=await confirmar("eliminar el usuario");

            if(confirm.isConfirmed){
                const respuesta = await del(`usuarios/${id}`)
                const res=await respuesta.json();

                if(respuesta.ok){
                    await success(res.mensaje);
                    location.reload();
                }
                else error(res.error);
            }
            
            
            
        }
    })




}