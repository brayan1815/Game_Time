import { error, success } from "../../../helpers/alertas.js";
import { get, put } from "../../../helpers/api.js";
import { contarCamposFormulario } from "../../../Modules/modules.js";
import { validar, validarMinimo, limpiar, validarMaximo, validarNumeros, validarLetras, validarContrasenia, validarCorreo, validarImagen } from "../../../Modules/validaciones.js";

export const tiposEditarController=async(parametros=null)=>{

    const formulario=document.querySelector('form');
    const inputTipo=document.querySelector('#tipo');
    const inputPrecio=document.querySelector('#precio_hora');
    const estadoSelect=document.querySelector('select');

    const estados=await get('estadosTipo');

    estados.forEach(estado => {
        const option=document.createElement('option');
        option.setAttribute('value',estado.id);
        option.textContent=estado.estado;
        estadoSelect.append(option)
    });

    


    const {id} = parametros;
    const tipo= await get(`tipos/${id}`)

    console.log(tipo);
    

    estadoSelect.value=tipo.id_estado_tipo;
    inputTipo.value=tipo.tipo;
    inputPrecio.value=tipo.precio_hora;

    const cantCampos=contarCamposFormulario(formulario);

    formulario.addEventListener('submit',async(event)=>{
        const info=validar(event);

        if(Object.keys(info).length==cantCampos){
            info['tipo']=info['tipo'].toLowerCase();
            const respuesta=await put(`tipos/${id}`,info);
            const res=await respuesta.json();
            if(respuesta.ok){
                await success(res.mensaje);
                window.location.href = "#/Tipos";
            }
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