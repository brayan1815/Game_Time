import { post } from "../../../helpers/api";

export const historialInfoController=async(parametros)=>{

    const {id}=parametros;
    
    const subtConsola=document.querySelector("#pago_consola");
    const subtProductos=document.querySelector('#pago_consumo');
    const total=document.querySelector('#total');

    const fac=await post(`facturas/reserva/${id}`);
    const factura=await fac.json();
    console.log(factura);

    const t=factura.totalGeneral+"";
    const to=t.split('.');
    

    total.textContent="$"+to[0];
    
    const consCons=factura.totalTiempo+"";
    const con=consCons.split('.');
    subtConsola.textContent=con[0];

    subtProductos.textContent=factura.totalProductos;

    
    
}