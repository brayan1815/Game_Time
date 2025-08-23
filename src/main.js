// Importa los estilos principales de la aplicación
import './style.css'
// Importa funciones para encontrar rutas y el router principal
import { encontrarRuta, router } from './Router/router.js';
// Importa el arreglo de rutas de la aplicación
import { routes } from './Router/routes.js';
// Importa función para verificar permisos del usuario
import { tienePermiso } from './Modules/modules.js';

// Selecciona el contenedor principal de la aplicación
const app=document.querySelector('.app');
// Selecciona el contenedor de la cuadrícula principal
const grid_container=document.querySelector('.grid-container');
// Selecciona el encabezado de la aplicación
const header = document.querySelector(".encabezado");
// Selecciona la barra lateral (sidebar)
const sidebar = document.querySelector(".sidebar");
// Selecciona el checkbox para mostrar/ocultar la sidebar en responsive
let cheqSidebar=document.querySelector(".checSidebar");

/**
 * Carga el layout privado (header y sidebar) solo si el usuario está autenticado.
 * Inserta el HTML correspondiente y personaliza los elementos según el usuario y sus permisos.
 */
const cargarLayoutPrivado = async () => {
  // Si el header está vacío, lo carga desde el archivo HTML
  if (!header.innerHTML.trim()) {
    const response = await fetch('./src/components/header.html');
    const headerHTML=await response.text();
    header.innerHTML = headerHTML;
    // Personaliza el nombre del usuario en el header
    const namePerfil=document.querySelector('.encabezadoPerfil__nombre');
    const nameBtnMenu=document.querySelector('.nameMenuSalir')
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    namePerfil.textContent=usuarioGuardado.nombre;
    nameBtnMenu.textContent=usuarioGuardado.nombre;
  }

  // Si la sidebar está vacía, la carga desde el archivo HTML
  if (!sidebar.innerHTML.trim()) {
    const response = await fetch('./src/components/sidebar.html');
    const sidebarHTML=await response.text();
    sidebar.innerHTML = sidebarHTML;
  }

  // Selecciona los botones de la sidebar que dependen de permisos
  const botonUsusariosSidebar=document.querySelector('.sidebar__boton.botonSidebar.usarios');
  const btnHistorialSidebar=document.querySelector('.sidebar__boton.botonSidebar.historial');


  // Muestra u oculta el botón de historial según permisos
  if(!tienePermiso('historial.index'))btnHistorialSidebar.classList.add('displayNone');
  else btnHistorialSidebar.classList.remove('displayNone');
  // Muestra u oculta el botón de usuarios según permisos
  if(!tienePermiso('usuarios.index'))botonUsusariosSidebar.classList.add('displayNone');
  else botonUsusariosSidebar.classList.remove('displayNone');
};

/**
 * Renderiza la vista correspondiente según la ruta actual.
 * Gestiona el layout, la autenticación y la carga de componentes.
 */
const render=()=> {
  // Obtiene el hash de la URL sin el "#/"
  const hash = location.hash.slice(2);
  // Divide el hash en segmentos para encontrar la ruta
  const segmentos = hash.split('/').filter(Boolean);

  // Si no hay hash, carga la vista principal
  if(hash==""){
    router(app);
    return
  }

  // Busca la ruta correspondiente en el arreglo de rutas
  const resultadoRuta = encontrarRuta(routes, segmentos);

  // Si la ruta no existe, muestra mensaje de error y limpia el layout
  if (!resultadoRuta) {
    grid_container.classList.remove('layout');
    header.innerHTML = "";
    sidebar.innerHTML = "";
    app.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  // Extrae la ruta encontrada
  const [ruta] = resultadoRuta;

  // Si la ruta es privada y el usuario tiene token, carga el layout privado
  if (ruta.private && localStorage.getItem('token')) {
    grid_container.classList.add('layout'); // sidebar + header
    cargarLayoutPrivado();
    app.classList.remove('app-full')
  } else {
    // Si la ruta es pública, muestra pantalla completa y limpia header/sidebar
    grid_container.classList.remove('layout');
    app.classList.add('app-full')
    header.innerHTML = "";
    sidebar.innerHTML = "";
  }

  // Llama al router para cargar la vista correspondiente
  router(app);
}


// Evento para renderizar la vista cuando cambia el hash de la URL
window.addEventListener('hashchange',render)
// Evento para renderizar la vista cuando se carga el DOM
await window.addEventListener('DOMContentLoaded',render)
// Evento global para manejar clicks en la ventana (logout y sidebar responsive)
window.addEventListener('click',(event)=>{
  // Obtiene la clase del elemento clickeado
  const clase=event.target.getAttribute('class');
  // Si se hace clic en el botón de salir (logout)
  if(clase=="btnSalir"){
    // Elimina los datos de sesión del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("permisos");
    // Oculta la sidebar
    sidebar.classList.remove('left-0')
    // Redirige al login
    window.location.href="#/Login"
  }

  // Si la pantalla es pequeña y se hace clic en el texto de la sidebar, oculta la sidebar
  if(window.innerWidth<=900){
    const elemento=event.target;
    if(elemento.getAttribute("class")=="botonSidebar__texto"){
      cheqSidebar.checked=false;
      sidebar.classList.remove('left-0')
    }
  }
})

// Evento para mostrar/ocultar la sidebar en responsive al cambiar el checkbox
cheqSidebar.addEventListener('change',(event)=>{
  if(event.target.checked){
    sidebar.classList.add('left-0')
  }else{
    sidebar.classList.remove('left-0')
  }
});


