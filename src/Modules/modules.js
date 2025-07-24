import { error, success } from "../helpers/alertas.js";
import { get, post } from "../helpers/api.js";

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

export const crearFila=(info,id,contenedor,hash)=>{
    const fila=document.createElement('tr');
    fila.classList.add('tabla__fila');

    info.forEach(item => {
        const campo=document.createElement('td');
        campo.classList.add('tabla__campo','tabla__campo--bordeVerde');
        campo.textContent=item;
        fila.append(campo);
    });

    const campo=document.createElement('td');
    campo.classList.add('tabla__campo','tabla__campo--bordeVerde');

    const contenedorBotones=document.createElement('div');
    contenedorBotones.classList.add('contenedorBotonesTabla');

    const botonEliminar=document.createElement('button');
    botonEliminar.classList.add('registro__boton','registro__boton--eliminar')

    const iconoEliminar=document.createElement('i');
    iconoEliminar.classList.add('bi','bi-trash-fill');

    botonEliminar.append(iconoEliminar);
    contenedorBotones.append(botonEliminar);

    const botonEditar=document.createElement('a');
    botonEditar.classList.add('registro__boton','registro__boton--editar')
    botonEditar.setAttribute('id',id);
    botonEditar.setAttribute('href',`#/${hash}/id=${id}`)

    const iconoEditar=document.createElement('i');
    iconoEditar.classList.add('bi', 'bi-pencil-square');
    botonEliminar.setAttribute('id',id)

    botonEditar.append(iconoEditar);
    contenedorBotones.append(botonEditar);

    campo.append(contenedorBotones);
    fila.append(campo)

    contenedor.append(fila);
}

export const crearFilaConsumos=(info,id,contenedor)=>{
  const fila=document.createElement('tr');
    fila.classList.add('tabla__fila');

    info.forEach(item => {
        const campo=document.createElement('td');
        campo.classList.add('tabla__campo','tabla__campo--bordeVerde');
        campo.textContent=item;
        fila.append(campo);
    });

    const campo=document.createElement('td');
    campo.classList.add('tabla__campo','tabla__campo--bordeVerde');

    const contenedorBotones=document.createElement('div');
    contenedorBotones.classList.add('contenedorBotonesTabla');

    const botonEliminar=document.createElement('button');
    botonEliminar.classList.add('registro__boton','registro__boton--eliminar')

    const iconoEliminar=document.createElement('i');
    iconoEliminar.classList.add('bi','bi-trash-fill');

    botonEliminar.append(iconoEliminar);
    contenedorBotones.append(botonEliminar);

    const botonEditar=document.createElement('button');
    botonEditar.classList.add('registro__boton','registro__boton--editar')
    botonEditar.setAttribute('id',id);

    const iconoEditar=document.createElement('i');
    iconoEditar.classList.add('bi', 'bi-pencil-square');
    botonEliminar.setAttribute('id',id)

    botonEditar.append(iconoEditar);
    contenedorBotones.append(botonEditar);

    campo.append(contenedorBotones);
    fila.append(campo)

    contenedor.append(fila);
}

export function quitarFOmatoIso(fecha) {
  return fecha.replace("T", " ");
}

export const crearFilaTablaReservas=async(info,id,contenedor)=>{
  const fila=document.createElement('tr');

  fila.setAttribute('id',id);

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
  const BotonCan=document.createElement('td');

  campoDocumento.classList.add('tabla__campo');
  campoUsuario.classList.add('tabla__campo');
  HoraInicio.classList.add('tabla__campo');
  HoraFin.classList.add('tabla__campo');
  Consola.classList.add('tabla__campo');
  Boton.classList.add('tabla__campo');
  BotonCan.classList.add('tabla__campo');



  campoDocumento.textContent=info.documentoUsuario;
  campoUsuario.textContent=info.nombreUsuario;
  HoraInicio.textContent=quitarFOmatoIso( String(info.horaInicio));
  HoraFin.textContent=quitarFOmatoIso(String(info.horaFinalizacion));
  Consola.textContent=info.nombreConsola;

  const bot=document.createElement('a');
  bot.setAttribute('href',`#/Reservas/Consumos/id=${id}`)
  bot.classList.add('registro__boton','Info');
  bot.setAttribute('id',id)
  const iconBot=document.createElement('i');
  iconBot.classList.add('bi','bi-info-circle');
  bot.append(iconBot);

  const btnCan=document.createElement('button');
  btnCan.classList.add('registro__boton','registro__boton--eliminar','cancel');
  btnCan.setAttribute('id',id);
  const ic=document.createElement('i');
  ic.classList.add('bi','bi-ban');
  btnCan.append(ic)

  Boton.append(bot);
  BotonCan.append(btnCan);

  fila.append(campoDocumento,campoUsuario,HoraInicio,HoraFin,Consola,Boton,BotonCan);
  
  contenedor.append(fila)
  
}

export const limpiar=(campo)=>{
  if(campo.nextElementSibling)campo.nextElementSibling.remove();
  campo.classList.remove('border--red');
}


export const validarMinimo = (campo)=> {
  const texto = campo.value;
  let minimo = 0;
  

  if (campo.tagName == "INPUT") {
    minimo = campo.getAttribute('min');
  }
  else if (campo.tagName == 'TEXTAREA') {
    minimo = campo.getAttribute('minlength');
  }
  if (texto.length < minimo) {
    const span = document.createElement('span');
    span.textContent = `El campo ${campo.getAttribute('id')} debe tener minimo ${minimo} caracteres`
    
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', span)
    campo.classList.add('border--red');
    return false;
  } else {
    return true
  }
}

export const validarContrasenia = (campo) => {
  const contrasenia = campo.value;
  const expresion = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
  
  if (!contrasenia.match(expresion)) {
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    let mensaje = document.createElement('span')
    mensaje.textContent = 'la contraseña debe tener minimo una mayuscula, una minuscula, un caracter especial y 8 caracteres';
    campo.insertAdjacentElement('afterend', mensaje)
    campo.classList.add('border--red')
    return false;
  }
  return true;
}

const validarContraseniaUsuario =(userCorreo,userCont,usuarios) => {
  userCorreo=userCorreo.toLowerCase();

  for (let n = 0; n < usuarios.length; n++){ 
    if (usuarios[n].correo == userCorreo && usuarios[n].contrasenia==userCont) return usuarios[n].id;
  }

  return false;
}

export const validarLetras=(event)=>{
  let tecla=event.key;
    const letras=/[a-zñáéíóú\s]/i;
    if(!letras.test(tecla)&& tecla!="Backspace"){
        event.preventDefault();
    }
}

export const validarNumeros=(event)=>{
  let tecla=event.key;
    const numeros=/[0-9]/;
    if(!numeros.test(tecla) && tecla!="Backspace"){
    event.preventDefault();
    return false
  }
  return true
}

export const
  validarMaximo = (event) => {
  const maximo=event.target.getAttribute('max');

  if(event.target.value.length>=maximo && event.key!='Backspace')event.preventDefault();
}

export const validarCorreo=(campo)=>{
  const expresionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(campo.value.match(expresionCorreo)) return true
  else{
    if(campo.nextElementSibling)campo.nextElementSibling.remove();

    const span=document.createElement('span');
    span.textContent="El correo ingresado no es valido";
    campo.insertAdjacentElement('afterend',span);
    campo.classList.add('border--red');

    return false
  }
}

export const validarImagen = (campo, label) => {
  const archivo = campo.files[0]; 

  if (campo.hasAttribute('required')) {
    if (!archivo) {
      const mensaje = document.createElement('span');
      mensaje.textContent = "Debe seleccionar una imagen";

      if (label.nextElementSibling) label.nextElementSibling.remove();
      label.classList.add('border--punteado--red');
      label.insertAdjacentElement('afterend', mensaje);
      return false;
    }
  }

  if (archivo) {
    if (label.nextElementSibling) label.nextElementSibling.remove();
    label.classList.remove('border--punteado--red');

    const mensaje = document.createElement('span');
    mensaje.textContent = archivo.name;
    mensaje.classList.add('span--verde');
    label.insertAdjacentElement('afterend', mensaje);

    return archivo;
  }

  return null;
}


export const contarCamposFormulario=(formulario)=>{
  const campos=[...formulario].filter((campo)=>campo.hasAttribute('required'));
  return campos.length;
}

export const crearCardsProductos=async (productos,contenedor)=>{

  for (const producto of productos) {
    const imagen= await get(`imagenes/${producto.id_imagen}`);
    const card=document.createElement('div');
    card.setAttribute('id',producto.id)
    card.classList.add('card');
  
    const imagenCard=document.createElement('img');
    imagenCard.setAttribute('src', `http://localhost:8080/APIproyecto/${imagen.ruta}`);
    imagenCard.classList.add('card__imagen');
    card.append(imagenCard)

    const lineaSeparadora=document.createElement('hr');
    lineaSeparadora.classList.add('card__linea');
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

    if(usuario.id_rol==1){

      const contenedorBotones=document.createElement('div');
      contenedorBotones.classList.add('card__botones');
  
      const botonEditar=document.createElement('a');
      botonEditar.setAttribute('id',producto.id);
      botonEditar.setAttribute('href',`#/Productos/Editar/id=${producto.id}`)
      botonEditar.classList.add('card__boton','editar');
  
      const iconoEditar=document.createElement('i');
      iconoEditar.classList.add('bi','bi-pencil-square');
      // iconoEditar.classList.add('bi','bi-pencil-square')
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
  
      const botonEliminar=document.createElement('button');
      botonEliminar.setAttribute('id',producto.id)
      botonEliminar.classList.add('card__boton','eliminar');
  
      const iconoEliminar=document.createElement('i');
      iconoEliminar.classList.add('bi','bi-trash-fill');
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
  
      card.append(contenedorBotones);
    }
    contenedor.append(card);
  }
}

export const cargarCardsConsolas = async (consolas, contenedor) => {
  for (const consola of consolas) {
    
    const card = document.createElement('div');
    card.classList.add('card', 'card--horizontal');
  
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

    if(usuario.id_rol==1){
      const contenedorBotones=document.createElement('div');
      contenedorBotones.classList.add('card__botones');
  
      const botonEditar=document.createElement('a');
      botonEditar.setAttribute('id',consola.id);
      botonEditar.setAttribute('href',`#/Consolas/Editar/id=${consola.id}`)
      botonEditar.classList.add('card__boton','editar');
  
      const iconoEditar=document.createElement('i');
      iconoEditar.classList.add('bi','bi-pencil-square');
      // iconoEditar.classList.add('bi','bi-pencil-square')
      botonEditar.append(iconoEditar);
      contenedorBotones.append(botonEditar);
  
      const botonEliminar=document.createElement('button');
      botonEliminar.setAttribute('id',consola.id)
      botonEliminar.classList.add('card__boton','eliminar');
  
      const iconoEliminar=document.createElement('i');
      iconoEliminar.classList.add('bi','bi-trash-fill');
      botonEliminar.append(iconoEliminar);
      contenedorBotones.append(botonEliminar);
  
      cardInfo.append(contenedorBotones);
    }

    card.append(cardInfo)
    contenedor.append(card)
  }

}

export const cargarCardsConsolasReservar=async(consolas,contenedor)=>{
  for (const consola of consolas) {
    
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
    botonReservar.classList.add('botonReservar')
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
    const option=document.createElement('option');
    option.setAttribute('value',tipo.id);
    option.textContent=tipo.tipo;
    select.append(option);
  });
}

export const cargarSelecrProductos=async(select)=>{

  const productos=await get('productos');

  productos.forEach(producto => {
    const option=document.createElement('option');
    option.setAttribute('value',producto.id);
    option.textContent=producto.nombre;
    select.append(option);
  });
}

export const validar = (event) => {
  
  event.preventDefault();
  
  const campos = [...event.target].filter((item) => item.hasAttribute('required'));
  const inputText = campos.filter((campo) => campo.tagName == 'INPUT' && campo.getAttribute('type') == 'text')
  const inputContrasenia=campos.filter((campo) => campo.tagName == 'INPUT' && campo.getAttribute('type') == 'password')
  const selects = campos.filter((campo) => campo.tagName == 'SELECT');
  const textAreas = campos.filter((campo) => campo.tagName == 'TEXTAREA');
  
  
  let info = {};
  if (inputText.length > 0) {
    inputText.forEach(campo => {
      if (validarMinimo(campo)) {
        if(campo.getAttribute('id')=='correo'){
          if(validarCorreo(campo)){
            info[campo.getAttribute('id')] = campo.value.toLowerCase();
          }
        }else{
          info[campo.getAttribute('id')] = campo.value;
        }
      }
    });
  }


  if (inputContrasenia.length > 0) {
    inputContrasenia.forEach(campo => {
      if (validarContrasenia(campo)) {
        info[campo.getAttribute('id')] = campo.value;
      }
    });
  }


  if (selects.length > 0) {
    selects.forEach(select => {
      if (select.value == 0) {
        if (select.nextElementSibling)nextElementSibling.remove();
        const mensaje = document.createElement('span');
        mensaje.textContent = "Debe seleccionar un elemento";
        select.insertAdjacentElement('afterend',mensaje)
      } else {
        info[select.getAttribute('id')] = select.value;
      }
    });
  }

  if(textAreas.length > 0){
    textAreas.forEach(textArea => {
      if (validarMinimo(textArea)) {
        info[textArea.getAttribute('id')] = textArea.value;
      }
    })
  }
  return info;
}

export const validarIngreso = async (event) => {
  const datos = await validar(event);
  if (Object.keys(datos).length == 2) {

    const respuesta=await post('usuarios/login',datos)
    if(respuesta.ok){
      const resultado=await respuesta.json();
      localStorage.setItem('token', resultado.token);
      
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

export const cargarSelectRoles = async(select) => {
  const roles = await get('roles');

  roles.forEach(rol => {
    const valor = document.createElement('option');
    valor.setAttribute('value', rol.id)
    valor.textContent = rol.rol;
    select.append(valor);
  });
  

}