import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get } from "../../helpers/api.js";
import { cargarCardsConsolas } from "../../Modules/modules.js";

export const consolasController=async()=>{

  const main=document.querySelector('.cards');
  const botonesSuperiores=document.querySelectorAll('.boton');

  const usuario=JSON.parse(localStorage.getItem('usuario'));

  [...botonesSuperiores].forEach(boton => {
    
    if(usuario.id_rol!=1){
      boton.classList.add('displayNone');
    }else{
      boton.classList.remove('displayNone');
    }
  });

  const consolas=await get('consolas/con-precio');

  cargarCardsConsolas(consolas, main);

  window.addEventListener('click',async (event) => {
    const clase = event.target.getAttribute('class');
    const id = event.target.getAttribute('id');
    if (clase == 'boton boton--cardIcono eliminar') {

      const confirm=await confirmar("Eliminar la consola");

      if(confirm.isConfirmed){
        const respuesta = await del(`consolas/${id}`);
        const res=await respuesta.json();

        if(respuesta.ok){
          success(res.mensaje);
          location.reload();
          // const card=document.querySelector(`.card#consola_${id}`);
          // card.remove();
        }
        else error(res.error);
      }   
    }
  })
}