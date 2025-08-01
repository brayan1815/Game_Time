import { del, get, post, put } from "../../../helpers/api.js";
import { confirmar, error, success } from "../../../helpers/alertas.js";
import { cargarSelecrProductos, crearFila, crearFilaConsumos, crearTabla, quitarFOmatoIso, validar } from "../../../Modules/modules.js";

export const consumosController=async (parametros=null)=>{


    const nombreUsuario=document.querySelector('.nombreUsuario');
    const contenedorFomrulario=document.querySelector('.contenedorFormularioModal')
    const horaInicioFin=document.querySelector('.horaInicioFin');
    const cons=document.querySelector('.consola');
    const precHor=document.querySelector('.precioHora');
    const botonAgregarProducto=document.querySelector('.boton__tabla');
    const botonCobrar=document.querySelector('.contenido__Boton--cobrar')
    const select=document.querySelector('#id_producto');
    const formulario=document.querySelector('form');
    const campoCantAComprar=document.querySelector('#cantidad');
    const cantDisponibles=document.querySelector('#cantDisponible');
    const precioProducto=document.querySelector('#precio_unidad');
    const btnSumar=document.querySelector('#sumar');
    const btnRestar=document.querySelector('#restar');
    const subtotal=document.querySelector('#subtotal');
    const contenedorCantComprar=document.querySelector('.contenedorCampo--displayFlex');
    const contenedorTabla=document.querySelector('.contenedorTabla');
    //----FORMULARIO EDITAR ----//
    const contenedorFormEditar=document.querySelector('.contenedorFormularioModal.editar')
    const formEditarConsumo=document.querySelector('.formulario.Editar');
    const nombreProd=document.querySelector('#Producto');
    const cantDispo=document.querySelector('.formulario.Editar #cantidades_disponibles');
    const prec=document.querySelector('.formulario.Editar #precio_unidad');
    const cant=document.querySelector('.formulario.Editar #cantidad');
    // const btRestar=document.querySelector('.formulario.Editar #restar');
    // const btSumar=document.querySelector('.formulario.Editar #sumar');
    const subt=document.querySelector('.formulario.Editar #subtotal');
    const btnCancel=document.querySelector('.formulario.Editar .formulario__boton--cancelar');
    const btnCobrar=document.querySelector('.contenido__Boton--cobrar');
    //-----FACTURA-------//
    const contenedorFactura=document.querySelector('.contenedorModal.fac');
    const consumoConsola=document.querySelector('#pago_consola');
    const consumoProductos=document.querySelector('#pago_consumo');
    const totPag=document.querySelector('#total');
    const  btnCancelfac=document.querySelector('.formulario__boton--cancelar.fac');
    const btnConfirCobro=document.querySelector('.formulario__boton.cob');
    const selectMetodoPago=document.querySelector('#metodo_pago');
    const lblselecmetodo=document.querySelector('.lbl');
    

    const usu=JSON.parse(localStorage.getItem('usuario'));
    const id_reserva = parametros.id;
    const reserva=await get(`reservas/${id_reserva}`);


    
    if(usu.id_rol!=1 || reserva.id_estado_reserva==4){
        botonCobrar.textContent="Factura";
        botonAgregarProducto.classList.add('displayNone');
        btnConfirCobro.classList.add('displayNone');
        btnCancelfac.textContent="Cerrar";
        selectMetodoPago.classList.add('displayNone');
        lblselecmetodo.classList.add('displayNone');
    }else{
        botonCobrar.textContent="Cobrar";
        botonAgregarProducto.classList.remove('displayNone');
        btnConfirCobro.classList.remove('displayNone');
        btnCancelfac.textContent="Cancelar"
        selectMetodoPago.classList.remove('displayNone');
        lblselecmetodo.classList.remove('displayNone');
    }


    

    cargarSelecrProductos(select);


    btnCobrar.setAttribute('id',id_reserva)
    botonCobrar.setAttribute('id',id_reserva);

    let consumosReserva=null;

    if(reserva.id_estado_reserva==4){
        consumosReserva=await get(`detalle-factura-consumos/reservas/${reserva.id}`)
    }else{
        consumosReserva=await get(`consumos/reserva/${id_reserva}`);
    }

    const usuario=await get(`usuarios/${reserva.id_usuario}`);
    const consola=await get(`consolas/${reserva.id_consola }`);
    const tipoConsola=await get(`tipos/${consola.id_tipo}`);
    

    if(consumosReserva.length>0){
        crearTabla(['producto','precio','cantidad','subtotal'],contenedorTabla);

        const cuerpoTabla=document.querySelector('.tabla__cuerpo');
        if(reserva.id_estado_reserva!=4){
            for (const consumo of consumosReserva) {
                await crearFilaConsumos([consumo.nombreProducto,consumo.precioProducto,consumo.cantidad,consumo.subtotal],consumo.idConsumo,cuerpoTabla,reserva)
            }
        }else{
            for (const consumo of consumosReserva) {
                await crearFilaConsumos([consumo.nombre_producto,consumo.precio_unitario,consumo.cantidad,consumo.subtotal],null,cuerpoTabla,reserva)
            }
        }
    }else{
        const mensaje=document.createElement('span');
        mensaje.classList.add('MensajeTabla');
        mensaje.textContent="Aun no hay consumos registrados"
        contenedorTabla.append(mensaje)
    }

    
    

    const btnsTabla=document.querySelectorAll('.registro__boton');
    [...btnsTabla].forEach(btn => {
        btn.disabled=false;
        btn.classList.remove('boton-deshabilitado');
    });


    botonCobrar.disabled=false;
    botonAgregarProducto.disabled=false;

    if(reserva.id_estado_reserva==1 || reserva.id_estado_reserva==2){
        botonCobrar.classList.add('boton-deshabilitado');
        botonCobrar.disabled=true;

    }

    if(reserva.id_estado_reserva==1 || reserva.id_estado_reserva==3){
        
        [...btnsTabla].forEach(btn => {
            btn.disabled=true;
            btn.classList.add('boton-deshabilitado');
        });
    }

    if(reserva.id_estado_reserva ==1 || reserva.id_estado_reserva==3){
        botonAgregarProducto.classList.add('boton-deshabilitado');
        botonAgregarProducto.disabled=true; 
    }

    botonAgregarProducto.addEventListener('click',()=>{
        contenedorFomrulario.classList.add('displayFlex');
    })

    nombreUsuario.textContent=usuario.nombre;
    horaInicioFin.textContent=`${quitarFOmatoIso(reserva.hora_inicio)} - ${quitarFOmatoIso(reserva.hora_finalizacion)}`;
    cons.textContent=consola.nombre;
    precHor.textContent=`$${tipoConsola.precio_hora} c/h`;

    let cantidades=1;

    const sumarCantidad=(cantInicial,indicadorCant,maximo,precioUnitProd,indicadorSubt)=>{
        if(cantInicial<maximo){
            cantInicial++;
            indicadorCant.value=cantInicial;
            indicadorSubt.value=precioUnitProd*cantInicial;
            return cantInicial;
        }
    }

    const restarCantidad=(cantInicial,indicadorCant,precioProd,Subt)=>{
        if(cantInicial>1){
            cantInicial--;
            indicadorCant.value=cantInicial;
            Subt.value=precioProd*cantInicial;
            return cantInicial;
        }
    }

    window.addEventListener('click', async(event)=>{
        
        const clase=event.target.getAttribute('class');
        
        
        if(clase=="btnSumarRestar sumar"){
            const producto=await get(`productos/${select.value}`);
            const maximo=producto.cantidades_disponibles;

            cantidades=sumarCantidad(cantidades,campoCantAComprar,producto.cantidades_disponibles,producto.precio,subtotal)
            
            if(cantidades>0){
                if(contenedorCantComprar.nextElementSibling)contenedorCantComprar.nextElementSibling.remove();
            }
        }
        else if(clase=="btnSumarRestar sumar editar"){
            const cantInicial=Number(cant.value);
            sumarCantidad(cantInicial,cant,Number(cantDispo.textContent),Number(prec.textContent),subt)
        }
        else if(clase=="btnSumarRestar restar"){
            const producto=await get(`productos/${select.value}`);

            cantidades=restarCantidad(cantidades,campoCantAComprar,producto.precio,subtotal)
        }
        else if(clase=="btnSumarRestar restar editar"){
            const cantInicial=Number(cant.value);
            restarCantidad(cantInicial,cant,Number(prec.textContent),subt);
        }
        else if(clase=="formulario__boton formulario__boton--cancelar"){
            select.value=0;
            cantDisponibles.textContent=0;
            precioProducto.textContent=0;
            campoCantAComprar.value=0;
            subtotal.value=0;
            cerrarFomrulario(contenedorFomrulario);
        }
        else if(clase=="registro__boton registro__boton--editar"){       
            const id=event.target.getAttribute('id');
            const consumo=await get(`consumos/dto/${id}`);

            nombreProd.textContent=consumo.nombreProducto;
            cantDispo.textContent=consumo.cantidadRestanteProducto;
            prec.textContent=consumo.precioProducto;
            cant.value=consumo.cantidad;
            subt.value=consumo.subtotal;
            document.querySelector('#id_consumo').value=id;
            contenedorFormEditar.classList.add('displayFlex');
                
        }
        else if(clase=="registro__boton registro__boton--eliminar"){
            const id=event.target.getAttribute('id');

            const confirmacion=await confirmar("eliminar el producto");
            if(confirmacion.isConfirmed){
                const respuesta=await del(`consumos/${id}`);
                const res=await respuesta.json();
                if(respuesta.ok){
                    await success(res.mensaje);
                    location.reload();
                }
                else{
                    error(res.error)
                }
            }
        }
        
    })


    const cerrarFomrulario=(contenedor)=>{
        contenedor.classList.remove('displayFlex');
    }

    select.addEventListener('change',async(event)=>{
        cantidades=0;
        const id=event.target.value;
        campoCantAComprar.value=0;
        cantDisponibles.textContent=0;
        precioProducto.textContent=0;

        if(id!=0){
            btnRestar.disabled=false;
            btnSumar.disabled=false;
            const producto=await get(`productos/${id}`);
            cantDisponibles.textContent=producto.cantidades_disponibles;
            precioProducto.textContent=`$${producto.precio}` 
            subtotal.value=producto.precio;
            campoCantAComprar.value=1;  
        }else{
            btnRestar.disabled=true;
            btnSumar.disabled=true;
        }
    })

    formulario.addEventListener('submit',async(event)=>{
        event.preventDefault();
        if(campoCantAComprar.value>0){
            if(contenedorCantComprar.nextElementSibling)contenedorCantComprar.nextElementSibling.remove();
            const info=validar(event);
            info['id_reserva']=Number(id_reserva);
            info['cantidad']=Number(info['cantidad']);
            info['id_producto']=Number(info['id_producto'])
            info['subtotal']=Number(info['subtotal'])
            
            const producto=await get(`productos/${info['id_producto']}`);
            producto['cantidades_disponibles']=producto['cantidades_disponibles']-info['cantidad'];

            const res=await put(`productos/${producto.id}`,producto);
            if(res.ok){
                const respuesta=await post('consumos',info);
                const res=await respuesta.json();
                if(respuesta.ok){
                    await success(res.mensaje)
                    select.value=0;
                    cantDisponibles.textContent=0;
                    precioProducto.textContent=0;
                    campoCantAComprar.value=0;
                    subtotal.textContent=0;
                    cerrarFomrulario(contenedorFomrulario);
                    location.reload();                    
                }
            }
        }else{
            if(contenedorCantComprar.nextElementSibling)contenedorCantComprar.nextElementSibling.remove();
            const span=document.createElement('span');
            span.textContent="la cantidad minima para comprar es 1";
            contenedorCantComprar.insertAdjacentElement('afterend',span);
        }
    })

    // ------------------------------- FORMULARIO EDITAR------------------------------------//
    formEditarConsumo.addEventListener('submit',async(event)=>{
        const info=validar(event);
        const consumo=await get(`consumos/${info.id_consumo}`);
        
        consumo['cantidad']=Number(info.cantidad);
        consumo['subtotal']=Number(info.subtotal); 
        
        const respuesta=await put ('consumos',consumo);
        const res=await respuesta.json();
        
        if(respuesta.ok){
            success(res.mensaje)
        }
        
        cerrarFomrulario(contenedorFormEditar)

    })

    btnCancel.addEventListener('click',()=>{
        cerrarFomrulario(contenedorFormEditar)
    })

    /*------------------COBRAR-------------------------*/

    btnCobrar.addEventListener('click',async(event)=>{
        const id_reser=event.target.getAttribute('id');

        const factura=await post(`facturas/reserva/${id_reser}`);
        const res=await factura.json();
        console.log(res);
        

        const consCons=res.totalTiempo+"";
        const con=consCons.split('.');
        consumoConsola.textContent=con[0];

        const t=res.totalGeneral+"";
        const to=t.split('.');
        consumoProductos.textContent=res.totalProductos;
        totPag.textContent=`Total: ${to[0]}`;
        
        contenedorFactura.classList.add('displayFlex');

    })

    btnCancelfac.addEventListener('click',()=>{
        contenedorFactura.classList.remove('displayFlex');

    })

    const metodosPago=await get('metodospago');

    metodosPago.forEach(metodo => {
        const option=document.createElement('option');
        option.setAttribute('value',metodo.id);
        option.textContent=metodo.metodoPago;
        selectMetodoPago.append(option);
    });

    btnConfirCobro.addEventListener('click',async()=>{
        // const reserva=await get(`reservas/${id_reserva}`);
        const factura=await post(`facturas/reserva/${id_reserva}`);
        const fac=await factura.json();
        
        
        if(selectMetodoPago.value!=0){
            const pago=await post(`facturas/pago/${fac.id}/${selectMetodoPago.value}`);
            const pag=await pago.json();

            if(pago.ok){
                await success(pag.mensaje);
                contenedorFactura.classList.remove('displayFlex');
                window.location.href = "#/Reservas";
            }
        }else{
            error('Debe seleccionar primero el metodo de pago');
        }
    })

    
}