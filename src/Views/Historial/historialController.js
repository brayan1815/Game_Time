// Importa la función para hacer peticiones GET a la API
import { get } from "../../helpers/api"
// Importa funciones para crear la tabla y las filas de reservas
import { crearFilaTablaReservas, crearTabla } from "../../Modules/modules";

/**
 * Controlador principal para la vista de historial de reservas.
 * Se encarga de mostrar el historial, filtrar por método de pago y calcular totales.
 * No recibe parámetros ni retorna nada. Modifica el DOM y realiza peticiones a la API.
 */
export const historialController=async()=>{
    // Obtiene el contenedor principal donde se mostrará la tabla
    const main=document.querySelector('.contenido__contenedor');
    // Obtiene el select para filtrar por método de pago
    const select=document.querySelector('.select_filtro');
    // Obtiene el elemento donde se muestra el total pagado
    const tot=document.querySelector('.totalHist');


    // Obtiene todas las reservas con detalle desde la API
    const reservas=await get('reservas/detalle');

    // Si hay reservas, crea la tabla y muestra solo las finalizadas (estado 4)
    if(reservas.length>0){
        crearTabla(['Documento','Usuario','Hora Inicio','Hora Fin','Consola'],main);
        // Obtiene el cuerpo de la tabla donde se insertarán las filas
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');
        // Recorre cada reserva y muestra solo las finalizadas
        for (const reserva of reservas) {
            if(reserva.idEstadoReserva==4){
                await crearFilaTablaReservas(reserva,reserva.id,cuerpoTabla,true);
            }
        }
    }
    // Obtiene el cuerpo de la tabla
    const cuerpoTabla=document.querySelector('.tabla__cuerpo');


    // Obtiene los métodos de pago desde la API
    const metodosPago=await get('metodospago');
    // Llena el select con los métodos de pago disponibles
    metodosPago.forEach(metodo => {
        const option=document.createElement('option');
        option.setAttribute('value',metodo.id);
        option.textContent=metodo.metodoPago;
        select.append(option);
    });

    // Evento para filtrar la tabla por método de pago seleccionado
    select.addEventListener('change',async(event)=>{
        // Obtiene el id del método de pago seleccionado
        const id=event.target.value;

        // Inicializa el total en 0
        let total=0;
        // Limpia el cuerpo de la tabla
        cuerpoTabla.innerHTML="";
        // Si se selecciona un método de pago específico
        if(id!=0){
            // Obtiene el total pagado por ese método
            const tot=await get(`pagos/metodo/${id}/total`);
            total=tot.total_pagado;

            // Obtiene las reservas pagadas con ese método
            const reservas=await get(`pagos/metodo/${id}/reservas`);
            // Si hay reservas, las muestra en la tabla
            if(reservas.length>0){
                reservas.forEach(reserva => {
                    crearFilaTablaReservas(reserva, reserva.id, cuerpoTabla,true);
                });
            }

        }
        // Si se selecciona "todos los métodos"
        else{
            // Obtiene todas las reservas con detalle
            const reservas=await get('reservas/detalle')
            reservas.forEach(reserva => {
                if(reserva.idEstadoReserva==4){
                    crearFilaTablaReservas(reserva, reserva.id, cuerpoTabla,true);
                }
            });
            // Obtiene el total pagado de todas las reservas
            const tot=await get('pagos/total');
            total=tot.total_pagado;
        }
        // Muestra el total pagado en el elemento correspondiente
        tot.textContent=`Total: $${total}`

    });

}