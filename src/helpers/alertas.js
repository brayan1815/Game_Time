export const confirmar = (mensaje,texto="") => {
  return Swal.fire({
    title: `¿Está seguro de ${mensaje}?`,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4DD42E",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí"
  });
}

export const success = (mensaje) => {
  return Swal.fire({
    title: mensaje,
    icon: "success",
    draggable: true
  });
}

export const error = (mensaje) => {
  return Swal.fire({
    title: mensaje,
    icon: "error",
    draggable: true
  });
}