import { success } from "../../../helpers/alertas.js";
import { post, post_imgs } from "../../../helpers/api.js";
import { contarCamposFormulario, limpiar, validar, validarImagen, validarMaximo, validarMinimo, validarNumeros } from "../../../Modules/modules.js";

export const crearProductosController=()=>{

    const formulario = document.querySelector('form');
    const nombreprod = document.querySelector('#nombre')
    const descripcionProd=document.querySelector('#descripcion')
    const precio_prod=document.querySelector('#precio');
    const canti_disponi=document.querySelector('#cantidades_disponibles');
    const inputImg=document.querySelector('#seleccionarImagen');
    const labelImagen = document.querySelector('.formulario__insertarImagen')
    const camposForm = document.querySelectorAll('input');

    camposForm.forEach((campo) => {
    campo.addEventListener('focus', () => {
        
        validarImagen(inputImg,labelImagen)
    })
    })



    inputImg.addEventListener('focusout',()=>{validarImagen(inputImg,labelImagen)});

    formulario.addEventListener('submit',async(event)=>{
    event.preventDefault();

    const imagen = validarImagen(inputImg, labelImagen);
    const cantCamposFormulario = contarCamposFormulario(event.target);
    const info=validar(event);
    

    if(imagen!=false){
        const formData = new FormData();
        formData.append('archivo',imagen)
        const respuesta = await post_imgs(formData);
        const response = await respuesta.json();
        // console.log(response.id_imagen);
        info['id_imagen'] = response.id_imagen
    
        
        if (Object.keys(info).length == cantCamposFormulario) {
        info['cantidades_disponibles']=Number(info['cantidades_disponibles'])
        info['precio']=Number(info.precio)

        info['id_estado_producto']=1;

        if(info['cantidades_disponibles']==0) info['id_estado_producto']=2

        const respuesta=await post('productos',info);
        const res=await respuesta.json();

        if(respuesta.ok){
            success(res.mensaje);

            inputImg.value='';
            labelImagen.nextElementSibling.remove();
            nombreprod.value='';
            descripcionProd.value='';
            precio_prod.value="";
            canti_disponi.value="";
        }
        
        
        }
    }
    })

    nombreprod.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombreprod.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });

    descripcionProd.addEventListener('blur',(event)=>{if(validarMinimo(event.target)) limpiar(event.target)})
    descripcionProd.addEventListener('keydown',(event)=>{if(validarMinimo(event.target)) limpiar(event.target)})

    precio_prod.addEventListener('keydown',validarNumeros);
    precio_prod.addEventListener('keydown',validarMaximo);
    precio_prod.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    precio_prod.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});

    canti_disponi.addEventListener('keydown',validarNumeros);
    canti_disponi.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    canti_disponi.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
}