import { jwtDecode } from "jwt-decode";
import { error } from "./alertas";
// //se importa la funcion para decodificar el contenido del token

const isTokenExpired = () => {
  //se crea la funcion para validar si el token esta expirado

  const token = localStorage.getItem("token");//se obtiene el token del localstorage
  if (!token) return true;//si el token no existe se retorna true

  try {
    const decoded = jwtDecode(token);//se decodifica el contenido del token
    const currentTime = Date.now() / 1000;//se obtiene la hora actual en segundos
    return decoded.exp < currentTime;//si el tiempo de expiracion del token ya paso respecto al tiempo actual se retorna true
  } catch (e) {
    return true;//si ocurre un error al decodificar el token se retorna true
  }
};

const refreshAccessToken = async () => {
  alert('refrescando el token')
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const res = await fetch(`http://localhost:8080/APIproyecto/api/refreshToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.removeItem('token');
    localStorage.setItem("token", data.token);
    return data.token;
  } else {
    // Refresh inválido → limpiar storage y redirigir login
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

const getAuthHeaders = async() => {
    let token = localStorage.getItem("token");

  // Verificar expiración
  if (!token || isTokenExpired()) {
    token = await refreshAccessToken(); // pedir uno nuevo
  }

  return token
    ? { "Content-Type": "application/json", Authorization: "Bearer " + token }
    : { "Content-Type": "application/json" };
};

export const get = async (endpoint) => {
  const data = await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    headers: await getAuthHeaders()
  });
  if(data.ok){
    return await data.json();
  }

  const men=await data.json();
  console.log(men);
  
  error(men.error)
  
}

export const post = async (endpoint, info) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(info)
  });
}

export const postSinToken = async (endpoint, info) => {
    return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    });
};

export const post_imgs = async (formData) => {
  const token = localStorage.getItem("token");
  const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

  return await fetch(`http://localhost:8080/APIproyecto/api/imagenes`, {
    method: 'POST',
    headers: headers,
    body: formData
  });
}

export const put = async (endpoint, info) => {
  try {
    return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(info)
    });
  } catch (error) {
    console.log(error);
  }
}

export const del = async (endpoint) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'DELETE',
    headers: await getAuthHeaders()
  });
}