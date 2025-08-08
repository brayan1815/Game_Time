import { error, success } from "../../../helpers/alertas.js";
import { post, post_imgs } from "../../../helpers/api.js";
import { cargarSelectTiposConsols, contarCamposFormulario, limpiar, validar, validarImagen, validarLetras, validarMaximo, validarMinimo } from "../../../Modules/modules.js"
export const crearConsolasController=async()=>{

    const formulario=document.querySelector('form');
    const inputImg=document.querySelector('#seleccionarImagen');
    const labelImagen = document.querySelector('.formulario__insertarImagen');
    const inputNombre=document.querySelector('#nombre');
    const descripcionCosnola=document.querySelector('#descripcion')
    const numeroSerie=document.querySelector('#numero_serie');
    const select=document.querySelector('select');

    const cantCampos=contarCamposFormulario(formulario);
    await cargarSelectTiposConsols(select);

    formulario.addEventListener('submit',async (event)=>{
        event.preventDefault();

        const imagen = validarImagen(inputImg, labelImagen);
        const info=validar(event);

        if(imagen!=false){
            const formData = new FormData();
            formData.append('archivo',imagen)
            const respuesta = await post_imgs(formData);
            const response = await respuesta.json();
            info['id_imagen'] = response.id_imagen

            
            if(Object.keys(info).length==cantCampos){
                info['id_tipo']=parseInt(info.id_tipo)
                info['id_estado']=1;
                info['numero_serie']=info['numero_serie'].toLowerCase();
                console.log(info);
                
                
                const respuesta=await post('consolas',info);
                const res=await respuesta.json();
                if (respuesta.ok) success(res.mensaje);
                else error(res.error)
            }

        }
    })

    inputNombre.addEventListener('keydown',validarLetras);
    inputNombre.addEventListener('keydown',validarMaximo);
    inputNombre.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    inputNombre.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});

    descripcionCosnola.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    descripcionCosnola.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});


    inputNombre.addEventListener('focus',()=>{validarImagen(inputImg,labelImagen)});
    descripcionCosnola.addEventListener('focus',()=>{validarImagen(inputImg,labelImagen)});
    select.addEventListener('focus',()=>{validarImagen(inputImg,labelImagen)});

    numeroSerie.addEventListener('keydown',validarMaximo);
    numeroSerie.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    numeroSerie.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});

}