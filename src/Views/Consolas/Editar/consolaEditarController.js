import { success } from "../../../helpers/alertas.js";
import { get,put,post_imgs } from "../../../helpers/api.js";
import { cargarSelectTiposConsols, contarCamposFormulario, limpiar, validar, validarMaximo, validarMinimo } from "../../../Modules/modules.js";

export const consolasEditarController=async(parametros=null)=>{

    const {id} = parametros;


    const formulario = document.querySelector('form');
    const nombre = document.querySelector('#nombre');
    const descripcion = document.querySelector('#descripcion');
    const tipo = document.querySelector('select');
    const inputImg = document.querySelector('#seleccionarImagen')
    const lblSeleccionrImagen = document.querySelector('.formulario__insertarImagen');


    await cargarSelectTiposConsols(tipo);

    const consola = await get(`consolas/${id}`);

    const id_img=consola.id_imagen;

    nombre.value = consola.nombre;
    descripcion.value = consola.descripcion;
    tipo.value = consola.id_tipo;

    const cargarNombreArchivo = () => {
    if (inputImg.files.length > 0) {
        if (lblSeleccionrImagen.nextElementSibling) lblSeleccionrImagen.nextElementSibling.remove();
        const archivo = inputImg.files[0];
        const mensaje = document.createElement('span');
        mensaje.textContent = archivo.name;
        mensaje.classList.add('span--verde');
        lblSeleccionrImagen.insertAdjacentElement('afterend',mensaje)
        
    }
    }

    const cantCampos = contarCamposFormulario(formulario);

    formulario.addEventListener('submit', async (event) => {
    const info= validar(event)
    if(Object.keys(info).length==cantCampos){
            if(inputImg.files.length>0){
                const formData = new FormData();
                formData.append('archivo',inputImg.files[0])
                const respuesta = await post_imgs(formData);
                const response = await respuesta.json();
                info['id_imagen'] = response.id_imagen
                

            }else{
                info['id_imagen']=id_img;
            }
    
            info['id_estado'] = consola.id_estado;
            
            const respuesta=await put(`consolas/${id}`,info);
            const res=await respuesta.json();
            if(respuesta.ok)success(res.mensaje);
        }
    })

    nombre.addEventListener('focus', cargarNombreArchivo);
    descripcion.addEventListener('focus', cargarNombreArchivo);
    tipo.addEventListener('focus', cargarNombreArchivo);

    nombre.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    nombre.addEventListener('keydown', validarMaximo)

    descripcion.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    descripcion.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
}