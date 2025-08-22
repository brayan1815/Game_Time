// Archivo de validaciones extraídas de modules.js

export const limpiar = (campo) => {
  if (campo.nextElementSibling) campo.nextElementSibling.remove();
  campo.classList.remove('border--red');
};

export const validarMinimo = (campo) => {
  const texto = campo.value;
  let minimo = 0;

  if (campo.tagName == "INPUT") {
    minimo = campo.getAttribute('min');
  } else if (campo.tagName == 'TEXTAREA') {
    minimo = campo.getAttribute('minlength');
  }
  if (texto.length < minimo) {
    const span = document.createElement('span');
    span.textContent = `El campo ${campo.getAttribute('id')} debe tener minimo ${minimo} caracteres`;
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    campo.insertAdjacentElement('afterend', span);
    campo.classList.add('border--red');
    return false;
  } else {
    return true;
  }
};

export const validarContrasenia = (campo) => {
  const contrasenia = campo.value;
  const expresion = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
  if (!contrasenia.match(expresion)) {
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    let mensaje = document.createElement('span');
    mensaje.textContent = 'la contraseña debe tener minimo una mayuscula, una minuscula, un caracter especial y 8 caracteres';
    campo.insertAdjacentElement('afterend', mensaje);
    campo.classList.add('border--red');
    return false;
  }
  return true;
};

export const validarLetras = (event) => {
  let tecla = event.key;
  const letras = /[a-zñáéíóú\s]/i;
  if (!letras.test(tecla) && tecla != "Backspace") {
    event.preventDefault();
  }
};

export const validarNumeros = (event) => {
  let tecla = event.key;
  const numeros = /[0-9]/;
  if (!numeros.test(tecla) && tecla != "Backspace") {
    event.preventDefault();
    return false;
  }
  return true;
};

export const validarMaximo = (event) => {
  const maximo = event.target.getAttribute('max');
  if (event.target.value.length >= maximo && event.key != 'Backspace') event.preventDefault();
};

export const validarCorreo = (campo) => {
  const expresionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (campo.value.match(expresionCorreo)) return true;
  else {
    if (campo.nextElementSibling) campo.nextElementSibling.remove();
    const span = document.createElement('span');
    span.textContent = "El correo ingresado no es valido";
    campo.insertAdjacentElement('afterend', span);
    campo.classList.add('border--red');
    return false;
  }
};

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
};

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