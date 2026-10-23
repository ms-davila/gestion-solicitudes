
// =============================================================================
// 1. DATASET DE PRODUCTOS (CATÁLOGO DE INVENTARIO)
// =============================================================================
const CATALOGO_PRODUCTOS = [
    {
        id: "INV-MED-0001",
        foto: "",
        nombre: "Osciloscopio Digital 100MHz 4 Canales",
        categoria: "Medición",
        marca: "Tektronix",
        modelo: "TBS1052B",
        disponible: 4,
        existente: 6
    },
    {
        id: "INV-ROB-0002",
        foto: "",
        nombre: "Brazo Robótico Educativo 6DOF",
        categoria: "Robótica",
        marca: "Dobot",
        modelo: "Magician",
        disponible: 2,
        existente: 4
    },
    {
        id: "INV-COM-0003",
        foto: "",
        nombre: "Laptop Workstation i7 32GB RAM",
        categoria: "Cómputo",
        marca: "Dell",
        modelo: "Precision 5570",
        disponible: 5,
        existente: 8
    },
    {
        id: "INV-ROB-0004",
        foto: "",
        nombre: "Kit de Desarrollo Arduino Uno R3",
        categoria: "Robótica",
        marca: "Arduino",
        modelo: "Starter Kit V2",
        disponible: 10,
        existente: 12
    },
    {
        id: "INV-MED-0005",
        foto: "",
        nombre: "Multímetro Digital True-RMS",
        categoria: "Medición",
        marca: "Fluke",
        modelo: "115",
        disponible: 8,
        existente: 10
    },
    {
        id: "INV-RED-0006",
        foto: "",
        nombre: "Switch Gestionable Gigabit 24 Puertos",
        categoria: "Redes",
        marca: "Cisco",
        modelo: "Catalyst 2960-X",
        disponible: 3,
        existente: 5
    },
    {
        id: "INV-AUD-0007",
        foto: "",
        nombre: "Cámara Réflex Digital 4K",
        categoria: "Audiovisual",
        marca: "Sony",
        modelo: "Alpha a6400",
        disponible: 2,
        existente: 3
    },
    {
        id: "INV-AUD-0008",
        foto: "",
        nombre: "Proyector Láser Interactivo Full HD",
        categoria: "Audiovisual",
        marca: "Epson",
        modelo: "PowerLite L530U",
        disponible: 1,
        existente: 2
    },
    {
        id: "INV-MED-0009",
        foto: "",
        nombre: "Generador de Funciones Arbitrarias 25MHz",
        categoria: "Medición",
        marca: "Rigol",
        modelo: "DG1022Z",
        disponible: 3,
        existente: 4
    },
    {
        id: "INV-FIS-0010",
        foto: "",
        nombre: "Pista de Aire para Experimentos de Dinámica",
        categoria: "Laboratorio de Física",
        marca: "PASCO",
        modelo: "ME-9493",
        disponible: 4,
        existente: 6
    },
    {
        id: "INV-RED-0011",
        foto: "",
        nombre: "Router Inalámbrico Wi-Fi 6 AX5400",
        categoria: "Redes",
        marca: "TP-Link",
        modelo: "Archer AX73",
        disponible: 5,
        existente: 5
    },
    {
        id: "INV-ROB-0012",
        foto: "",
        nombre: "Estación de Soldadura Digital ESD",
        categoria: "Robótica",
        marca: "Weller",
        modelo: "WE1010",
        disponible: 6,
        existente: 8
    },
    {
        id: "INV-AUD-0013",
        foto: "",
        nombre: "Micrófono Inalámbrico de Solapa Dual",
        categoria: "Audiovisual",
        marca: "Rode",
        modelo: "Wireless GO II",
        disponible: 4,
        existente: 4
    },
    {
        id: "INV-FIS-0014",
        foto: "",
        nombre: "Péndulo Físico Demostrativo",
        categoria: "Laboratorio de Física",
        marca: "Phywe",
        modelo: "Pendulum 02",
        disponible: 1,
        existente: 1
    },
    {
        id: "INV-COM-0015",
        foto: "",
        nombre: "Mini PC Workstation Core i7 12va Gen",
        categoria: "Cómputo",
        marca: "Intel",
        modelo: "NUC 12 Pro",
        disponible: 6,
        existente: 6
    },
    {
        id: "INV-MED-0016",
        foto: "",
        nombre: "Analizador de Espectro RF 1.5GHz",
        categoria: "Medición",
        marca: "Siglent",
        modelo: "SSA3021X",
        disponible: 0,
        existente: 2
    },
    {
        id: "INV-ROB-0017",
        foto: "",
        nombre: "Robot Móvil Autónomo con LiDAR y ROS2",
        categoria: "Robótica",
        marca: "TurtleBot",
        modelo: "TurtleBot 4",
        disponible: 0,
        existente: 2
    },
    {
        id: "INV-RED-0018",
        foto: "",
        nombre: "Punto de Acceso PoE Wi-Fi 6 Mesh",
        categoria: "Redes",
        marca: "Ubiquiti",
        modelo: "UniFi U6-Mesh",
        disponible: 3,
        existente: 4
    },
    {
        id: "INV-FIS-0019",
        foto: "",
        nombre: "Kit de Sensores Inalámbricos de Fuerza y Movimiento",
        categoria: "Laboratorio de Física",
        marca: "PASCO",
        modelo: "Wireless Sensor Kit",
        disponible: 5,
        existente: 5
    },
    {
        id: "INV-COM-0020",
        foto: "",
        nombre: "Tableta Gráfica Digitalizadora Profesional",
        categoria: "Cómputo",
        marca: "Wacom",
        modelo: "Intuos Pro M",
        disponible: 4,
        existente: 5
    }
];

// Constantes y estado global
const ITEMS_POR_PAGINA = 8;
let paginaActual = 1;
let productosFiltrados = [...CATALOGO_PRODUCTOS];


// =============================================================================
// REQUISITO 1: FUNCIÓN PARA CREAR Y DESPLEGAR "card_producto"
// =============================================================================
/**
 * Crea y retorna el elemento HTML para un artículo tipo card_producto.
 * Reemplaza los placeholders del HTML original.
 * 
 * @param {string|Object} foto - URL o texto de imagen (o un objeto de producto completo)
 * @param {string} [nombre] - Nombre del producto
 * @param {string} [categoria] - Categoría del producto
 * @param {string} [marcaModelo] - Marca y modelo (ej. "Tektronix · TBS1052B")
 * @param {number|string} [disponible] - Unidades disponibles libres
 * @param {number|string} [existente] - Unidades existentes totales
 * @returns {HTMLElement} Elemento article.card_producto
 */
function crearCardProducto(foto, nombre, categoria, marcaModelo, disponible, existente) {
    // Si se pasa un objeto producto como único argumento:
    if (typeof foto === "object" && foto !== null) {
        const item = foto;
        foto = item.foto;
        nombre = item.nombre;
        categoria = item.categoria;
        marcaModelo = item.marcaModelo || `${item.marca || ""} · ${item.modelo || ""}`.replace(/^ · | · $/g, "");
        disponible = item.disponible;
        existente = item.existente;
    }

    const article = document.createElement("article");
    article.className = "card_producto";

    // 1. Imagen del producto
    const divImagen = document.createElement("div");
    divImagen.className = "card_imagen";

    if (foto && typeof foto === "string" && (foto.startsWith("http") || foto.includes("/") || foto.includes("."))) {
        const img = document.createElement("img");
        img.src = foto;
        img.alt = nombre || "Equipo";
        divImagen.appendChild(img);
    } else {
        const spanFoto = document.createElement("span");
        spanFoto.textContent = (typeof foto === "string" && foto.trim() !== "") ? foto : "foto 1:1";
        divImagen.appendChild(spanFoto);
    }

    // 2. Contenido de la tarjeta
    const divContenido = document.createElement("div");
    divContenido.className = "card_contenido";

    const h3Titulo = document.createElement("h3");
    h3Titulo.className = "card_titulo";
    h3Titulo.textContent = nombre || "Nombre de objeto";

    const pSubtitulo = document.createElement("p");
    pSubtitulo.className = "card_subtitulo";
    pSubtitulo.textContent = marcaModelo || "Marca · Modelo";

    // 3. Footer con categoría y unidades
    const divFooter = document.createElement("div");
    divFooter.className = "card_footer";

    const spanCategoria = document.createElement("span");
    spanCategoria.className = "badge_categoria";
    spanCategoria.textContent = (categoria || "CATEGORIA").toUpperCase();

    const spanUnidades = document.createElement("span");
    spanUnidades.className = "unidades_disponibles";
    const numDisp = Number(disponible) || 0;
    const numExist = Number(existente) || 0;

    if (numDisp === 0) {
        spanUnidades.classList.add("sin_unidades");
    }
    spanUnidades.innerHTML = `<b>${numDisp}</b> / ${numExist} libres`;

    divFooter.appendChild(spanCategoria);
    divFooter.appendChild(spanUnidades);

    divContenido.appendChild(h3Titulo);
    divContenido.appendChild(pSubtitulo);
    divContenido.appendChild(divFooter);

    article.appendChild(divImagen);
    article.appendChild(divContenido);

    return article;
}

/**
 * Despliega un producto agregándolo directamente al contenedor del inventario.
 */
function desplegarCardProducto(foto, nombre, categoria, marcaModelo, disponible, existente, contenedor) {
    const card = crearCardProducto(foto, nombre, categoria, marcaModelo, disponible, existente);
    const target = contenedor || document.querySelector(".inventario");
    if (target) {
        target.appendChild(card);
    }
    return card;
}


// =============================================================================
// REQUISITO 2: PAGINACIÓN (8 PRODUCTOS POR PÁGINA)
// =============================================================================
/**
 * Renderiza la página indicada mostrando un máximo de 8 productos.
 * Actualiza tanto los artículos en .inventario como los controles en .pags.
 * 
 * @param {number} numeroPagina - Página a visualizar
 */
function renderizarPagina(numeroPagina) {
    const totalItems = productosFiltrados.length;
    const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA) || 1;

    // Validación de límites de página
    if (numeroPagina < 1) numeroPagina = 1;
    if (numeroPagina > totalPaginas) numeroPagina = totalPaginas;
    paginaActual = numeroPagina;

    const inventario = document.querySelector(".inventario");
    if (!inventario) return;

    // Limpiar tarjetas previas
    inventario.innerHTML = "";

    if (totalItems === 0) {
        const pVacio = document.createElement("p");
        pVacio.className = "sin_resultados";
        pVacio.textContent = "No se encontraron equipos disponibles con los filtros seleccionados.";
        inventario.appendChild(pVacio);
    } else {
        const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
        const fin = Math.min(inicio + ITEMS_POR_PAGINA, totalItems);
        const grupo = productosFiltrados.slice(inicio, fin);

        grupo.forEach(prod => {
            const marcaModelo = prod.marcaModelo || `${prod.marca || ""} · ${prod.modelo || ""}`.replace(/^ · | · $/g, "");
            const card = crearCardProducto(prod.foto, prod.nombre, prod.categoria, marcaModelo, prod.disponible, prod.existente);
            inventario.appendChild(card);
        });
    }

    // Actualizar controles de paginación
    actualizarControlesPaginacion(totalItems, totalPaginas, paginaActual);
}

/**
 * Ajusta los botones numéricos, las flechas y el texto de paginación
 * reemplazando "X", "Y" y "Z" por los números reales.
 */
function actualizarControlesPaginacion(totalItems, totalPaginas, paginaActual) {
    const pagsSection = document.querySelector(".pags");
    if (!pagsSection) return;

    // 1. Ajustar el párrafo "Mostrando X a Y de Z equipos"
    const pInfo = pagsSection.querySelector("p");
    if (pInfo) {
        if (totalItems === 0) {
            pInfo.textContent = "Mostrando 0 a 0 de 0 equipos";
        } else {
            const x = (paginaActual - 1) * ITEMS_POR_PAGINA + 1;
            const y = Math.min(paginaActual * ITEMS_POR_PAGINA, totalItems);
            const z = totalItems;
            pInfo.textContent = `Mostrando ${x} a ${y} de ${z} equipos`;
        }
    }

    // 2. Modificar los botones dentro del nav
    const nav = pagsSection.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = "";

    // Flecha anterior (<)
    const btnPrev = document.createElement("button");
    btnPrev.innerHTML = "&lt;";
    btnPrev.setAttribute("aria-label", "Página anterior");
    btnPrev.title = "Página anterior";
    if (paginaActual <= 1 || totalItems === 0) {
        btnPrev.disabled = true;
    } else {
        btnPrev.addEventListener("click", () => renderizarPagina(paginaActual - 1));
    }
    nav.appendChild(btnPrev);

    // Botones numerados según la cantidad de grupos/páginas existentes
    for (let i = 1; i <= totalPaginas; i++) {
        const btnNum = document.createElement("button");
        btnNum.textContent = i;
        if (i === paginaActual) {
            btnNum.classList.add("enpag");
        }
        btnNum.addEventListener("click", () => {
            if (i !== paginaActual) {
                renderizarPagina(i);
            }
        });
        nav.appendChild(btnNum);
    }

    // Flecha siguiente (>)
    const btnNext = document.createElement("button");
    btnNext.innerHTML = "&gt;";
    btnNext.setAttribute("aria-label", "Página siguiente");
    btnNext.title = "Página siguiente";
    if (paginaActual >= totalPaginas || totalItems === 0) {
        btnNext.disabled = true;
    } else {
        btnNext.addEventListener("click", () => renderizarPagina(paginaActual + 1));
    }
    nav.appendChild(btnNext);
}


// =============================================================================
// REQUISITO 3: GESTIÓN DE FILTROS, CHIPS EN "lista_filtros" Y "LIMPIAR TODO"
// =============================================================================
/**
 * Normaliza cadenas quitando tildes y pasando a minúsculas.
 */
function normalizar(texto) {
    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/**
 * Compara si una categoría de producto coincide con el filtro del Aside.
 */
function coincideCategoria(catProducto, valInput, idInput, textoLabel) {
    const cProd = normalizar(catProducto);
    const cVal = normalizar(valInput);
    const cId = normalizar(idInput);
    const cLbl = normalizar(textoLabel);

    if (cProd === cVal || cProd === cId || cProd === cLbl) return true;
    if ((cId === "labfis" || cVal === "labfis") && (cProd.includes("fisica") || cProd.includes("labfis"))) {
        return true;
    }
    return false;
}

/**
 * Lee los filtros actualmente marcados en el Aside.
 */
function leerFiltrosDelAside() {
    // Categorías seleccionadas (checkboxes)
    const checkboxes = document.querySelectorAll("aside.buscador input[type='checkbox']:checked");
    const categorias = [];
    checkboxes.forEach(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`) || cb.nextElementSibling;
        const nombreVisible = label ? label.textContent.replace(/\s*\(\d+\)$/, "").trim() : cb.value;
        categorias.push({
            id: cb.id,
            valor: cb.value,
            nombre: nombreVisible
        });
    });

    // Disponibilidad (radios)
    const dispoRadio = document.querySelector("input[name='dispo']:checked");
    const dispo = dispoRadio ? dispoRadio.value : "todos";

    // Duración máxima (radios)
    const duracRadio = document.querySelector("input[name='durac']:checked");
    const durac = duracRadio ? duracRadio.value : "99";

    return { categorias, dispo, durac };
}

/**
 * Aplica los filtros seleccionados en el Aside, genera los chips en "lista_filtros"
 * y actualiza la lista de productos desplegada.
 */
function aplicarFiltros() {
    const { categorias, dispo, durac } = leerFiltrosDelAside();

    // 1. Mostrar chips en "lista_filtros"
    renderizarChipsFiltros(categorias, dispo, durac);

    // 2. Filtrar el conjunto de productos
    productosFiltrados = CATALOGO_PRODUCTOS.filter(prod => {
        // Filtro por Categoría
        if (categorias.length > 0) {
            const coincide = categorias.some(cat =>
                coincideCategoria(prod.categoria, cat.valor, cat.id, cat.nombre)
            );
            if (!coincide) return false;
        }

        // Filtro por Disponibilidad
        if (dispo === "UniLibres") {
            if (prod.disponible <= 0) return false;
        }

        // Filtro por Duración:
        // Según especificación, todos los productos cuentan para todas las duraciones
        return true;
    });

    // 3. Reiniciar a página 1 y renderizar
    paginaActual = 1;
    renderizarPagina(paginaActual);

    // 4. Actualizar encabezado del catálogo según requisito 5
    actualizarTextoCatalogo(durac);
}

/**
 * Renderiza los filtros seleccionados como cuadrados azul claro con texto azul
 * y una 'X' interactiva para quitarlos en section.lista_filtros.
 */
function renderizarChipsFiltros(categorias, dispo, durac) {
    const contenedor = document.querySelector(".lista_filtros");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Chips para categorías
    categorias.forEach(cat => {
        const chip = crearChipElemento(cat.nombre, () => {
            const cb = document.getElementById(cat.id);
            if (cb) cb.checked = false;
            aplicarFiltros();
        });
        contenedor.appendChild(chip);
    });

    // Chip para disponibilidad ("Unidades Libres")
    if (dispo === "UniLibres") {
        const chip = crearChipElemento("Unidades Libres", () => {
            const radioTodos = document.getElementById("todos");
            if (radioTodos) radioTodos.checked = true;
            aplicarFiltros();
        });
        contenedor.appendChild(chip);
    }

    // Chip para duración (si se eligió una restricción de 7 o 15 días)
    if (durac === "7" || durac === "15") {
        const chip = crearChipElemento(`Hasta ${durac} días`, () => {
            const radioSinLimit = document.getElementById("sinlimit");
            if (radioSinLimit) radioSinLimit.checked = true;
            aplicarFiltros();
        });
        contenedor.appendChild(chip);
    }
}

/**
 * Crea un chip (cuadrado azul claro con texto azul y botón 'X').
 */
function crearChipElemento(texto, onEliminar) {
    const div = document.createElement("div");
    div.className = "filtro_chip";

    const span = document.createElement("span");
    span.textContent = texto;

    const btnX = document.createElement("button");
    btnX.className = "chip_x";
    btnX.innerHTML = "&times;";
    btnX.type = "button";
    btnX.setAttribute("aria-label", `Eliminar filtro ${texto}`);
    btnX.title = `Eliminar filtro ${texto}`;
    btnX.addEventListener("click", onEliminar);

    div.appendChild(span);
    div.appendChild(btnX);

    return div;
}

/**
 * Limpia todos los filtros marcados, vacía "lista_filtros"
 * y restaura el catálogo completo.
 */
function limpiarTodosLosFiltros() {
    // Desmarcar todos los checkboxes
    const checkboxes = document.querySelectorAll("aside.buscador input[type='checkbox']");
    checkboxes.forEach(cb => {
        cb.checked = false;
    });

    // Restablecer radios
    const radioTodos = document.getElementById("todos");
    if (radioTodos) radioTodos.checked = true;

    const radioSinLimit = document.getElementById("sinlimit");
    if (radioSinLimit) radioSinLimit.checked = true;

    // Vaciar lista_filtros
    const contenedor = document.querySelector(".lista_filtros");
    if (contenedor) contenedor.innerHTML = "";

    // Restablecer dataset completo
    productosFiltrados = [...CATALOGO_PRODUCTOS];
    paginaActual = 1;
    renderizarPagina(paginaActual);

    // Actualizar encabezado a sin límites
    actualizarTextoCatalogo("99");
}


// =============================================================================
// REQUISITO 4: CANTIDAD DE PRODUCTOS EN CADA FILTRO DE CATEGORÍA
// =============================================================================
/**
 * Añade y actualiza la cantidad de productos que pertenecen a cada categoría
 * en su respectivo label en el Aside (ej: "Robótica (4)").
 * 
 * @param {Array} productos - Conjunto de productos sobre el cual contabilizar
 */
function actualizarConteoCategorias(productos = CATALOGO_PRODUCTOS) {
    const checkboxes = document.querySelectorAll("aside.buscador input[type='checkbox']");
    checkboxes.forEach(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`) || cb.nextElementSibling;
        if (!label) return;

        // Guardar el texto original limpio
        if (!label.dataset.originalText) {
            label.dataset.originalText = label.textContent.replace(/\s*\(\d+\)$/, "").trim();
        }
        const textoBase = label.dataset.originalText;

        // Contar coincidencias en el catálogo
        const cantidad = productos.filter(p =>
            coincideCategoria(p.categoria, cb.value, cb.id, textoBase)
        ).length;

        label.innerHTML = `${textoBase} <span class="contador_categoria">(${cantidad})</span>`;
    });
}


// =============================================================================
// REQUISITO 5: ACTUALIZACIÓN DEL RESUMEN EN EL <p> DE .catalogo
// =============================================================================
/**
 * Muestra la cantidad de productos disponibles en el <p> de la clase "catalogo",
 * reemplazando X con la cantidad de productos disponibles para dicha duración
 * e Y con la duración seleccionada. Como no se definen las duraciones,
 * todos los productos cuentan para todas las duraciones.
 * 
 * @param {string|number} [duracion] - Duración seleccionada ("7", "15", "99")
 */
function actualizarTextoCatalogo(duracion) {
    const pCatalogo = document.querySelector(".catalogo > p");
    if (!pCatalogo) return;

    if (!duracion) {
        const duracRadio = document.querySelector("input[name='durac']:checked");
        duracion = duracRadio ? duracRadio.value : "7";
    }

    // Cantidad de productos con unidades libres (disponible > 0)
    const cantidadLibres = productosFiltrados.filter(p => p.disponible > 0).length;

    if (duracion === "99" || duracion === "sinlimit") {
        pCatalogo.textContent = `${cantidadLibres} equipos con unidades libres sin límite de días`;
    } else {
        pCatalogo.textContent = `${cantidadLibres} equipos con unidades libres de hasta ${duracion} días`;
    }
}


// =============================================================================
// INICIALIZACIÓN AL CARGAR EL DOCUMENTO
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Mostrar la cantidad de productos por categoría en el Aside (Requisito 4)
    actualizarConteoCategorias(CATALOGO_PRODUCTOS);

    // 2. Actualizar el párrafo del encabezado del catálogo (Requisito 5)
    actualizarTextoCatalogo();

    // 3. Renderizar la primera página de 8 productos (Requisitos 1 y 2)
    renderizarPagina(1);

    // 4. Asignar evento al botón "Aplicar Filtros" (Requisito 3)
    const btnAplicar = document.querySelector(".aplicarf");
    if (btnAplicar) {
        btnAplicar.addEventListener("click", (e) => {
            e.preventDefault();
            aplicarFiltros();
        });
    }

    // 5. Asignar evento al botón "Limpiar Todo" (Requisito 3)
    const btnLimpiar = document.querySelector(".limpiar");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", (e) => {
            e.preventDefault();
            limpiarTodosLosFiltros();
        });
    }

    // 6. Manejar el buscador del header para evitar recargas accidentales
    const formBuscador = document.querySelector(".buscador_top");
    if (formBuscador) {
        formBuscador.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = formBuscador.querySelector("input[type='search']");
            if (!input) return;
            const query = normalizar(input.value);

            if (query === "") {
                aplicarFiltros();
                return;
            }

            // Filtrar sobre productosFiltrados o catálogo
            productosFiltrados = CATALOGO_PRODUCTOS.filter(prod => {
                const idNorm = normalizar(prod.id);
                const nombreNorm = normalizar(prod.nombre);
                const marcaNorm = normalizar(prod.marca);
                const modeloNorm = normalizar(prod.modelo);

                return idNorm.includes(query) || nombreNorm.includes(query) ||
                       marcaNorm.includes(query) || modeloNorm.includes(query);
            });

            paginaActual = 1;
            renderizarPagina(paginaActual);
            actualizarTextoCatalogo();
        });
    }
});

// Exportar al objeto global window para permitir pruebas automatizadas o uso externo
window.CATALOGO_PRODUCTOS = CATALOGO_PRODUCTOS;
window.crearCardProducto = crearCardProducto;
window.desplegarCardProducto = desplegarCardProducto;
window.renderizarPagina = renderizarPagina;
window.actualizarControlesPaginacion = actualizarControlesPaginacion;
window.aplicarFiltros = aplicarFiltros;
window.limpiarTodosLosFiltros = limpiarTodosLosFiltros;
window.actualizarConteoCategorias = actualizarConteoCategorias;
window.actualizarTextoCatalogo = actualizarTextoCatalogo;
window.leerFiltrosDelAside = leerFiltrosDelAside;
