// Importa la función para decodificar el contenido del token JWT
import { jwtDecode } from "jwt-decode";
// Importa la función para mostrar mensajes de error
import { error } from "./alertas";

/**
 * Valida si el token almacenado en localStorage está expirado.
 * @returns {boolean} true si el token está expirado o no existe, false si está vigente.
 */
const isTokenExpired = () => {
  const token = localStorage.getItem("token"); // Obtiene el token del localStorage
  if (!token) return true; // Si no hay token, se considera expirado
  try {
    const decoded = jwtDecode(token); // Decodifica el token para obtener su información
    const currentTime = Date.now() / 1000; // Obtiene la hora actual en segundos
    return decoded.exp < currentTime; // Retorna true si el token ya expiró
  } catch (e) {
    return true; // Si ocurre un error al decodificar, se considera expirado
  }
};

/**
 * Refresca el token de acceso usando el refreshToken almacenado en localStorage.
 * @returns {string|null} El nuevo token si fue exitoso, null si no hay refreshToken o si falla el refresh.
 */
const refreshAccessToken = async () => {
  alert('refrescando el token')
  const refreshToken = localStorage.getItem("refreshToken"); // Obtiene el refreshToken
  if (!refreshToken) return null; // Si no hay refreshToken, retorna null

  // Realiza la petición para refrescar el token
  const res = await fetch(`http://localhost:8080/APIproyecto/api/refreshToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (res.ok) {
    const data = await res.json(); // Obtiene el nuevo token del backend
    localStorage.removeItem('token'); // Elimina el token anterior
    localStorage.setItem("token", data.token); // Guarda el nuevo token
    return data.token; // Retorna el nuevo token
  } else {
    // Si el refresh es inválido, limpia el storage y redirige al login
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

/**
 * Obtiene los headers de autenticación para las peticiones HTTP.
 * @returns {Object} Headers con Content-Type y Authorization si hay token válido, solo Content-Type si no.
 */
const getAuthHeaders = async() => {
  let token = localStorage.getItem("token"); // Obtiene el token
  if (!token || isTokenExpired()) {
    token = await refreshAccessToken(); // Si no hay token válido, intenta refrescarlo
  }
  // Retorna los headers apropiados
  return token
    ? { "Content-Type": "application/json", Authorization: "Bearer " + token }
    : { "Content-Type": "application/json" };
};

/**
 * Realiza una petición GET autenticada al endpoint indicado.
 * @param {string} endpoint - Ruta del recurso a consultar.
 * @returns {Promise<any>} Retorna la respuesta en formato JSON si es exitosa, o muestra error si falla.
 */
export const get = async (endpoint) => {
  const data = await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    headers: await getAuthHeaders()
  });
  if(data.ok){
    return await data.json(); // Retorna el JSON de la respuesta
  }
  const men=await data.json(); // Obtiene el mensaje de error
  error(men.error) // Muestra el error
}

/**
 * Realiza una petición POST autenticada al endpoint indicado.
 * @param {string} endpoint - Ruta del recurso a consultar.
 * @param {Object} info - Objeto con la información a enviar en el body.
 * @returns {Promise<Response>} Retorna la respuesta de la petición fetch.
 */
export const post = async (endpoint, info) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(info)
  });
}

/**
 * Realiza una petición POST sin autenticación (sin token).
 * @param {string} endpoint - Ruta del recurso a consultar.
 * @param {Object} info - Objeto con la información a enviar en el body.
 * @returns {Promise<Response>} Retorna la respuesta de la petición fetch.
 */
export const postSinToken = async (endpoint, info) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  });
};

/**
 * Realiza una petición POST para subir imágenes (con token si existe).
 * @param {FormData} formData - FormData con la imagen a subir.
 * @returns {Promise<Response>} Retorna la respuesta de la petición fetch.
 */
export const post_imgs = async (formData) => {
  const token = localStorage.getItem("token"); // Obtiene el token
  const headers = token ? { 'Authorization': 'Bearer ' + token } : {}; // Prepara los headers
  return await fetch(`http://localhost:8080/APIproyecto/api/imagenes`, {
    method: 'POST',
    headers: headers,
    body: formData
  });
}

/**
 * Realiza una petición PUT autenticada al endpoint indicado.
 * @param {string} endpoint - Ruta del recurso a consultar.
 * @param {Object} info - Objeto con la información a enviar en el body.
 * @returns {Promise<Response>} Retorna la respuesta de la petición fetch, o undefined si hay error.
 */
export const put = async (endpoint, info) => {
  try {
    return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(info)
    });
  } catch (error) {
    console.log(error); // Muestra el error en consola si ocurre
  }
}

/**
 * Realiza una petición DELETE autenticada al endpoint indicado.
 * @param {string} endpoint - Ruta del recurso a eliminar.
 * @returns {Promise<Response>} Retorna la respuesta de la petición fetch.
 */
export const del = async (endpoint) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'DELETE',
    headers: await getAuthHeaders()
  });
}