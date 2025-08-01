import { get } from "../../helpers/api"
import { crearFilaTablaReservas, crearTabla } from "../../Modules/modules";

export const historialController=async()=>{

    const main=document.querySelector('.contenido__contenedor');
    const select=document.querySelector('.select_filtro');
    const tot=document.querySelector('.totalHist');


    const reservas=await get('reservas/detalle');

    if(reservas.length>0){
        crearTabla(['Documento','Usuario','Hora Inicio','Hora Fin','Consola'],main);
        
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');
        
        
        for (const reserva of reservas) {
            if(reserva.idEstadoReserva==4){
                await crearFilaTablaReservas(reserva,reserva.id,cuerpoTabla,true);
            }
        }
    }

    const cuerpoTabla=document.querySelector('.tabla__cuerpo');


    

    const metodosPago=await get('metodospago');

    metodosPago.forEach(metodo => {
        const option=document.createElement('option');
        option.setAttribute('value',metodo.id);
        option.textContent=metodo.metodoPago;
        select.append(option);
    });

    select.addEventListener('change',async(event)=>{
        const id=event.target.value;

        let total=0;
        if(id!=0){
            const tot=await get(`pagos/metodo/${id}/total`);
            total=tot.total_pagado;

            cuerpoTabla.innerHTML="";
            const reservas=await get(`pagos/metodo/${id}/reservas`);
            if(reservas.length>0){
                reservas.forEach(reserva => {
                    crearFilaTablaReservas(reserva, reserva.id, cuerpoTabla);
                });
            }

        }
        else{

            const reservas=await get('reservas/detalle')
            reservas.forEach(reserva => {
                if(reserva.idEstadoReserva==4){
                    crearFilaTablaReservas(reserva, reserva.id, cuerpoTabla);
                }
            });
            const tot=await get('pagos/total');
            total=tot.total_pagado;
        }
        tot.textContent=`Total: $${total}`

    });

}