import { error, success } from "../../../helpers/alertas.js";
import { get, put } from "../../../helpers/api.js";
import { cargarSelectRoles, contarCamposFormulario, limpiar, validar, validarContrasenia, validarMaximo, validarMinimo } from "../../../Modules/modules.js";

export const usuariosEditarController=async(parametros=null)=>{
    

    const formulario = document.querySelector('form')
    const documento=document.querySelector('#documento')
    const nombre=document.querySelector('#nombre')
    const telefono=document.querySelector('#telefono')
    const correo=document.querySelector('#correo')
    const contrasenia=document.querySelector('#contrasenia')
    const rol=document.querySelector('select')

    await cargarSelectRoles(rol);

    const id = parametros.id;
    console.log(id);
    

    const usuario=await get(`usuarios/${id}`);

    documento.value = usuario.documento;
    nombre.value=usuario.nombre
    telefono.value=usuario.telefono
    correo.value=usuario.correo
    contrasenia.value=usuario.contrasenia
    rol.value = usuario.id_rol

    const cantCamposFormulario = contarCamposFormulario(formulario);

    const actuasslizarUsuario = async (event) => {
    
    const objeto = validar(event);

    if (Object.keys(objeto).length == cantCamposFormulario) {
        
        objeto.documento = Number(objeto.documento)
        objeto.telefono = Number(objeto.telefono)
        
        console.log(objeto);

        const respuesta = await put(`usuarios/${id}`,objeto);
        const res=await respuesta.json();

        if (respuesta.ok) success(res.mensaje)
        else error('Ocurrio un error al intentar actualizar el usuario')
        
    }
    }

    formulario.addEventListener('submit', actuasslizarUsuario)
    documento.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    documento.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    telefono.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    telefono.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    telefono.addEventListener('keydown', validarMaximo);
    contrasenia.addEventListener('blur',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)})
    contrasenia.addEventListener('keydown',(event)=>{if(validarContrasenia(event.target))limpiar(event.target)})
    rol.addEventListener('change', (event) => { if (event.target.value != 0) limpiar(event.target) });
}