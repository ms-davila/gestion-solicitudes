/**
 * solicitarproducto.js (también disponible como solicitarprestamo.js)
 * Script para la administración interactiva del formulario de solicitud de préstamo de equipos.
 * 
 * Funcionalidades implementadas:
 * 1. Cálculo automático de la duración (días X entre fecha-inicio y fecha-devolucion).
 *    - No permite valores negativos (mínimo 0).
 *    - Se actualiza automáticamente al cambiar cualquiera de las dos fechas.
 * 2. Función para configurar y reemplazar el valor máximo de días (Y) desde JavaScript.
 *    - Formato en el input: "X de Y días".
 * 3. Control del estado del botón "btn-enviar":
 *    - Se bloquea (se hace gris y no permite ser clickeado) cuando:
 *      * X es mayor que Y o menor que 1.
 *      * O HASTA QUE SE PRESIONE el checkbox "Acepto las condiciones del préstamo".
 *    - Se habilita con su color original únicamente cuando 1 <= X <= Y Y la casilla está marcada.
 */

// =============================================================================
// ESTADO GLOBAL
// =============================================================================
// Valor por defecto de duración máxima (Y)
let duracionMaximaY = 7;


// =============================================================================
// UTILIDADES PARA CÁLCULO DE FECHAS
// =============================================================================
/**
 * Calcula la diferencia en días calendario entre dos fechas (YYYY-MM-DD).
 * Utiliza Date.UTC para evitar discrepancias por zonas horarias o cambios de hora.
 * 
 * @param {string} fechaInicioStr - Fecha inicial en formato YYYY-MM-DD
 * @param {string} fechaFinStr - Fecha final en formato YYYY-MM-DD
 * @returns {number} Cantidad de días de diferencia (no negativo, mínimo 0)
 */
function calcularDiasEntreFechas(fechaInicioStr, fechaFinStr) {
    if (!fechaInicioStr || !fechaFinStr) {
        return 0;
    }

    const [y1, m1, d1] = fechaInicioStr.split("-").map(Number);
    const [y2, m2, d2] = fechaFinStr.split("-").map(Number);

    if (isNaN(y1) || isNaN(m1) || isNaN(d1) || isNaN(y2) || isNaN(m2) || isNaN(d2)) {
        return 0;
    }

    const utcInicio = Date.UTC(y1, m1 - 1, d1);
    const utcFin = Date.UTC(y2, m2 - 1, d2);

    const diferenciaMs = utcFin - utcInicio;
    const dias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));

    // El requerimiento especifica que no puede ser negativo
    return Math.max(0, dias);
}

/**
 * Convierte una fecha de YYYY-MM-DD a DD/MM/YYYY para textos legibles.
 */
function formatearFechaLegible(fechaYmd) {
    if (!fechaYmd || !fechaYmd.includes("-")) return fechaYmd || "";
    const [y, m, d] = fechaYmd.split("-");
    return `${d}/${m}/${y}`;
}


// =============================================================================
// REQUISITO 1: ACTUALIZACIÓN AUTOMÁTICA DE "duracion" Y CONFIGURACIÓN DE "Y"
// =============================================================================
/**
 * Actualiza el input "duracion" de forma automática calculando los días X
 * entre "fecha-inicio" y "fecha-devolucion", mostrando el formato "X de Y días".
 * 
 * @returns {{ x: number, y: number, texto: string }} Objeto con los valores calculados
 */
function actualizarDuracion() {
    const inputInicio = document.getElementById("fecha-inicio");
    const inputDevolucion = document.getElementById("fecha-devolucion");
    const inputDuracion = document.getElementById("duracion");

    if (!inputDuracion) return { x: 0, y: duracionMaximaY, texto: `0 de ${duracionMaximaY} días` };

    const fInicioVal = inputInicio ? inputInicio.value : "";
    const fDevolucionVal = inputDevolucion ? inputDevolucion.value : "";

    // Calcular X (días entre inicio y devolución, sin permitir negativos)
    const diasX = calcularDiasEntreFechas(fInicioVal, fDevolucionVal);
    const diasY = duracionMaximaY;

    // Actualizar el valor en el input
    const textoDuracion = `${diasX} de ${diasY} días`;
    inputDuracion.value = textoDuracion;

    // Actualizar condiciones si existe el elemento en la página
    actualizarFechaEnCondiciones(fDevolucionVal);

    // Actualizar estado del botón de envío evaluando fechas y checkbox
    actualizarEstadoBotonEnviar(diasX, diasY);

    return { x: diasX, y: diasY, texto: textoDuracion };
}

/**
 * Función que permite ingresar un número que reemplace el "Y" desde JavaScript.
 * 
 * @param {number|string} nuevoY - Nuevo valor numérico para la duración máxima Y
 * @returns {number} El nuevo valor asignado a Y
 */
function establecerDuracionMaxima(nuevoY) {
    const num = Number(nuevoY);
    if (!isNaN(num) && num > 0) {
        duracionMaximaY = num;
    } else {
        console.warn(`Valor inválido para duración máxima Y: ${nuevoY}`);
    }

    // Actualizar el texto de ayuda si existe
    const fieldHelp = document.querySelector(".form-section .field-help");
    if (fieldHelp) {
        fieldHelp.textContent = `La duración máxima de este equipo es de ${duracionMaximaY} días calendario.`;
    }

    // Recalcular y actualizar la visualización y el botón
    actualizarDuracion();

    return duracionMaximaY;
}

/**
 * Actualiza la fecha de devolución en el párrafo de condiciones si está presente.
 */
function actualizarFechaEnCondiciones(fechaDevolucionVal) {
    const condicionesStrong = document.querySelector(".condiciones-texto strong");
    if (condicionesStrong && fechaDevolucionVal) {
        condicionesStrong.textContent = formatearFechaLegible(fechaDevolucionVal);
    }
}


// =============================================================================
// REQUISITO 2 & 3: CONTROL Y BLOQUEO DEL BOTÓN "btn-enviar"
// =============================================================================
/**
 * Bloquea el botón "btn-enviar", tornándolo gris y deshabilitando clicks, cuando:
 * 1. Los días calculados X superan el máximo Y o son menores a 1.
 * 2. O la casilla de verificación "Acepto las condiciones del préstamo" no está marcada.
 * 
 * @param {number} [diasX] - Días calculados (si se omite, se calcula automáticamente)
 * @param {number} [maxDiasY] - Duración máxima permitida Y
 * @returns {boolean} True si el botón está habilitado, False si está bloqueado/gris
 */
function actualizarEstadoBotonEnviar(diasX, maxDiasY) {
    const btnEnviar = document.querySelector(".btn-enviar");
    const checkboxCondiciones = document.querySelector(".checkbox-label input[type='checkbox']") ||
                                document.getElementById("condiciones-checkbox");
    if (!btnEnviar) return false;

    // Si no se pasaron parámetros numéricos, obtener los valores actuales
    if (typeof diasX !== "number" || typeof maxDiasY !== "number") {
        const inputInicio = document.getElementById("fecha-inicio");
        const inputDevolucion = document.getElementById("fecha-devolucion");
        diasX = calcularDiasEntreFechas(
            inputInicio ? inputInicio.value : "",
            inputDevolucion ? inputDevolucion.value : ""
        );
        maxDiasY = duracionMaximaY;
    }

    // 1. Validación de fechas: X no puede ser menor que 1 ni mayor que Y
    const fechasInvalidas = (diasX > maxDiasY) || (diasX < 1);

    // 2. Validación de aceptación de condiciones
    const condicionesAceptadas = checkboxCondiciones ? checkboxCondiciones.checked : false;

    // El botón se bloquea si las fechas son inválidas O si no se han aceptado las condiciones
    const estaBloqueado = fechasInvalidas || !condicionesAceptadas;

    btnEnviar.disabled = estaBloqueado;

    if (estaBloqueado) {
        btnEnviar.classList.add("disabled");
        btnEnviar.style.backgroundColor = "#9EABAE";
        btnEnviar.style.color = "#FFFFFF";
        btnEnviar.style.cursor = "not-allowed";

        // Mensaje de ayuda contextual
        if (fechasInvalidas) {
            btnEnviar.title = diasX < 1 
                ? "La fecha de devolución debe ser posterior a la fecha de inicio (mínimo 1 día)."
                : `La duración seleccionada (${diasX} días) supera el límite máximo de ${maxDiasY} días.`;
        } else {
            btnEnviar.title = "Debe aceptar las condiciones del préstamo para poder enviar la solicitud.";
        }
    } else {
        btnEnviar.classList.remove("disabled");
        btnEnviar.style.backgroundColor = "";
        btnEnviar.style.color = "";
        btnEnviar.style.cursor = "pointer";
        btnEnviar.title = "Enviar solicitud de préstamo";
    }

    return !estaBloqueado;
}

/**
 * Función explícita que bloquea o desbloquea el botón evaluando la casilla de condiciones.
 */
function bloquearBotonHastaAceptarCondiciones() {
    return actualizarEstadoBotonEnviar();
}


// =============================================================================
// INICIALIZACIÓN AL CARGAR EL DOCUMENTO
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const inputInicio = document.getElementById("fecha-inicio");
    const inputDevolucion = document.getElementById("fecha-devolucion");
    const btnEnviar = document.querySelector(".btn-enviar");
    const checkboxCondiciones = document.querySelector(".checkbox-label input[type='checkbox']") ||
                                document.getElementById("condiciones-checkbox");

    // 1. Escuchar cambios en fecha-inicio
    if (inputInicio) {
        inputInicio.addEventListener("change", actualizarDuracion);
        inputInicio.addEventListener("input", actualizarDuracion);
    }

    // 2. Escuchar cambios en fecha-devolucion
    if (inputDevolucion) {
        inputDevolucion.addEventListener("change", actualizarDuracion);
        inputDevolucion.addEventListener("input", actualizarDuracion);
    }

    // 3. Escuchar cambios en el checkbox de condiciones
    if (checkboxCondiciones) {
        checkboxCondiciones.addEventListener("change", () => {
            actualizarEstadoBotonEnviar();
        });
    }

    // 4. Manejar click en btn-enviar para evitar envíos si está deshabilitado
    if (btnEnviar) {
        btnEnviar.addEventListener("click", (e) => {
            if (btnEnviar.disabled || btnEnviar.classList.contains("disabled")) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            alert("¡Solicitud de préstamo enviada exitosamente!");
        });
    }

    // 5. Ejecutar el cálculo y validación inicial (el botón iniciará bloqueado hasta marcar el checkbox)
    actualizarDuracion();
});


// =============================================================================
// EXPORTACIÓN GLOBAL PARA ACCESO EXTERNO Y PRUEBAS
// =============================================================================
window.actualizarDuracion = actualizarDuracion;
window.calcularDuracion = actualizarDuracion;
window.establecerDuracionMaxima = establecerDuracionMaxima;
window.setDuracionMaxima = establecerDuracionMaxima;
window.setY = establecerDuracionMaxima;
window.cambiarY = establecerDuracionMaxima;
window.actualizarEstadoBotonEnviar = actualizarEstadoBotonEnviar;
window.validarBotonEnviar = actualizarEstadoBotonEnviar;
window.bloquearBotonHastaAceptarCondiciones = bloquearBotonHastaAceptarCondiciones;
window.calcularDiasEntreFechas = calcularDiasEntreFechas;
