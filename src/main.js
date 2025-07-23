import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { encontrarRuta, router } from './Router/router.js';
import { routes } from './Router/routes.js';

const app=document.querySelector('.app');
const grid_container=document.querySelector('.grid-container');
const header = document.querySelector(".encabezado");
const sidebar = document.querySelector(".sidebar");

const cargarLayoutPrivado = async () => {

  if (!header.innerHTML.trim()) {
    const response = await fetch('./src/components/header.html');
    const headerHTML=await response.text();
    header.innerHTML = headerHTML;
    const namePerfil=document.querySelector('.encabezadoPerfil__nombre');
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    namePerfil.textContent=usuarioGuardado.nombre;
  }

  if (!sidebar.innerHTML.trim()) {
    const response = await fetch('./src/components/sidebar.html');
    const sidebarHTML=await response.text();
    sidebar.innerHTML = sidebarHTML;
  }

  const botonUsusariosSidebar=document.querySelector('.sidebar__boton.botonSidebar.usarios');
  const usuario=JSON.parse(localStorage.getItem('usuario'));

  if(usuario['id_rol']!=1)botonUsusariosSidebar.classList.add('displayNone');
  else botonUsusariosSidebar.classList.remove('displayNone');

};

const render=()=> {
  const hash = location.hash.slice(2); // sin "#/"
  const segmentos = hash.split('/').filter(Boolean);

  if(hash==""){
    router(app);
    return
  }

  const resultadoRuta = encontrarRuta(routes, segmentos);

  if (!resultadoRuta) {
    grid_container.classList.remove('layout');
    header.innerHTML = "";
    sidebar.innerHTML = "";
    app.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  const [ruta] = resultadoRuta;

  if (ruta.private && localStorage.getItem('token')) {
    grid_container.classList.add('layout'); // sidebar + header
    cargarLayoutPrivado();
    app.classList.remove('app-full')

  } else {
    grid_container.classList.remove('layout'); // pantalla completa
    app.classList.add('app-full')
    header.innerHTML = "";
    sidebar.innerHTML = "";
  }

  router(app); // carga la vista correspondiente
}

window.addEventListener('hashchange',render)
window.addEventListener('DOMContentLoaded',render)

