import { error, success } from "../../../helpers/alertas.js";
import { post } from "../../../helpers/api.js";
import { contarCamposFormulario, limpiar, validar, validarMaximo, validarMinimo, validarNumeros } from "../../../Modules/modules.js";

export const crearTiposController=()=>{

    const formulario=document.querySelector('form');
    const inputTipo=document.querySelector('#tipo');
    const inputPrecio=document.querySelector('#precio_hora');

    const camposForm=contarCamposFormulario(formulario);

    formulario.addEventListener('submit',async(event)=>{
        const info=validar(event);

        if(Object.keys(info).length==camposForm){
            info['precio_hora']=Number(info['precio_hora'])
            info['id_estado_tipo']=1;
            info['tipo']=info['tipo'].toLowerCase();
            const respuesta=await post('tipos',info);
            const res=await respuesta.json();
            if(respuesta.ok) success(res.mensaje);
            else error(res.error)
        }
    })

    inputTipo.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputTipo.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputTipo.addEventListener('keydown',validarMaximo);

    inputPrecio.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputPrecio.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputPrecio.addEventListener('keydown',validarMaximo);
    inputPrecio.addEventListener('keydown',validarNumeros)
}