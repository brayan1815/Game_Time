// Archivo de validaciones extraídas de modules.js

/**
 * Limpia los mensajes de error y estilos de un campo de formulario.
 * Elimina el mensaje de error (si existe) y la clase de borde rojo.
 * @param {HTMLElement} campo - Campo de formulario a limpiar.
 */
export const limpiar = (campo) => {
  // Si el campo tiene un elemento hermano siguiente (mensaje de error), lo elimina
  if (campo.nextElementSibling) campo.nextElementSibling.remove();
  // Quita la clase de borde rojo del campo
  campo.classList.remove('border--red');
};

/**
 * Valida que un campo tenga el mínimo de caracteres requeridos.
 * Aplica borde rojo y mensaje si no cumple.
 * @param {HTMLElement} campo - Campo de formulario a validar.
 * @returns {boolean} True si cumple el mínimo, false si no.
 */
export const validarMinimo = (campo) => {
  const texto = campo.value; // Se obtiene el valor del campo
  let minimo = 0; // Se inicializa el mínimo en 0

  // Se determina el mínimo según el tipo de campo
  if (campo.tagName == "INPUT") {
    minimo = campo.getAttribute('min'); // Para input, se toma el atributo 'min'
  } else if (campo.tagName == 'TEXTAREA') {
    minimo = campo.getAttribute('minlength'); // Para textarea, se toma 'minlength'
  }
  // Si el texto es menor al mínimo requerido
  if (texto.length < minimo) {
    const span = document.createElement('span'); // Se crea un span para el mensaje de error
    span.textContent = `El campo ${campo.getAttribute('id')} debe tener minimo ${minimo} caracteres`;
    if (campo.nextElementSibling) campo.nextElementSibling.remove(); // Elimina mensaje anterior si existe
    campo.insertAdjacentElement('afterend', span); // Inserta el mensaje después del campo
    campo.classList.add('border--red'); // Agrega borde rojo
    return false; // Retorna false si no cumple
  } else {
    return true; // Retorna true si cumple
  }
};

/**
 * Valida que la contraseña ingresada por el usuario compla las siguientes condiciones
 * - Minimo una mayuscula
 * - Minimo una minuscula
 * - Minimo un numero
 * - Minimo un caracter especial
 * - Logitud minima de 8 caracteres
 * 
 * @param {HTMLElement} campo Input donde el usuario escribe la contraseña
 * @returns {boolean} Retorna true si la contraseña es valida, de lo contrario retorna false
 */
export const validarContrasenia = (campo) => {
  const contrasenia = campo.value;//se obtiene el valor del campo
  const expresion = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;//se declara la expresion regular que usara
  if (!contrasenia.match(expresion)) {//si la contraseña no coincide con el campo
    if (campo.nextElementSibling) campo.nextElementSibling.remove();//si el elemento tiene otro elemento hermano despues de el lo remueve
    let mensaje = document.createElement('span');//se crea un elemento html de tipo span y se asigna lavariable mensaje
    mensaje.textContent = 'la contraseña debe tener minimo una mayuscula, una minuscula, un caracter especial y 8 caracteres';//se le agrega contenido de texto al elemento que se creo previamente, en este caso el mensaje indica que la contraseña no es correcta
    campo.insertAdjacentElement('afterend', mensaje);//se inserta el elemento mensaje al lado despues del elemento que se recibe como parametro
    campo.classList.add('border--red');//se le agrega al campo el estilo borde rojo
    return false;//se retorna falso
  }
  return true;//en caso de que la contraseña si coincida con la expresion regular se devuelve verdader
};


/**
 * Permite solo letras y espacios en un campo de texto.
 * Previene la escritura de otros caracteres.
 * @param {KeyboardEvent} event - Evento de teclado.
 */
export const validarLetras = (event) => {
  let tecla = event.key; // Se obtiene la tecla presionada
  const letras = /[a-zñáéíóú\s]/i; // Expresión regular para letras y espacios
  // Si la tecla no es letra ni backspace
  if (!letras.test(tecla) && tecla != "Backspace") {
    event.preventDefault(); // Bloquea la tecla
  }
};

/**
 * Permite solo números en un campo de texto.
 * Previene la escritura de otros caracteres.
 * @param {KeyboardEvent} event - Evento de teclado.
 * @returns {boolean} True si es número o backspace, false si no.
 */
export const validarNumeros = (event) => {
  let tecla = event.key; // Se obtiene la tecla presionada
  const numeros = /[0-9]/; // Expresión regular para números
  // Si la tecla no es número ni backspace
  if (!numeros.test(tecla) && tecla != "Backspace") {
    event.preventDefault(); // Bloquea la tecla
    return false; // Retorna false si no es número
  }
  return true; // Retorna true si es número o backspace
};


/**
 * Valida que no se exceda el máximo de caracteres permitidos en un campo.
 * @param {KeyboardEvent} event - Evento de teclado.
 */
export const validarMaximo = (event) => {
  const maximo = event.target.getAttribute('max'); // Obtiene el valor máximo permitido
  // Si la longitud del valor es mayor o igual al máximo y no es backspace
  if (event.target.value.length >= maximo && event.key != 'Backspace') event.preventDefault(); // Bloquea la tecla
};

/**
 * Valida que el valor de un campo sea un correo electrónico válido.
 * Si no es válido, muestra mensaje y aplica borde rojo.
 * @param {HTMLElement} campo - Campo de correo a validar.
 * @returns {boolean} True si es válido, false si no.
 */
export const validarCorreo = (campo) => {
  const expresionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para correo
  if (campo.value.match(expresionCorreo)) return true; // Si cumple, retorna true
  else {
    if (campo.nextElementSibling) campo.nextElementSibling.remove(); // Elimina mensaje anterior si existe
    const span = document.createElement('span'); // Crea mensaje de error
    span.textContent = "El correo ingresado no es valido";
    campo.insertAdjacentElement('afterend', span); // Inserta mensaje después del campo
    campo.classList.add('border--red'); // Agrega borde rojo
    return false; // Retorna false si no es válido
  }
};

/**
 * Valida la selección de una imagen en un input tipo file.
 * Muestra mensajes y estilos según el estado de la selección.
 * @param {HTMLElement} campo - Input de tipo file.
 * @param {HTMLElement} label - Label asociado para mostrar mensajes.
 * @returns {File|boolean|null} El archivo si es válido, false si falta, null si no aplica.
 */
export const validarImagen = (campo, label) => {
  const archivo = campo.files[0]; // Se obtiene el archivo seleccionado
  // Si el campo es requerido
  if (campo.hasAttribute('required')) {
    if (!archivo) {
      const mensaje = document.createElement('span'); // Crea mensaje de error
      mensaje.textContent = "Debe seleccionar una imagen";
      if (label.nextElementSibling) label.nextElementSibling.remove(); // Elimina mensaje anterior si existe
      label.classList.add('border--punteado--red'); // Agrega borde punteado rojo
      label.insertAdjacentElement('afterend', mensaje); // Inserta mensaje después del label
      return false; // Retorna false si no hay archivo
    }
  }
  // Si hay archivo seleccionado
  if (archivo) {
    if (label.nextElementSibling) label.nextElementSibling.remove(); // Elimina mensaje anterior si existe
    label.classList.remove('border--punteado--red'); // Quita borde punteado rojo
    const mensaje = document.createElement('span'); // Crea mensaje con nombre del archivo
    mensaje.textContent = archivo.name;
    mensaje.classList.add('span--verde'); // Agrega clase de éxito
    label.insertAdjacentElement('afterend', mensaje); // Inserta mensaje después del label
    return archivo; // Retorna el archivo
  }
  return null; // Retorna null si no aplica
};

/**
 * Valida todos los campos requeridos de un formulario al hacer submit.
 * Aplica validaciones específicas según el tipo de campo y recopila los valores válidos.
 * @param {Event} event - Evento submit del formulario.
 * @returns {Object} Objeto con los valores válidos de los campos.
 */
export const validar = (event) => {
  event.preventDefault(); // Previene el envío por defecto del formulario

  // Obtiene todos los campos requeridos del formulario
  const campos = [...event.target].filter((item) => item.hasAttribute('required'));
  // Filtra los campos de texto
  const inputText = campos.filter((campo) => campo.tagName == 'INPUT' && campo.getAttribute('type') == 'text')
  // Filtra los campos de contraseña
  const inputContrasenia = campos.filter((campo) => campo.tagName == 'INPUT' && campo.getAttribute('type') == 'password')
  // Filtra los selects
  const selects = campos.filter((campo) => campo.tagName == 'SELECT');
  // Filtra los textareas
  const textAreas = campos.filter((campo) => campo.tagName == 'TEXTAREA');

  let info = {}; // Objeto para almacenar los valores válidos
  // Validar campos de texto
  if (inputText.length > 0) {
    inputText.forEach(campo => {
      if (validarMinimo(campo)) { // Si cumple el mínimo
        if (campo.getAttribute('id') == 'correo') { // Si es el campo correo
          if (validarCorreo(campo)) { // Valida el correo
            info[campo.getAttribute('id')] = campo.value.toLowerCase(); // Guarda el correo en minúsculas
          }
        } else {
          info[campo.getAttribute('id')] = campo.value; // Guarda el valor del campo
        }
      }
    });
  }

  // Validar campos de contraseña
  if (inputContrasenia.length > 0) {
    inputContrasenia.forEach(campo => {
      if (validarContrasenia(campo)) { // Si la contraseña es válida
        info[campo.getAttribute('id')] = campo.value; // Guarda la contraseña
      }
    });
  }

  // Validar selects
  if (selects.length > 0) {
    selects.forEach(select => {
      if (select.value == 0) { // Si no se ha seleccionado una opción válida
        if (select.nextElementSibling) select.nextElementSibling.remove(); // Elimina mensaje anterior
        const mensaje = document.createElement('span'); // Crea mensaje de error
        mensaje.textContent = "Debe seleccionar un elemento";
        select.insertAdjacentElement('afterend', mensaje)
      } else {
        info[select.getAttribute('id')] = select.value; // Guarda el valor seleccionado
      }
    });
  }

  // Validar textareas
  if (textAreas.length > 0) {
    textAreas.forEach(textArea => {
      if (validarMinimo(textArea)) { // Si cumple el mínimo
        info[textArea.getAttribute('id')] = textArea.value; // Guarda el valor del textarea
      }
    })
  }
  return info; // Retorna el objeto con los valores válidos
}