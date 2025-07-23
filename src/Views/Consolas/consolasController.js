import { del, get } from "../../helpers/api.js";
import { cargarCardsConsolas } from "../../Modules/modules.js";

export const consolasController=async()=>{

  const main=document.querySelector('.cards');
  const botonesSuperiores=document.querySelectorAll('.contenido__Boton');

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
    // if (clase == 'card__boton editar') {
    //   window.location.href=`actualizarConsolas.html?id=${encodeURIComponent(id)}`
    // }
    if (clase == 'card__boton eliminar') {
      const respuesta = await del(`consolas/${id}`);
      if (respuesta.ok) alert("La consola se ha eliminado correctamente");
    }
  })
}