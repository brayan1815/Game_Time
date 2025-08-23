import { error, success } from "../helpers/alertas.js";
import { get, post, postSinToken } from "../helpers/api.js";
import {
  validar
} from "./validaciones.js";

export const crearTabla=(encabezados,contenedor)=>{
    const tabla=document.createElement('table');
    tabla.classList.add('tabla');

    const encabezado=document.createElement('thead');
    const cuerpo=document.createElement('tbody');
    cuerpo.classList.add('tabla__cuerpo')
    encabezado.classList.add('tabla__encabezado');

    const fila=document.createElement('tr');

    encabezados.forEach(item => {
        const campo=document.createElement('th');
        campo.textContent=item;
        fila.append(campo);
    });
    encabezado.append(fila)
    tabla.append(encabezado,cuerpo)
    
    contenedor.append(tabla)
}

export const crearFila=(info,id,contenedor,hash,rojo=false,botones=true)=>{
    const fila=document.createElement('tr');
    fila.classList.add('tabla__fila');
    fila.setAttribute('id',`fila_${id}`);

    info.forEach(item => {
        const campo=document.createElement('td');
        if(rojo){
          campo.classList.add('tabla__campo','tabla__campo--bordeRojo');
        }
        else{
          campo.classList.add('tabla__campo','tabla__campo--bordeVerde');
        }
        campo.textContent=item;
        fila.append(campo);
    });

    const campo=document.createElement('td');
    if(rojo)campo.classList.add('tabla__campo','tabla__campo--bordeRojo');
    else{
      campo.classList.add('tabla__campo','tabla__campo--bordeVerde');
    } 
    
    const contenedorBotones=document.createElement('div');
    contenedorBotones.classList.add('contenedorBotonesTabla');

    if(!rojo){
      const botonEliminar=document.createElement('button');
      botonEliminar.classList.add('boton','boton--tabla','eliminar')
  
      const iconoEliminar=document.createElement('i');
      iconoEliminar.classList.add('bi','bi-trash-fill');
  
      botonEliminar.append(iconoEliminar);
      botonEliminar.setAttribute('id',id)

      contenedorBotones.append(botonEliminar);
    }


    const botonEditar=document.createElement('a');
    botonEditar.classList.add('boton','boton--tabla','editar')
    botonEditar.setAttribute('id',id);
    botonEditar.setAttribute('href',`#/${hash}/id=${id}`)

    const iconoEditar=document.createElement('i');
    iconoEditar.classList.add('bi', 'bi-pencil-square');

    botonEditar.append(iconoEditar);
    contenedorBotones.append(botonEditar);

    campo.append(contenedorBotones);
    if(botones){
      fila.append(campo)
    }

    contenedor.append(fila);
}

export const crearFilaConsumos=(info,id,contenedor,reserva)=>{
  const fila=document.createElement('tr');
  fila.classList.add('tabla__fila');
  fila.setAttribute('id',`consumo_${id}`)
  const usu=JSON.parse(localStorage.getItem('usuario'));

    info.forEach(item => {
        const campo=document.createElement('td');
        campo.classList.add('tabla__campo','tabla__campo--bordeVerde');
        campo.textContent=item;
        fila.append(campo);
    });

    console.log(reserva.id_estado_reserva, usu.id_rol);
    

    if(reserva.id_estado_reserva!=4 && usu.id_rol!=2){
      const campo=document.createElement('td');
      campo.classList.add('tabla__campo','tabla__campo--bordeVerde');
  
      const contenedorBotones=document.createElement('div');
      contenedorBotones.classList.add('contenedorBotonesTabla');
  
      const botonEliminar=document.createElement('button');
      botonEliminar.classList.add('boton','boton--tabla','eliminar')
  
      const iconoEliminar=document.createElement('i');
      iconoEliminar.classList.add('bi','bi-trash-fill');
  
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
  
      const botonEditar=document.createElement('button');
      botonEditar.classList.add('boton','boton--tabla','editar')
      botonEditar.setAttribute('id',id);
  
      const iconoEditar=document.createElement('i');
      iconoEditar.classList.add('bi', 'bi-pencil-square');
      botonEliminar.setAttribute('id',id)
  
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
  
      campo.append(contenedorBotones);
      fila.append(campo)
    }


    contenedor.append(fila);
}

export function quitarFOmatoIso(fecha) {
  return fecha.replace("T", " ");
}

export const crearFilaTablaReservas=async(info,id,contenedor,historial=false)=>{
  const fila=document.createElement('tr');

  fila.setAttribute('id',`reserva_${id}`);
  fila.classList.add('tabla__fila')

  if(info.idEstadoReserva==1)fila.classList.add('tabla__fila--blanco');
  else if(info.idEstadoReserva==2)fila.classList.add('tabla__fila--verde');
  else if(info.idEstadoReserva==3)fila.classList.add('tabla__fila--rojo');

  const campoDocumento=document.createElement('td');
  const campoUsuario=document.createElement('td');
  const HoraInicio=document.createElement('td');
  const HoraFin=document.createElement('td');
  const Consola=document.createElement('td');
  const Boton=document.createElement('td');
  
  campoDocumento.classList.add('tabla__campo');
  campoUsuario.classList.add('tabla__campo');
  HoraInicio.classList.add('tabla__campo');
  HoraFin.classList.add('tabla__campo');
  Consola.classList.add('tabla__campo');
  Boton.classList.add('tabla__campo');
  
  


  campoDocumento.textContent=info.documentoUsuario;
  campoUsuario.textContent=info.nombreUsuario;
  HoraInicio.textContent=quitarFOmatoIso( String(info.horaInicio));
  HoraFin.textContent=quitarFOmatoIso(String(info.horaFinalizacion));
  Consola.textContent=info.nombreConsola;

  const bot=document.createElement('a');
  if(historial){
    bot.setAttribute('href',`#/Historial/Info/id=${id}`)
  }else{
    bot.setAttribute('href',`#/Reservas/Consumos/id=${id}`)
  }
  bot.classList.add('boton','boton--tabla','Info');
  bot.setAttribute('id',id)
  const iconBot=document.createElement('i');
  iconBot.classList.add('bi','bi-info-circle');
  bot.append(iconBot);
  


  Boton.append(bot);

  fila.append(campoDocumento,campoUsuario,HoraInicio,HoraFin,Consola,Boton);

  if(historial==false){
    
    const BotonCan=document.createElement('td');
    BotonCan.classList.add('tabla__campo');

    const btnCan=document.createElement('button');
    btnCan.classList.add('boton','boton--tabla','cancel');
    btnCan.setAttribute('id',id);
    const ic=document.createElement('i');
    ic.classList.add('bi','bi-ban');
    btnCan.append(ic)
    
    fila.classList.add('borde-verde')

    BotonCan.append(btnCan);
    fila.append(BotonCan)
  }
  
  contenedor.append(fila)
  if(historial){
    const campos=document.querySelectorAll('.tabla__campo');

    [...campos].forEach(campo => {
      campo.classList.add('.tabla__campo','tabla__campo--bordeVerde')
    });
  }
}

// ...función movida a validaciones.js...


// ...función movida a validaciones.js...

// ...función movida a validaciones.js...

// ...función movida a validaciones.js...

// ...función movida a validaciones.js...

//   validarMaximo = (event) => {
//   // ...función movida a validaciones.js...
// }

// ...función movida a validaciones.js...

// ...función movida a validaciones.js...


export const contarCamposFormulario=(formulario)=>{
  const campos=[...formulario].filter((campo)=>campo.hasAttribute('required'));
  return campos.length;
}

export const crearCardsProductos=async (productos,contenedor)=>{

  for (const producto of productos) {
    if(producto.id_estado_producto==3)continue
    const imagen= await get(`imagenes/${producto.id_imagen}`);
    const card=document.createElement('div');
    card.setAttribute('id','card_'+producto.id)
    card.classList.add('card');
    if(producto.id_estado_producto==2)card.classList.add('card--bordeRojo')
  
    const imagenCard=document.createElement('img');
    imagenCard.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    imagenCard.classList.add('card__imagen');
    card.append(imagenCard)

    const lineaSeparadora=document.createElement('hr');
    lineaSeparadora.classList.add('card__linea');
    if(producto.id_estado_producto==2)lineaSeparadora.classList.add('card__linea--roja')
    card.append(lineaSeparadora);

    const cardNombre=document.createElement('h3');
    cardNombre.classList.add('card__nombre');
    cardNombre.textContent=producto.nombre;
    card.append(cardNombre);

    const cardDescripcion=document.createElement('p');
    cardDescripcion.classList.add('card__descripcion');
    cardDescripcion.textContent=producto.descripcion;
    card.append(cardDescripcion);

    const cardPrecio=document.createElement('h3');
    cardPrecio.classList.add('card__precio');
    cardPrecio.textContent=`$${producto.precio}`;
    card.append(cardPrecio);

    const cantRest=document.createElement('h3');
    cantRest.classList.add('card__cantidades');
    cantRest.textContent=`Cantidades restantes: ${producto.cantidades_disponibles}`;
    card.append(cantRest);

    const usuario=JSON.parse(localStorage.getItem('usuario'));
    
    const contenedorBotones=document.createElement('div');
    contenedorBotones.classList.add('card__botones');

    if(tienePermiso('productos.editar')){

      const botonEditar=document.createElement('a');
      botonEditar.setAttribute('id',producto.id);
      botonEditar.setAttribute('href',`#/Productos/Editar/id=${producto.id}`)
      botonEditar.classList.add('boton','boton--cardIcono','editar');
  
      const iconoEditar=document.createElement('i');
      iconoEditar.classList.add('bi','bi-pencil-square');
      // iconoEditar.classList.add('bi','bi-pencil-square')
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
    }

    if(tienePermiso('productos.eliminar')){
      const botonEliminar=document.createElement('button');
      botonEliminar.setAttribute('id',producto.id)
      botonEliminar.classList.add('boton','boton--cardIcono','eliminar');
  
      const iconoEliminar=document.createElement('i');
      iconoEliminar.classList.add('bi','bi-trash-fill');
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
    }

    card.append(contenedorBotones);
    contenedor.append(card);
  }
}

export const cargarCardsConsolas = async (consolas, contenedor) => {
  contenedor.innerHTML="";
  for (const consola of consolas) {
    
    
    
    const card = document.createElement('div');
    if(consola.idEstado==2){
      card.classList.add('card','card--bordeRojo','card--horizontal');
    }else{
      card.classList.add('card', 'card--horizontal');
    }
    card.setAttribute('id',`consola_${consola.id}`)
  
    const imagen = await get(`imagenes/${consola.idImagen}`);
  
    const img_card = document.createElement('img');
    img_card.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    img_card.classList.add('card__imagen');
    card.append(img_card)

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo');

    const cardName = document.createElement('h3');
    cardName.classList.add('card__nombre');
    cardName.textContent = consola.nombre;
    cardInfo.append(cardName);

    const cardDescripcion = document.createElement('p');
    cardDescripcion.classList.add('card__descripcion', 'card__descripcion--consola');
    cardDescripcion.textContent = consola.descripcion;
    cardInfo.append(cardDescripcion)

    const cardPrecio = document.createElement('h3');
    cardPrecio.classList.add('card__precio');
    cardPrecio.textContent = `$${consola.precioHora}`;
    cardInfo.append(cardPrecio);

    const usuario=JSON.parse(localStorage.getItem('usuario'));


    const contenedorBotones=document.createElement('div');
    contenedorBotones.classList.add('card__botones');

    if(tienePermiso('consolas.editar')){
  
      const botonEditar=document.createElement('a');
      botonEditar.setAttribute('id',consola.id);
      botonEditar.setAttribute('href',`#/Consolas/Editar/id=${consola.id}`)
      botonEditar.classList.add('boton','boton--cardIcono','editar');
  
      const iconoEditar=document.createElement('i');
      iconoEditar.classList.add('bi','bi-pencil-square');
      // iconoEditar.classList.add('bi','bi-pencil-square')
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
      
      // if(consola.idEstado!=2){
      // }
    }
    if(tienePermiso('consolas.eliminar') && consola.idEstado!=2){
      const botonEliminar=document.createElement('button');
      botonEliminar.setAttribute('id',consola.id)
      botonEliminar.classList.add('boton','boton--cardIcono','eliminar');
  
      const iconoEliminar=document.createElement('i');
      iconoEliminar.classList.add('bi','bi-trash-fill');
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
    }
    
    cardInfo.append(contenedorBotones);
    card.append(cardInfo)
    contenedor.append(card)
  }

}

export const cargarCardsConsolasReservar=async(consolas,contenedor)=>{
  for (const consola of consolas) {

    if(consola.id_estado==2)continue
    
    
    const card = document.createElement('div');
    card.classList.add('card', 'card--horizontal');
  
    const imagen = await get(`imagenes/${consola.id_imagen}`);
  
    const img_card = document.createElement('img');
    img_card.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    img_card.classList.add('card__imagen');
    card.append(img_card)

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo');

    const cardName = document.createElement('h3');
    cardName.classList.add('card__nombre');
    cardName.textContent = consola.nombre;
    cardInfo.append(cardName);

    const cardDescripcion = document.createElement('p');
    cardDescripcion.classList.add('card__descripcion', 'card__descripcion--consola');
    cardDescripcion.textContent = consola.descripcion;
    cardInfo.append(cardDescripcion)

    const tipo=await get(`tipos/${consola.id_tipo}`)

    const cardPrecio = document.createElement('h3');
    cardPrecio.classList.add('card__precio');
    cardPrecio.textContent = `$${tipo.precio_hora}`;
    cardInfo.append(cardPrecio);

    const contenedorBotones=document.createElement('div');
    contenedorBotones.classList.add('card__botones');

    const botonReservar=document.createElement('button');
    botonReservar.textContent="Reservar";
    botonReservar.id=consola.id;
    botonReservar.classList.add('boton','boton--textoCard')
    contenedorBotones.append(botonReservar)

    cardInfo.append(contenedorBotones);
    card.append(cardInfo)
    contenedor.append(card)
  }
}

export const formatearFecha=(fechaIso)=> {
  const fecha = new Date(fechaIso);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const segundos = String(fecha.getSeconds()).padStart(2, '0');

  return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

export const cargarSelectTiposConsols=async(select)=>{
  
  const tipos=await get('tipos');
  
  tipos.forEach(tipo => {
    if(tipo.id_estado_tipo!=2){
      const option=document.createElement('option');
      option.setAttribute('value',tipo.id);
      option.textContent=tipo.tipo;
      select.append(option);
    }
  });
}

export const cargarSelectEstadoConsola=async(select)=>{
  const estados=await get('estadosConsolas');
  
  
  estados.forEach(estado => {
    const option=document.createElement('option');
    option.setAttribute('value',estado.id)
    option.textContent=estado.estado;
    select.append(option)
  });
}

export const cargarSelecrProductos=async(select)=>{

  const productos=await get('productos');

  productos.forEach(producto => {
    if(producto.id_estado_producto!=2 && producto.id_estado_producto!=3){
      const option=document.createElement('option');
      option.setAttribute('value',producto.id);
      option.textContent=producto.nombre;
      select.append(option);
    }
  });
}



export const validarIngreso = async (event) => {
  const datos = await validar(event);
  if (Object.keys(datos).length == 2) {

    const respuesta=await postSinToken('usuarios/login',datos)
    if(respuesta.ok){
      const resultado=await respuesta.json();
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('refreshToken',resultado.refreshToken)
      localStorage.setItem('permisos',resultado.permisos)
      
      
      const usuario=await get(`usuarios/correo/${datos.correo}`);
      localStorage.setItem('usuario',JSON.stringify(usuario));
      await success(`Bienvenido ${usuario.nombre}`)
      
      window.location.href=`#/Reservas`     
    }
    else{
      const res=await respuesta.json();
      error(res.error)
    }
  }
}

export const convertirPermisosArray=(permisos)=>{
  permisos=permisos.split("");
  let aux=""; 
  for (let n = 0; n < permisos.length; n++) {
    if(n==0 || n==permisos.length-1 || permisos[n]==" ")continue
    aux+=permisos[n];    
  }
  
  permisos=aux.split(",");
  return permisos;
}

export const cargarSelectRoles = async(select) => {
  const roles = await get('roles');

  roles.forEach(rol => {
    const valor = document.createElement('option');
    valor.setAttribute('value', rol.id)
    valor.textContent = rol.rol;
    select.append(valor);
  });
}

export const tienePermiso = (permiso) => {
  const permisos = convertirPermisosArray(localStorage.getItem('permisos'));
  const existe = permisos.some( perm => perm == permiso);
  return existe
}

export const cargarEstadosUsuarios=async(select)=>{
  const estados=await get('estadosUsuarios');

  estados.forEach(estado => {
    const value=document.createElement('option');
    value.setAttribute('value',estado.id);
    value.textContent=estado.estado;
    select.append(value)
  });
}