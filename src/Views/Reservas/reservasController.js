import { confirmar, error, success } from "../../helpers/alertas.js";
import { del, get, put } from "../../helpers/api.js";
import { crearFilaTablaReservas, crearTabla, validarNumeros } from "../../Modules/modules.js";

export const reservasController=async()=>{
    
    const usuario=JSON.parse(localStorage.getItem('usuario'));

    const main=document.querySelector('.contenido__contenedor');
    const comtenedorBarraBusqueda=document.querySelector('.botonesSuperiores__buscar')
    const barraBusqueda=document.querySelector('.buscar__input');
    if(usuario.id_rol!=1)comtenedorBarraBusqueda.classList.add('displayNone');
    else comtenedorBarraBusqueda.classList.remove('displayNone');

    let reservas=null;
    if(usuario.id_rol==1){
        reservas=await get('reservas/detalle');
    }
    else{
        reservas=await get(`reservas/usuario/${usuario.id}`)
    }


    if(reservas.length>0){
        crearTabla(['Documento','Usuario','Hora Inicio','Hora Fin','Consola'],main);

        const cuerpoTabla=document.querySelector('.tabla__cuerpo');


        for (const reserva of reservas) {
        if(reserva.idEstadoReserva!=4){
            await crearFilaTablaReservas(reserva,reserva.id,cuerpoTabla);
        }
        }
    }

    const cuerrpoTabla=document.querySelector('.tabla__cuerpo');
    const filasTabla=document.querySelectorAll('.tabla__fila');


    const actualizarEstados=async()=>{
        console.log("actualizando estados");
        const reservasActualizadas = await get("reservas/estado-actualizado");

        const horaActual=new Date();
    
    
    
        for (const reserva of reservasActualizadas) {

            const fila = document.querySelector(`.tabla__fila[id="${reserva.id}"]`);//se obtiene la fila con cla clase tabla filla y con el id de la reserva
            console.log(fila);
        
        
        

            if (fila) {
        
                fila.classList.remove("tabla__fila--verde", "tabla__fila--rojo","tabla__fila--blanco");

                if (reserva.idEstadoReserva == 2) {
                    fila.classList.add("tabla__fila--verde");
                } else if (reserva.idEstadoReserva == 3) {
                    fila.classList.add("tabla__fila--rojo");
                }
            }
        }

        const minutosActuales = new Date().getMinutes();
        let volvEje=0;
        if(minutosActuales<30)volvEje=30-minutosActuales;
        else volvEje=60-minutosActuales;

        console.log("Se volvera a ejecutar en: "+volvEje);

        setTimeout(actualizarEstados, volvEje * 60000)
    }
    actualizarEstados();

    let estaBuscando = false;

    const buscarReservas = async (event) => {
        if (estaBuscando) return;

        estaBuscando = true;

        const texto = event.target.value.trim();
        const regex = new RegExp("^" + texto);
        let reservas=null;
        console.log("Entrando");

        if(usuario.id_rol==1){
        
            reservas = await get('reservas/detalle');
        }else{
        reservas=await get(`reservas/usuario/${usuario.id}`)
        }

        cuerrpoTabla.innerHTML = "";

        for (const reserva of reservas) {
            const usu = await get(`usuarios/documento/${reserva.documentoUsuario}`);
            const documento = String(usu.documento);

            if (texto === "" || regex.test(documento)) {
                if(reserva.idEstadoReserva!=4){
                    crearFilaTablaReservas(reserva, reserva.id, cuerrpoTabla);
                }
            }
        }

        estaBuscando = false;
    };


    let aux=false;

    barraBusqueda.addEventListener('input', buscarReservas);
    barraBusqueda.addEventListener('keydown', validarNumeros);

    window.addEventListener('click',async(event)=>{
        const clase=event.target.getAttribute('class');
        const id=event.target.getAttribute('id');

        if(clase=='registro__boton registro__boton--eliminar cancel'){
            const confirm=await confirmar("cancelar la reserva");

            if(confirm.isConfirmed){
                const res=await del(`reservas/${id}`);
                const respuesta=await res.json();

                if(res.ok){
                    success(respuesta.mensaje);
                }
                else{
                    error(respuesta.error)
                }
            }
        }
    
    })
    
}