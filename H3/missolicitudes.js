/**
 * missolicitudes.js
 * Script para la administración interactiva de las solicitudes de equipos.
 * 
 * Funcionalidades implementadas:
 * 1. Función para añadir filas dinámicamente en el tbody de la tabla "tabla" con:
 *    - Nombre de equipo y curso.
 *    - Fechas de retiro.
 *    - Unidad asignada (código INV-... o "Pendiente de asignar" / "—").
 *    - Estado con badge estilizado (Enviada, Aprobada, Entregada, Devuelta, Rechazada).
 *    - Acción correspondiente:
 *      * "Retirar solicitud": borra la fila previa confirmación con ventana de alerta.
 *      * "Ver detalle", "Ver constancia", "Ver motivo": despliega alerta con Lorem Ipsum.
 * 2. Filtrado interactivo por el select de estado y rango de fechas (fecha inicio y fin).
 * 3. Actualización del contador en el <p> de la clase titular:
 *    "X pendientes · Y aprobadas · Z en el historial".
 */

// =============================================================================
// 1. DATASET DE SOLICITUDES INICIALES
// =============================================================================
const SOLICITUDES_INICIALES = [
    {
        nombreEquipo: "Osciloscopio TBS1052B",
        curso: "IN324 Laboratorio de Circuitos",
        fechas: "16/09/2026 → 21/09/2026",
        unidadAsignada: "Pendiente de asignar",
        estado: "aprobado",
        accion: "retirar solicitud"
    },
    {
        nombreEquipo: "Kit de robótica Arduino Mega",
        curso: "IN401 Proyecto Integrador",
        fechas: "18/09/2026 → 25/09/2026",
        unidadAsignada: "Pendiente de asignar",
        estado: "enviada",
        accion: "retirar solicitud"
    },
    {
        nombreEquipo: "Cámara Canon EOS 90D",
        curso: "CO210 Fotografía Documental",
        fechas: "15/09/2026 → 19/09/2026",
        unidadAsignada: "INV-CAM-0009",
        estado: "aprobada",
        accion: "ver detalle"
    },
    {
        nombreEquipo: "Multímetro Fluke 117",
        curso: "IN324 Laboratorio de Circuitos",
        fechas: "08/09/2026 → 12/09/2026",
        unidadAsignada: "INV-MUL-0021",
        estado: "entregada",
        accion: "ver constancia"
    },
    {
        nombreEquipo: "Tableta gráfica Wacom Intuos",
        curso: "DI105 Dibujo Digital",
        fechas: "01/09/2026 → 05/09/2026",
        unidadAsignada: "INV-TAB-0004",
        estado: "devuelta",
        accion: "ver detalle"
    },
    {
        nombreEquipo: "Analizador de redes portátil",
        curso: "IN352 Redes y Comunicaciones",
        fechas: "27/08/2026 → 03/09/2026",
        unidadAsignada: "—",
        estado: "rechazada",
        accion: "ver motivo"
    },
    {
        nombreEquipo: "Trípode Manfrotto MT055",
        curso: "CO210 Fotografía Documental",
        fechas: "18/08/2026 → 22/08/2026",
        unidadAsignada: "INV-TRI-0007",
        estado: "devuelta",
        accion: "ver detalle"
    }
];


// =============================================================================
// UTILIDADES PARA FECHAS Y TEXTO
// =============================================================================
/**
 * Convierte una fecha de formato DD/MM/YYYY a YYYY-MM-DD para comparaciones.
 */
function dmyToYmd(dmy) {
    if (!dmy) return "";
    dmy = dmy.trim();
    if (dmy.includes("-")) return dmy;
    const partes = dmy.split("/");
    if (partes.length !== 3) return dmy;
    const [d, m, y] = partes;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

/**
 * Convierte una fecha de formato YYYY-MM-DD a DD/MM/YYYY para visualización.
 */
function ymdToDmy(ymd) {
    if (!ymd) return "";
    ymd = ymd.trim();
    if (ymd.includes("/")) return ymd;
    const partes = ymd.split("-");
    if (partes.length !== 3) return ymd;
    const [y, m, d] = partes;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

/**
 * Extrae la fecha inicial y final a partir de un string de fechas.
 * Soporta formatos como "16/09/2026 → 21/09/2026", "16/09/2026 - 21/09/2026" u objetos.
 */
function procesarRangoFechas(fechas) {
    if (typeof fechas === "object" && fechas !== null) {
        return {
            inicio: fechas.inicio || "",
            fin: fechas.fin || fechas.inicio || ""
        };
    }
    const textoLimpio = String(fechas).replace(/<[^>]+>/g, " ");
    const partes = textoLimpio.split(/[→\-\–\—]+/).map(s => s.trim()).filter(Boolean);
    return {
        inicio: partes[0] || "",
        fin: partes[1] || partes[0] || ""
    };
}

/**
 * Normaliza y capitaliza el estado para la etiqueta visual y su clase CSS.
 */
function normalizarEstado(estado) {
    const raw = (estado || "").toLowerCase().trim();
    if (raw.includes("enviad")) return { clave: "enviada", label: "Enviada" };
    if (raw.includes("aprobad")) return { clave: "aprobada", label: "Aprobada" };
    if (raw.includes("entregad")) return { clave: "entregada", label: "Entregada" };
    if (raw.includes("devuelt")) return { clave: "devuelta", label: "Devuelta" };
    if (raw.includes("rechazad")) return { clave: "rechazada", label: "Rechazada" };
    return { clave: raw, label: estado || "" };
}

/**
 * Normaliza y formatea el texto de la acción.
 */
function normalizarAccion(accion) {
    const raw = (accion || "").toLowerCase().trim();
    if (raw.includes("retirar")) {
        return { esRetirar: true, texto: "Retirar solicitud", clase: "danger" };
    }
    if (raw.includes("constancia")) {
        return { esRetirar: false, texto: "Ver constancia", clase: "primary" };
    }
    if (raw.includes("motivo")) {
        return { esRetirar: false, texto: "Ver motivo", clase: "primary" };
    }
    return { esRetirar: false, texto: "Ver detalle", clase: "primary" };
}


// =============================================================================
// REQUISITO 1: FUNCIÓN PARA AÑADIR FILAS EN EL tbody DE LA TABLA "tabla"
// =============================================================================
/**
 * Añade una fila en el tbody de la tabla con los datos de una solicitud.
 * 
 * @param {string|Object} nombreEquipo - Nombre del equipo o un objeto completo de solicitud
 * @param {string} [curso] - Nombre o código del curso
 * @param {string|Object} [fechas] - Rango de fechas (ej: "16/09/2026 → 21/09/2026")
 * @param {string} [unidadAsignada] - Unidad asignada ("INV-CAM-0009", "Pendiente de asignar", etc.)
 * @param {string} [estado] - Estado ("enviada", "aprobada", "entregada", "devuelta", "rechazada")
 * @param {string} [accion] - Acción ("retirar solicitud", "ver detalle", "ver constancia", "ver motivo")
 * @returns {HTMLTableRowElement} El elemento <tr> creado e insertado
 */
function añadirFilaTabla(nombreEquipo, curso, fechas, unidadAsignada, estado, accion) {
    // Si se pasa un objeto como primer parámetro
    if (typeof nombreEquipo === "object" && nombreEquipo !== null) {
        const item = nombreEquipo;
        nombreEquipo = item.nombreEquipo || item.equipo;
        curso = item.curso;
        fechas = item.fechas;
        unidadAsignada = item.unidadAsignada || item.unidad;
        estado = item.estado;
        accion = item.accion;
    }

    const { inicio: fInicio, fin: fFin } = procesarRangoFechas(fechas);
    const { clave: estadoClave, label: estadoLabel } = normalizarEstado(estado);
    const { esRetirar, texto: accionTexto, clase: accionClase } = normalizarAccion(accion);

    const tr = document.createElement("tr");

    // Guardar datos en dataset para el filtrado eficiente y conteos
    tr.dataset.estado = estadoClave;
    tr.dataset.fechaInicio = dmyToYmd(fInicio);
    tr.dataset.fechaFin = dmyToYmd(fFin);

    // 1. Columna Equipo y Curso
    const tdEquipo = document.createElement("td");
    const divTitulo = document.createElement("div");
    divTitulo.className = "equipo-title";
    divTitulo.textContent = nombreEquipo || "Equipo sin nombre";

    const divSub = document.createElement("div");
    divSub.className = "equipo-sub";
    divSub.textContent = curso || "";

    tdEquipo.appendChild(divTitulo);
    tdEquipo.appendChild(divSub);

    // 2. Columna Fechas
    const tdFechas = document.createElement("td");
    tdFechas.className = "col-fecha";
    tdFechas.innerHTML = `${fInicio} <span>→</span> ${fFin}`;

    // 3. Columna Unidad Asignada
    const tdUnidad = document.createElement("td");
    const esCodigo = unidadAsignada && unidadAsignada.startsWith("INV-");
    tdUnidad.className = esCodigo ? "col-codigo" : "text-muted";
    tdUnidad.textContent = unidadAsignada || "—";

    // 4. Columna Estado
    const tdEstado = document.createElement("td");
    const spanBadge = document.createElement("span");
    spanBadge.className = `badge badge-${estadoClave}`;
    spanBadge.textContent = estadoLabel;
    tdEstado.appendChild(spanBadge);

    // 5. Columna Acción
    const tdAccion = document.createElement("td");
    const btnAccion = document.createElement("a");
    btnAccion.href = "#";
    btnAccion.className = `btn-action ${accionClase}`;
    btnAccion.textContent = accionTexto;

    if (esRetirar) {
        // Confirmación antes de retirar la solicitud
        btnAccion.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmar = window.confirm("¿Está seguro de que desea retirar esta solicitud?");
            if (confirmar) {
                tr.remove();
                actualizarContadorTitular();
                filtrarTabla();
            }
        });
    } else {
        // Alerta con Lorem Ipsum para las demás acciones
        btnAccion.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        });
    }

    tdAccion.appendChild(btnAccion);

    // Armar la fila
    tr.appendChild(tdEquipo);
    tr.appendChild(tdFechas);
    tr.appendChild(tdUnidad);
    tr.appendChild(tdEstado);
    tr.appendChild(tdAccion);

    // Insertar en el tbody de la tabla
    const tbody = document.querySelector(".tabla tbody") || document.querySelector("table tbody");
    if (tbody) {
        tbody.appendChild(tr);
    }

    // Actualizar el resumen del titular
    actualizarContadorTitular();

    return tr;
}


// =============================================================================
// REQUISITO 2: FILTROS POR SELECT "ESTADO" Y RANGO DE FECHAS
// =============================================================================
/**
 * Filtra las filas de la tabla según el estado seleccionado y el rango de fechas.
 */
function filtrarTabla() {
    const selectEstado = document.querySelector("select[name='estado']");
    const inputInicio = document.querySelector("input[name='fecha_inicio']");
    const inputFin = document.querySelector("input[name='fecha_fin']");
    const tbody = document.querySelector(".tabla tbody") || document.querySelector("table tbody");
    if (!tbody) return;

    const estadoFiltro = selectEstado ? selectEstado.value.toLowerCase().trim() : "todos";
    const fechaInicioFiltro = inputInicio && inputInicio.value ? inputInicio.value.trim() : null;
    const fechaFinFiltro = inputFin && inputFin.value ? inputFin.value.trim() : null;

    const filas = tbody.querySelectorAll("tr:not(.fila-vacia)");
    let visibles = 0;

    filas.forEach(fila => {
        const estadoFila = (fila.dataset.estado || "").toLowerCase().trim();
        const fInicioFila = fila.dataset.fechaInicio || "";
        const fFinFila = fila.dataset.fechaFin || "";

        // 1. Condición de Estado
        let coincideEstado = false;
        if (estadoFiltro === "todos" || estadoFiltro === "") {
            coincideEstado = true;
        } else {
            coincideEstado = (estadoFila === estadoFiltro) ||
                             (estadoFila.replace(/a$/, "o") === estadoFiltro.replace(/a$/, "o"));
        }

        // 2. Condición de Rango de Fechas
        let coincideFechas = true;
        if (fechaInicioFiltro && fechaFinFiltro) {
            // Se requiere que las fechas de la fila se encuentren dentro del rango
            coincideFechas = (fInicioFila >= fechaInicioFiltro) && (fFinFila <= fechaFinFiltro);
        } else if (fechaInicioFiltro) {
            coincideFechas = (fInicioFila >= fechaInicioFiltro);
        } else if (fechaFinFiltro) {
            coincideFechas = (fFinFila <= fechaFinFiltro);
        }

        // Aplicar visibilidad
        if (coincideEstado && coincideFechas) {
            fila.style.display = "";
            visibles++;
        } else {
            fila.style.display = "none";
        }
    });

    // Manejar fila informativa cuando no hay resultados
    let filaVacia = tbody.querySelector(".fila-vacia");
    if (visibles === 0 && filas.length > 0) {
        if (!filaVacia) {
            filaVacia = document.createElement("tr");
            filaVacia.className = "fila-vacia";
            filaVacia.innerHTML = "<td colspan='5' style='text-align:center; padding: 30px; color: var(--text-muted);'>No se encontraron solicitudes con los filtros aplicados.</td>";
            tbody.appendChild(filaVacia);
        }
    } else if (filaVacia) {
        filaVacia.remove();
    }
}

/**
 * Actualiza el texto visual dentro del selector de rango de fechas.
 */
function actualizarTextoRangoFechas() {
    const inputTexto = document.querySelector(".date-range-picker input[type='text']");
    const inputInicio = document.querySelector("input[name='fecha_inicio']");
    const inputFin = document.querySelector("input[name='fecha_fin']");
    if (!inputTexto) return;

    const inicio = inputInicio && inputInicio.value ? ymdToDmy(inputInicio.value) : "";
    const fin = inputFin && inputFin.value ? ymdToDmy(inputFin.value) : "";

    if (inicio && fin) {
        inputTexto.value = `${inicio}  –  ${fin}`;
    } else if (inicio) {
        inputTexto.value = `${inicio}  –  DD/MM/AAAA`;
    } else if (fin) {
        inputTexto.value = `DD/MM/AAAA  –  ${fin}`;
    } else {
        inputTexto.value = "XX/YY/ZZZZ  –  AA/BB/CCCC";
    }
}


// =============================================================================
// REQUISITO 3: ACTUALIZAR EL PÁRRAFO DE LA CLASE TITULAR
// =============================================================================
/**
 * Actualiza el <p> de la clase titular calculando las cantidades de solicitudes:
 * X pendientes (enviadas), Y aprobadas, Z en el historial (devueltas).
 * 
 * @param {Array} [solicitudes] - Lista opcional de objetos de solicitud
 */
function actualizarContadorTitular(solicitudes) {
    const pTitular = document.querySelector(".titular p");
    if (!pTitular) return;

    let pendientes = 0;
    let aprobadas = 0;
    let historial = 0;

    if (Array.isArray(solicitudes)) {
        solicitudes.forEach(s => {
            const estado = (s.estado || "").toLowerCase().trim();
            if (estado.includes("enviad")) pendientes++;
            else if (estado.includes("aprobad")) aprobadas++;
            else if (estado.includes("devuelt")) historial++;
        });
    } else {
        const tbody = document.querySelector(".tabla tbody") || document.querySelector("table tbody");
        if (!tbody) return;
        const filas = tbody.querySelectorAll("tr:not(.fila-vacia)");
        filas.forEach(fila => {
            const estado = (fila.dataset.estado || "").toLowerCase().trim();
            if (estado.includes("enviad")) pendientes++;
            else if (estado.includes("aprobad")) aprobadas++;
            else if (estado.includes("devuelt")) historial++;
        });
    }

    pTitular.textContent = `${pendientes} pendientes · ${aprobadas} aprobadas · ${historial} en el historial`;
}


// =============================================================================
// INICIALIZACIÓN AL CARGAR EL DOCUMENTO
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector(".tabla tbody") || document.querySelector("table tbody");
    if (tbody) {
        // Reemplazar las filas existentes en el HTML por la función
        tbody.innerHTML = "";
        SOLICITUDES_INICIALES.forEach(sol => {
            añadirFilaTabla(
                sol.nombreEquipo,
                sol.curso,
                sol.fechas,
                sol.unidadAsignada,
                sol.estado,
                sol.accion
            );
        });
    }

    // Inicializar el conteo del titular (Requisito 3)
    actualizarContadorTitular();

    // Event listener para el select de Estado (Requisito 2)
    const selectEstado = document.querySelector("select[name='estado']");
    if (selectEstado) {
        selectEstado.addEventListener("change", () => {
            filtrarTabla();
        });
    }

    // Event listeners para los inputs de rango de fechas (Requisito 2)
    const inputInicio = document.querySelector("input[name='fecha_inicio']");
    const inputFin = document.querySelector("input[name='fecha_fin']");

    if (inputInicio) {
        inputInicio.addEventListener("change", () => {
            actualizarTextoRangoFechas();
            filtrarTabla();
        });
        inputInicio.addEventListener("input", () => {
            actualizarTextoRangoFechas();
            filtrarTabla();
        });
    }

    if (inputFin) {
        inputFin.addEventListener("change", () => {
            actualizarTextoRangoFechas();
            filtrarTabla();
        });
        inputFin.addEventListener("input", () => {
            actualizarTextoRangoFechas();
            filtrarTabla();
        });
    }

    // Manejar el buscador del header para evitar recargas accidentales
    const formBuscador = document.querySelector(".buscador_top");
    if (formBuscador) {
        formBuscador.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }
});

// Exportar al ámbito global para pruebas y evaluación
window.añadirFilaTabla = añadirFilaTabla;
window.anadirFilaTabla = añadirFilaTabla;
window.agregarFilaTabla = añadirFilaTabla;
window.filtrarTabla = filtrarTabla;
window.actualizarContadorTitular = actualizarContadorTitular;
window.actualizarTextoRangoFechas = actualizarTextoRangoFechas;
window.SOLICITUDES_INICIALES = SOLICITUDES_INICIALES;
