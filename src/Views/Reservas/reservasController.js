// Importa funciones para mostrar alertas personalizadas (confirmar, error, success)
import { confirmar, error, success } from "../../helpers/alertas.js";
// Importa funciones para realizar peticiones DELETE, GET y PUT a la API
import { del, get } from "../../helpers/api.js";
// Importa funciones para convertir permisos, crear filas y tablas de reservas
import { convertirPermisosArray, crearFilaTablaReservas, crearTabla } from "../../Modules/modules.js";
// Importa función para validar que solo se ingresen números
import { validarNumeros } from "../../Modules/validaciones.js";

/**
 * Controlador principal para la gestión de reservas.
 * Se encarga de mostrar, buscar, actualizar y cancelar reservas, así como de manipular la tabla y los estados visuales.
 */
export const reservasController=async()=>{
    // Obtiene el usuario actual desde el localStorage y lo convierte a objeto
    const usuario=JSON.parse(localStorage.getItem('usuario'));

    
    // Selecciona el contenedor principal donde se mostrará la tabla de reservas
    const main=document.querySelector('.contenido__contenedor');
    // Selecciona el contenedor de la barra de búsqueda
    const comtenedorBarraBusqueda=document.querySelector('.botonesSuperiores__buscar')
    // Selecciona el input de búsqueda
    const barraBusqueda=document.querySelector('.buscar__input');
    // Si el usuario no es administrador, oculta la barra de búsqueda
    if(usuario.id_rol!=1)comtenedorBarraBusqueda.classList.add('displayNone');
    else comtenedorBarraBusqueda.classList.remove('displayNone');

    // Variable para almacenar las reservas obtenidas
    let reservas=null;
    // Si el usuario es administrador, obtiene todas las reservas
    if(usuario.id_rol==1){
        reservas=await get('reservas/detalle');
    }
    // Si es usuario normal, obtiene solo sus reservas
    else{
        reservas=await get(`reservas/detalle/${usuario.id}`)
    }

    // Si existen reservas, crea la tabla y agrega las filas
    if(reservas.length>0){
        // Crea la tabla con los encabezados indicados
        crearTabla(['Documento','Usuario','Hora Inicio','Hora Fin','Consola'],main);

        // Selecciona el cuerpo de la tabla
        const cuerpoTabla=document.querySelector('.tabla__cuerpo');

        // Recorre cada reserva y crea una fila en la tabla si no está cobrada
        for (const reserva of reservas) {
            if(reserva.idEstadoReserva!=4){
                await crearFilaTablaReservas(reserva,reserva.id,cuerpoTabla);
            }
        }
    }

    // Selecciona el cuerpo de la tabla para búsquedas y actualizaciones
    const cuerrpoTabla=document.querySelector('.tabla__cuerpo');

    /**
     * Actualiza los estados visuales de las reservas en la tabla según su estado actual.
     * Se ejecuta periódicamente para mantener la información actualizada.
     */
    const actualizarEstados=async()=>{
        // Obtiene las reservas con estado actualizado desde la API
        const reservasActualizadas = await get("reservas/estado-actualizado");

        // Recorre cada reserva actualizada
        for (const reserva of reservasActualizadas) {
            // Selecciona la fila correspondiente a la reserva por su id
            const fila = document.querySelector(`.tabla__fila[id="${reserva.id}"]`);

            // Si la fila existe en la tabla
            if (fila) {
                // Elimina las clases de color previas
                fila.classList.remove("tabla__fila--verde", "tabla__fila--rojo","tabla__fila--blanco");

                // Si la reserva está en estado 2 (activa), pinta la fila de verde
                if (reserva.idEstadoReserva == 2) {
                    fila.classList.add("tabla__fila--verde");
                } else if (reserva.idEstadoReserva == 3) {
                    // Si está en estado 3 (finalizada), pinta la fila de rojo
                    fila.classList.add("tabla__fila--rojo");
                }
            }
        }

        // Calcula los minutos restantes para la próxima actualización (cada media hora)
        const minutosActuales = new Date().getMinutes();
        let volvEje=0;
        if(minutosActuales<30)volvEje=30-minutosActuales;
        else volvEje=60-minutosActuales;

        // Imprime en consola cuándo se volverá a ejecutar
        console.log("Se volvera a ejecutar en: "+volvEje);

        // Programa la próxima ejecución de la función
        setTimeout(actualizarEstados, volvEje * 60000)
    }
    // Llama a la función para actualizar los estados al cargar el controlador
    actualizarEstados();

    // Variable de control para evitar búsquedas simultáneas
    let estaBuscando = false;

    /**
     * Busca reservas según el texto ingresado en la barra de búsqueda.
     * Filtra por documento del usuario y actualiza la tabla.
     * @param {Event} event - Evento de input en la barra de búsqueda.
     */
    const buscarReservas = async (event) => {
        // Si ya se está buscando, no ejecuta otra búsqueda
        if (estaBuscando) return;

        // Marca que se está realizando una búsqueda
        estaBuscando = true;

        // Obtiene el texto ingresado y lo limpia de espacios
        const texto = event.target.value.trim();
        // Crea una expresión regular para buscar por documento
        const regex = new RegExp("^" + texto);
        let reservas=null;

        // Si el usuario es administrador, obtiene todas las reservas
        if(usuario.id_rol==1){
            reservas = await get('reservas/detalle');
        }else{
            // Si es usuario normal, obtiene solo sus reservas
            reservas=await get(`reservas/usuario/${usuario.id}`)
        }

        // Limpia el cuerpo de la tabla antes de mostrar los resultados
        cuerrpoTabla.innerHTML = "";

        // Recorre cada reserva y la muestra si coincide con el filtro
        for (const reserva of reservas) {
            // Obtiene el usuario de la reserva por documento
            const usu = await get(`usuarios/documento/${reserva.documentoUsuario}`);
            // Convierte el documento a string
            const documento = String(usu.documento);

            // Si el texto está vacío o coincide con el documento, muestra la reserva
            if (texto === "" || regex.test(documento)) {
                if(reserva.idEstadoReserva!=4){
                    crearFilaTablaReservas(reserva, reserva.id, cuerrpoTabla);
                }
            }
        }

        // Marca que la búsqueda ha terminado
        estaBuscando = false;
    };

    // Agrega eventos a la barra de búsqueda para buscar y validar solo números
    barraBusqueda.addEventListener('input', buscarReservas);
    barraBusqueda.addEventListener('keydown', validarNumeros);

    // Evento global para manejar clicks en la ventana (cancelar reservas)
    window.addEventListener('click',async(event)=>{
        // Obtiene la clase y el id del elemento clickeado
        const clase=event.target.getAttribute('class');
        const id=event.target.getAttribute('id');

        // Si se hace clic en el botón de cancelar reserva
        if(clase=='boton boton--tabla cancel'){
            // Muestra confirmación al usuario
            const confirm=await confirmar("cancelar la reserva");

            // Si el usuario confirma la cancelación
            if(confirm.isConfirmed){
                // Realiza la petición DELETE para cancelar la reserva
                const res=await del(`reservas/${id}`);
                // Obtiene la respuesta en formato JSON
                const respuesta=await res.json();

                // Si la cancelación fue exitosa
                if(res.ok){
                    // Muestra mensaje de éxito
                    success(respuesta.mensaje);
                    // Elimina la fila de la reserva de la tabla
                    const reserva=document.querySelector(`#reserva_${id}`);
                    reserva.remove();
                }
                else{
                    // Si hubo error, muestra mensaje de error
                    error(respuesta.error)
                }
            }
        }
    })
}