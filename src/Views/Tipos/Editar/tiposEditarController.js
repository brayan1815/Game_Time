import { success } from "../../../helpers/alertas.js";
import { get, put } from "../../../helpers/api.js";
import { contarCamposFormulario, validar,validarMinimo,limpiar,validarMaximo } from "../../../Modules/modules.js";

export const tiposEditarController=async(parametros=null)=>{

    const formulario=document.querySelector('form');
    const inputTipo=document.querySelector('#tipo');
    const inputPrecio=document.querySelector('#precio_hora');

    const {id} = parametros;
    const tipo= await get(`tipos/${id}`)

    inputTipo.value=tipo.tipo;
    inputPrecio.value=tipo.precio_hora;

    const cantCampos=contarCamposFormulario(formulario);

    formulario.addEventListener('submit',async(event)=>{
        const info=validar(event);

        if(Object.keys(info).length==cantCampos){
            const respuesta=await put(`tipos/${id}`,info);
            const res=await respuesta.json();
            if(respuesta.ok)success(res.mensaje)
        }
    })

    inputTipo.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputTipo.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputTipo.addEventListener('keydown',validarMaximo);

    inputPrecio.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputPrecio.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)})
    inputPrecio.addEventListener('keydown',validarMaximo);
}