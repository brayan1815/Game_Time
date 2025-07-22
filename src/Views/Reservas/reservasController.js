import { get, put } from "../../helpers/api.js";
import { crearFilaTablaReservas, crearTabla, validarNumeros } from "../../Modules/modules.js";

export const reservasController=async()=>{
    

    const main=document.querySelector('.contenido__contenedor');
    const barraBusqueda=document.querySelector('.buscar__input');


    const reservas=await get('reservas/detalle');


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

    const reservas = await get('reservas/detalle');
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

    window.addEventListener('click',(event)=>{
        const clase=event.target.getAttribute('class');
        const id=event.target.getAttribute('id');

        // if(clase=='registro__boton Info'){
        //     window.location.href=`info_reserva.html?id=${encodeURIComponent(id)}`
        // }
    
    })
    
}