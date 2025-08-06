import { get, post } from "../../../helpers/api.js";
import { error, success } from "../../../helpers/alertas.js";
import {contarCamposFormulario, limpiar, validar, validarContrasenia, validarCorreo, validarLetras, validarMaximo, validarMinimo, validarNumeros} from "../../../Modules/modules.js";

export const crearUsuarioController=async()=>{

    const select = document.querySelector('select');
    const formulario = document.querySelector('form');
    const docuemnto=document.querySelector('#documento');
    const nombre=document.querySelector('#nombre');
    const telefono=document.querySelector('#telefono');
    const correo=document.querySelector('#correo');
    const contrasenia=document.querySelector('#contrasenia');


    const roles=await get('roles');

    roles.forEach(item => {
        const option=document.createElement('option');
        option.setAttribute('value',item.id)
        option.textContent=item.rol;
        select.append(option);
    });

    const camposForm= contarCamposFormulario(formulario);

    formulario.addEventListener('submit', async(event)=>{
        const info=validar(event);
        if(Object.keys(info).length==camposForm){
            info['id_estado']=1;   
            const respuesta=await post('usuarios',info);
            const res=await respuesta.json();
            if(respuesta.ok) success(res.mensaje);
            else{
                error(res.error)
            }
        }
    })

    docuemnto.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    docuemnto.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    docuemnto.addEventListener('keydown',validarNumeros);
    docuemnto.addEventListener('keydown',validarMaximo);


    nombre.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    nombre.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    nombre.addEventListener('keydown',validarMaximo);
    nombre.addEventListener('keydown',validarLetras);

    telefono.addEventListener('blur',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    telefono.addEventListener('keydown',(event)=>{if(validarMinimo(event.target))limpiar(event.target)});
    telefono.addEventListener('keydown',validarNumeros);
    telefono.addEventListener('keydown',validarMaximo);

    correo.addEventListener('keydown',(event)=>{if(validarCorreo(event.target))limpiar(event.target)});
    correo.addEventListener('blur',(event)=>{if(validarCorreo(event.target))limpiar(event.target)});

    contrasenia.addEventListener('keydown',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)});
    contrasenia.addEventListener('blur',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)});
}