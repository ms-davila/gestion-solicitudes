export const contrasenaValida = (clave) => {
    const tieneMayuscula = clave !== clave.toLowerCase();
    const tieneNumero = /[0-9]/.test(clave);
    return clave.length >= 8 && tieneMayuscula && tieneNumero;
};
