
// Importa la función post para hacer peticiones HTTP al backend
import { post } from "../../../helpers/api";


/**
 * Controlador para mostrar la información detallada de una factura de reserva.
 * Obtiene los datos de la factura y los muestra en los elementos correspondientes.
 * @param {Object} parametros - Parámetros recibidos, debe contener el id de la reserva.
 */
export const historialInfoController=async(parametros)=>{
    // Extrae el id de la reserva del objeto de parámetros recibido
    const {id}=parametros;

    // Obtiene el elemento del DOM donde se mostrará el subtotal de consola
    const subtConsola=document.querySelector("#pago_consola");
    // Obtiene el elemento del DOM donde se mostrará el subtotal de productos
    const subtProductos=document.querySelector('#pago_consumo');
    // Obtiene el elemento del DOM donde se mostrará el total
    const total=document.querySelector('#total');

    // Realiza una petición POST al backend para obtener la factura de la reserva con el id dado
    const fac=await post(`facturas/reserva/${id}`);
    // Espera la respuesta y la convierte a JSON para obtener los datos de la factura
    const factura=await fac.json();

    // Convierte el total de la factura a string y lo separa por el punto decimal
    const t=factura.total+"";
    const to=t.split('.');
    // Muestra solo la parte entera del total en el elemento correspondiente, anteponiendo el símbolo $
    total.textContent="$"+to[0];

    // Convierte el subtotal de consola a string y lo separa por el punto decimal
    const consCons=factura.subtotalConsola+"";
    const con=consCons.split('.');
    // Muestra solo la parte entera del subtotal de consola en el elemento correspondiente
    subtConsola.textContent=con[0];

    // Muestra el subtotal de productos tal como viene en la respuesta
    subtProductos.textContent=factura.subtotalConsumos;
}