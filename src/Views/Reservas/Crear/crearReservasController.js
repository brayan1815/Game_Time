// Importa las funciones para mostrar alertas personalizadas (confirmar, error, success)
import { confirmar, error, success } from "../../../helpers/alertas.js";
// Importa las funciones para realizar peticiones GET y POST a la API
import { get, post } from "../../../helpers/api.js";
// Importa funciones para cargar consolas, contar campos de formulario y formatear fechas
import { cargarCardsConsolasReservar, contarCamposFormulario, formatearFecha } from "../../../Modules/modules.js";
// Importa funciones de validación y limpieza de campos
import { limpiar, validar, validarLetras, validarMaximo, validarMinimo, validarNumeros } from "../../../Modules/validaciones.js";

/**
 * Controlador principal para la creación de reservas.
 * Se encarga de gestionar la lógica de la vista para crear una nueva reserva, incluyendo la interacción con el calendario,
 * la validación de datos, la comunicación con la API y la manipulación del DOM.
 */
export const crearReservaController=async()=>{
    // Obtiene el usuario actual desde el localStorage y lo convierte a objeto
    const usuario=JSON.parse(localStorage.getItem('usuario'))

    // Selecciona el contenedor donde se mostrarán las tarjetas de consolas
    const contenedor=document.querySelector('.cards--consolas');
    // Selecciona el contenedor del calendario oculto
    const calendariOculto=document.querySelector('.calendariOculto');
    // Selecciona el fondo oscuro que aparece al mostrar el calendario
    const fondoOscuro=document.querySelector('.fondoOscuro');
    // Selecciona el contenedor del formulario modal para nueva reserva
    const contenedorformularioNuevaReserva=document.querySelector('.contenedorFormularioModal');
    // Selecciona el campo de hora de inicio del formulario
    const formHoraInicio=document.querySelector('#hora_inicio');
    // Selecciona el campo de hora de finalización del formulario
    const formHoraFinalizacion=document.querySelector('#hora_finalizacion');
    // Selecciona el formulario principal de la vista
    const formulario=document.querySelector('form');
    // Selecciona el campo oculto donde se almacena el id de la consola seleccionada
    const campoIdConsola=document.querySelector('#id_consola');
    // Selecciona el botón para cancelar la creación de la reserva
    const botonCancel = document.querySelector('.boton.cancelar');
    // Selecciona el campo de documento del usuario
    const campoDocumento = document.querySelector('#documento');

    // Realiza una petición GET para obtener todas las consolas disponibles
    const consolas=await get('consolas');

    // Carga las tarjetas de consolas en el contenedor correspondiente
    cargarCardsConsolasReservar(consolas,contenedor);

    /**
     * Muestra el formulario modal para crear una nueva reserva.
     * @param {Object} info - Información del rango de fechas seleccionado en el calendario.
     */
    const mostrarFomrularioNuevaReserva=(info)=>{
        // Muestra el formulario agregando la clase 'displayFlex'
        contenedorformularioNuevaReserva.classList.add('displayFlex');
        // Asigna la hora de inicio formateada al campo correspondiente
        formHoraInicio.value=formatearFecha(info.startStr);
        // Asigna la hora de finalización formateada al campo correspondiente
        formHoraFinalizacion.value=formatearFecha(info.endStr);
    }

    /**
     * Cierra el formulario modal de nueva reserva.
     */
    const cerrarFormularioNuevaReserva=()=>{
        // Elimina la clase 'displayFlex' para ocultar el formulario
        contenedorformularioNuevaReserva.classList.remove('displayFlex')
    }

    /**
     * Cierra el calendario y el fondo oscuro.
     */
    const cerrarCalencuario=()=>{
        // Elimina la clase 'displayBlock' para ocultar el calendario
        calendariOculto.classList.remove('displayBlock');
        // Elimina la clase 'displayBlock' para ocultar el fondo oscuro
        fondoOscuro.classList.remove('displayBlock');
    }

    /**
     * Abre el calendario para la consola seleccionada y muestra las reservas existentes.
     * @param {number} id_consola - ID de la consola seleccionada.
     */
    const abrirCalendario=async(id_consola)=>{

        // Realiza una petición GET para obtener las reservas de la consola seleccionada
        const reservas=await get(`reservas/consola/${id_consola}`);

        // Inicializa el arreglo de eventos para el calendario
        let eventos=[];

        // Si existen reservas, se mapean a eventos para el calendario
        if(reservas.length>0){
            eventos = reservas.map(reserva => ({
                title: `Reservado`, 
                start: reserva.hora_inicio,
                end: reserva.hora_finalizacion,
                color: '#4DD42E' 
            }));
        }

        // Muestra el calendario y el fondo oscuro agregando la clase 'displayBlock'
        calendariOculto.classList.add('displayBlock');
        fondoOscuro.classList.add('displayBlock')

        // Selecciona el contenedor donde se renderizará el calendario
        const contenedor=document.querySelector('#calendarioReserva');
        // Limpia el contenido previo del calendario
        contenedor.innerHTML="";

        // Espera 50ms antes de renderizar el calendario para asegurar que el DOM esté listo
        setTimeout(() => {
            // Crea una nueva instancia de FullCalendar
            const calendar = new FullCalendar.Calendar(contenedor, {
                // Vista inicial: semana con bloques de tiempo
                initialView: 'timeGridWeek',
                // Idioma español
                locale: 'es',
                // Permite seleccionar rangos de tiempo
                selectable: true,
                // Configuración de la barra de herramientas del calendario
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                },
                // No mostrar opción de "todo el día"
                allDaySlot: false,
                // Horario mínimo: 8 AM
                slotMinTime: '08:00:00',
                // Horario máximo: 10 PM
                slotMaxTime: '22:00:00',
                // Duración de cada bloque: 30 minutos
                slotDuration: '00:30:00',
                // Formato de las etiquetas de hora
                slotLabelFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                },
                // Rango válido: solo fechas a partir de hoy
                validRange: {
                    start: new Date()
                },
                // Eventos a mostrar en el calendario
                events:eventos,
                // No permitir solapamiento de selecciones
                selectOverlap: false,
                // Evento al seleccionar un rango de tiempo en el calendario
                select:async (info)=>{
                    // Obtiene la fecha y hora actual
                    const horaActual=new Date();
                    // Obtiene la hora de inicio seleccionada
                    const horaInicio=new Date(info.startStr)
                    // Si la hora seleccionada es anterior a la actual, muestra error
                    if(horaActual>horaInicio){
                        error('No se pude reservar en una fecha anterior a la actual');
                    }else{
                        // Si el usuario es administrador (rol 1), muestra el formulario de reserva
                        if(usuario['id_rol']==1){
                            mostrarFomrularioNuevaReserva(info);
                        }
                        // Si es usuario normal, muestra confirmación y crea la reserva directamente
                        else{
                            // Formatea las horas seleccionadas
                            const horaI=formatearFecha(info.startStr);
                            const horaF=formatearFecha(info.endStr);

                            // Muestra confirmación al usuario con el rango seleccionado
                            const confirmacion=await confirmar('reservas en este horario',`${horaI} - ${horaF}`);

                            // Si el usuario confirma la reserva
                            if(confirmacion.isConfirmed){
                                // Crea un objeto info para la reserva
                                let info={};
                                // Asigna el id de la consola seleccionada
                                info['id_consola']=Number(campoIdConsola.value);

                                // Obtiene fechas para determinar el estado de la reserva
                                const horaActual=new Date();
                                const horaInicio=new Date(horaI);
                                const horaFin=new Date(horaF);

                                // Determina el estado de la reserva según la fecha actual
                                if(horaActual<horaInicio)info['id_estado_reserva']=1
                                else if(horaActual>=horaInicio && horaActual<horaFin)info['id_estado_reserva']=2
                                else if(horaActual>=horaFin)info['id_estado_reserva']=3;

                                // Asigna el id del usuario actual
                                info['id_usuario'] = usuario.id;

                                // Asigna las horas en formato ISO
                                info['hora_inicio']=aFormatoISO(horaI); 
                                info['hora_finalizacion']=aFormatoISO(horaF);

                                // Realiza la petición POST para crear la reserva
                                const respuesta = await post('reservas', info);
                                // Obtiene la respuesta en formato JSON
                                const res=await respuesta.json();

                                // Si la reserva se creó correctamente
                                if(respuesta.ok){
                                    // Muestra mensaje de éxito
                                    success(res.mensaje);
                                    // Cierra el calendario
                                    cerrarCalencuario();
                                    // Vuelve a abrir el calendario para refrescar eventos
                                    abrirCalendario(info['id_consola'])
                                }
                                else error(res.error);
                            }
                        }
                    }
                }
            });
            // Renderiza el calendario en el contenedor
            calendar.render();
        }, 50);
    }

    

    // Evento global para manejar clicks en la ventana
    window.addEventListener('click',(event)=>{
        // Obtiene la clase del elemento clickeado
        const clase=event.target.getAttribute('class');
        // Si se hace clic en el botón de seleccionar consola
        if(clase=='boton boton--textoCard'){
            // Obtiene el id de la consola seleccionada
            const id_consola=event.target.getAttribute('id');
            // Asigna el id al campo oculto
            campoIdConsola.value=id_consola;
            // Abre el calendario para esa consola
            abrirCalendario(id_consola);
        }
        // Si se hace clic en el botón para cerrar el calendario
        else if(clase=='botonCerrarCalendario')cerrarCalencuario();
    })

    // Cuenta la cantidad de campos que tiene el formulario para validación
    const cantCamporFormulario=contarCamposFormulario(formulario);

    /**
     * Convierte una fecha en formato "YYYY-MM-DD HH:mm" a formato ISO "YYYY-MM-DDTHH:mm"
     * @param {string} fecha - Fecha a convertir
     * @returns {string} Fecha en formato ISO
     */
    function aFormatoISO(fecha) {
        // Reemplaza el espacio por una T para cumplir el formato ISO
        return fecha.replace(" ", "T");
    }

    // Evento submit del formulario para crear una nueva reserva
    formulario.addEventListener('submit',async(event)=>{
        // Valida los campos del formulario y obtiene un objeto info
        const info=validar(event);

        // Si la cantidad de campos validados es igual a la cantidad de campos del formulario
        if(Object.keys(info).length==cantCamporFormulario){
            // Busca el usuario por documento
            const usuario=await get(`usuarios/documento/${info.documento}`)
            // Si el usuario existe
            if(Object.keys(usuario).length>1){  
                // Obtiene la fecha y hora actual, inicio y fin de la reserva
                const horaActual=new Date();
                const horaInicio=new Date(info.hora_inicio);
                const horaFin=new Date(info.hora_finalizacion);

                // Determina el estado de la reserva según la fecha actual
                if(horaActual<horaInicio)info['id_estado_reserva']=1
                else if(horaActual>=horaInicio && horaActual<horaFin)info['id_estado_reserva']=2
                else if(horaActual>=horaFin)info['id_estado_reserva']=3

                // Asigna el id del usuario encontrado
                info['id_usuario'] = usuario.id;
                // Elimina el campo documento del objeto info
                delete info.documento;

                // Convierte el id de la consola a número
                info['id_consola'] = Number(info['id_consola'])
                // Convierte las fechas a formato ISO
                info['hora_inicio']=aFormatoISO(info['hora_inicio']); 
                info['hora_finalizacion']=aFormatoISO(info['hora_finalizacion']); 

                // Realiza la petición POST para crear la reserva
                const respuesta = await post('reservas', info);
                // Obtiene la respuesta en formato JSON
                const res=await respuesta.json();
                // Si la reserva se creó correctamente
                if (respuesta.ok){
                    // Limpia el campo documento
                    campoDocumento.value="";
                    // Cierra el formulario modal
                    cerrarFormularioNuevaReserva();
                    // Muestra mensaje de éxito
                    success(res.mensaje)
                    // Cierra el calendario
                    cerrarCalencuario();
                    // Vuelve a abrir el calendario para refrescar eventos
                    abrirCalendario(info['id_consola'])
                } 
                else{
                    // Si hubo error, muestra mensaje y limpia campo documento
                    await error(res.error);  
                    campoDocumento.value="";
                    cerrarFormularioNuevaReserva()
                } 
            }else{
                // Si el usuario no existe, muestra mensaje de error
                error('Usuario no encontrado')
            }
        }
    });

    // Validaciones y eventos para el campo documento
    campoDocumento.addEventListener('keydown',validarNumeros)
    campoDocumento.addEventListener('keydown', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    campoDocumento.addEventListener('blur', (event) => { if (validarMinimo(event.target)) limpiar(event.target) });
    campoDocumento.addEventListener('keydown',validarMaximo)

    // Evento para cancelar la creación de la reserva y cerrar el formulario
    botonCancel.addEventListener('click',()=>{
        contenedorformularioNuevaReserva.classList.remove('displayFlex');
    })
}