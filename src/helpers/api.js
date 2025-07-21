const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    : {
        'Content-Type': 'application/json'
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