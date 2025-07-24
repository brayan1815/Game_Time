import { jwtDecode } from "jwt-decode";
//se importa la funcion para decodificar el contenido del token

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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired()) {
    localStorage.removeItem("token");
    return {
      'Content-Type': 'application/json'
    };
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };
};

export const get = async (endpoint) => {
  const data = await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    headers: getAuthHeaders()
  });
  return await data.json();
}

export const post = async (endpoint, info) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(info)
    });
  } catch (error) {
    console.log(error);
  }
}

export const del = async (endpoint) => {
  return await fetch(`http://localhost:8080/APIproyecto/api/${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}