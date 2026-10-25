import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/catalogo/missolicitudes.css";
import useIdentidad from "../useIdentidad.js";
import BotonSalir from "../BotonSalir.jsx";

// =============================================================================
// DATASET INICIAL DE SOLICITUDES
// =============================================================================
const SOLICITUDES_INICIALES = [
  {
    id: 1,
    nombreEquipo: "Osciloscopio TBS1052B",
    curso: "IN324 Laboratorio de Circuitos",
    fechas: "16/09/2026 → 21/09/2026",
    unidadAsignada: "Pendiente de asignar",
    estado: "aprobado",
    accion: "retirar solicitud"
  },
  {
    id: 2,
    nombreEquipo: "Kit de robótica Arduino Mega",
    curso: "IN401 Proyecto Integrador",
    fechas: "18/09/2026 → 25/09/2026",
    unidadAsignada: "Pendiente de asignar",
    estado: "enviada",
    accion: "retirar solicitud"
  },
  {
    id: 3,
    nombreEquipo: "Cámara Canon EOS 90D",
    curso: "CO210 Fotografía Documental",
    fechas: "15/09/2026 → 19/09/2026",
    unidadAsignada: "INV-CAM-0009",
    estado: "aprobada",
    accion: "ver detalle"
  },
  {
    id: 4,
    nombreEquipo: "Multímetro Fluke 117",
    curso: "IN324 Laboratorio de Circuitos",
    fechas: "08/09/2026 → 12/09/2026",
    unidadAsignada: "INV-MUL-0021",
    estado: "entregada",
    accion: "ver constancia"
  },
  {
    id: 5,
    nombreEquipo: "Tableta gráfica Wacom Intuos",
    curso: "DI105 Dibujo Digital",
    fechas: "01/09/2026 → 05/09/2026",
    unidadAsignada: "INV-TAB-0004",
    estado: "devuelta",
    accion: "ver detalle"
  },
  {
    id: 6,
    nombreEquipo: "Analizador de redes portátil",
    curso: "IN352 Redes y Comunicaciones",
    fechas: "27/08/2026 → 03/09/2026",
    unidadAsignada: "—",
    estado: "rechazada",
    accion: "ver motivo"
  },
  {
    id: 7,
    nombreEquipo: "Trípode Manfrotto MT055",
    curso: "CO210 Fotografía Documental",
    fechas: "18/08/2026 → 22/08/2026",
    unidadAsignada: "INV-TRI-0007",
    estado: "devuelta",
    accion: "ver detalle"
  }
];

// =============================================================================
// FUNCIONES AUXILIARES DE FECHAS Y TEXTO
// =============================================================================
function dmyToYmd(dmy) {
  if (!dmy) return "";
  dmy = dmy.trim();
  if (dmy.includes("-")) return dmy;
  const partes = dmy.split("/");
  if (partes.length !== 3) return dmy;
  const [d, m, y] = partes;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function ymdToDmy(ymd) {
  if (!ymd) return "";
  ymd = ymd.trim();
  if (ymd.includes("/")) return ymd;
  const partes = ymd.split("-");
  if (partes.length !== 3) return ymd;
  const [y, m, d] = partes;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

function procesarRangoFechas(fechas) {
  if (typeof fechas === "object" && fechas !== null) {
    return {
      inicio: fechas.inicio || "",
      fin: fechas.fin || fechas.inicio || ""
    };
  }
  const textoLimpio = String(fechas).replace(/<[^>]+>/g, " ");
  const partes = textoLimpio.split(/[→–—\s-]+/).map((s) => s.trim()).filter(Boolean);
  return {
    inicio: partes[0] || "",
    fin: partes[1] || partes[0] || ""
  };
}

function normalizarEstado(estado) {
  const raw = (estado || "").toLowerCase().trim();
  if (raw.includes("enviad")) return { clave: "enviada", label: "Enviada" };
  if (raw.includes("aprobad")) return { clave: "aprobada", label: "Aprobada" };
  if (raw.includes("entregad")) return { clave: "entregada", label: "Entregada" };
  if (raw.includes("devuelt")) return { clave: "devuelta", label: "Devuelta" };
  if (raw.includes("rechazad")) return { clave: "rechazada", label: "Rechazada" };
  return { clave: raw, label: estado || "" };
}

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

function MisSolicitudes() {
  const { rol, nombreCorto, paginaCuenta } = useIdentidad();
  // Lista de solicitudes con persistencia en localStorage
  const [solicitudes, setSolicitudes] = useState(() => {
    try {
      const guardadas = localStorage.getItem("solicitudes_catalogo");
      return guardadas ? JSON.parse(guardadas) : SOLICITUDES_INICIALES;
    } catch {
      return SOLICITUDES_INICIALES;
    }
  });

  // Requisito 1: Función para añadir filas en la tabla
  useEffect(() => {
    const handleAnadir = (nombreEquipo, curso, fechas, unidadAsignada, estado, accion) => {
      const nueva = {
        id: Date.now(),
        nombreEquipo: nombreEquipo || "Equipo sin nombre",
        curso: curso || "",
        fechas: fechas || "01/01/2026 → 05/01/2026",
        unidadAsignada: unidadAsignada || "Pendiente de asignar",
        estado: estado || "enviada",
        accion: accion || "retirar solicitud"
      };
      setSolicitudes((prev) => {
        const actualizadas = [nueva, ...prev];
        try {
          localStorage.setItem("solicitudes_catalogo", JSON.stringify(actualizadas));
        } catch {
          // ignore storage errors
        }
        return actualizadas;
      });
      return nueva;
    };

    window.añadirFilaTabla = handleAnadir;
    window.anadirFilaTabla = handleAnadir;
    window.agregarFilaTabla = handleAnadir;

    return () => {
      delete window.añadirFilaTabla;
      delete window.anadirFilaTabla;
      delete window.agregarFilaTabla;
    };
  }, []);

  // Requisito 2: Filtros interactivos por select "estado" y rango de fechas
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Requisito 3: Conteo del titular
  // "X pendientes (cantidad enviadas) · Y aprobadas (cantidad aprobadas) · Z en el historial (cantidad devueltos)"
  const pendientes = useMemo(() => {
    return solicitudes.filter((s) => (s.estado || "").toLowerCase().includes("enviad")).length;
  }, [solicitudes]);

  const aprobadas = useMemo(() => {
    return solicitudes.filter((s) => (s.estado || "").toLowerCase().includes("aprobad")).length;
  }, [solicitudes]);

  const historial = useMemo(() => {
    return solicitudes.filter((s) => (s.estado || "").toLowerCase().includes("devuelt")).length;
  }, [solicitudes]);

  // Texto simulado en el date range picker
  const textoRangoFechas = useMemo(() => {
    const inicioStr = fechaInicio ? ymdToDmy(fechaInicio) : "";
    const finStr = fechaFin ? ymdToDmy(fechaFin) : "";

    if (inicioStr && finStr) {
      return `${inicioStr}  –  ${finStr}`;
    }
    if (inicioStr) {
      return `${inicioStr}  –  DD/MM/AAAA`;
    }
    if (finStr) {
      return `DD/MM/AAAA  –  ${finStr}`;
    }
    return "XX/YY/ZZZZ  –  AA/BB/CCCC";
  }, [fechaInicio, fechaFin]);

  // Requisito 2: Filtrar filas de la tabla
  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((sol) => {
      // 1. Condición de estado
      const { clave: estadoClave } = normalizarEstado(sol.estado);
      if (filtroEstado !== "todos" && filtroEstado !== "") {
        const estadoNorm = filtroEstado.toLowerCase().trim();
        if (
          estadoClave !== estadoNorm &&
          estadoClave.replace(/a$/, "o") !== estadoNorm.replace(/a$/, "o")
        ) {
          return false;
        }
      }

      // 2. Condición de rango de fechas
      const { inicio: fInicio, fin: fFin } = procesarRangoFechas(sol.fechas);
      const ymdInicio = dmyToYmd(fInicio);
      const ymdFin = dmyToYmd(fFin);

      if (fechaInicio && fechaFin) {
        if (!(ymdInicio >= fechaInicio && ymdFin <= fechaFin)) {
          return false;
        }
      } else if (fechaInicio) {
        if (!(ymdInicio >= fechaInicio)) {
          return false;
        }
      } else if (fechaFin) {
        if (!(ymdFin <= fechaFin)) {
          return false;
        }
      }

      // 3. Condición de búsqueda en header
      if (busqueda.trim() !== "") {
        const q = busqueda.toLowerCase().trim();
        const coincideEquipo = (sol.nombreEquipo || "").toLowerCase().includes(q);
        const coincideCurso = (sol.curso || "").toLowerCase().includes(q);
        const coincideUnidad = (sol.unidadAsignada || "").toLowerCase().includes(q);
        if (!coincideEquipo && !coincideCurso && !coincideUnidad) {
          return false;
        }
      }

      return true;
    });
  }, [solicitudes, filtroEstado, fechaInicio, fechaFin, busqueda]);

  // Requisito 1: Manejo de acciones
  const handleAccion = (sol, e) => {
    e.preventDefault();
    const { esRetirar } = normalizarAccion(sol.accion);

    if (esRetirar) {
      // Retirar solicitud: muestra alerta de confirmación y elimina la fila
      const confirmar = window.confirm("¿Está seguro de que desea retirar esta solicitud?");
      if (confirmar) {
        const nuevasSolicitudes = solicitudes.filter((item) => item !== sol);
        setSolicitudes(nuevasSolicitudes);
        localStorage.setItem("solicitudes_catalogo", JSON.stringify(nuevasSolicitudes));
      }
    } else {
      // Las otras acciones: alerta con lorem ipsum
      alert(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      );
    }
  };

  return (
    <div className="solicitudes-page">
      {/* HEADER */}
      <header>
        <div className="title">
          <div className="square"></div>
          <h2>Almacén de equipos</h2>
        </div>
        <ul>
          <li>
            <Link to="/catalogo" className="rapi_mov">
              Catálogo
            </Link>
          </li>
          <li>
            <Link to="/missolicitudes" className="rapi_mov selected">
              Mis Solicitudes
            </Link>
          </li>
          <li>
            <Link to="/mis-reservas" className="rapi_mov">
              Mis Reservas
            </Link>
          </li>
          <li>
            <Link to="/calendario" className="rapi_mov">
              Calendario
            </Link>
          </li>
        </ul>
        <div className="derecha_div">
          <form className="buscador_top" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              name="codigo"
              placeholder="⌕ Buscar por código de inventario: INV-OSC-0042"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>
          <div className="perfil">
            {rol ? (
              <>
                <h3>{nombreCorto}</h3>
                <Link to={paginaCuenta} className="pfp" title="Mi cuenta" />
                <BotonSalir />
              </>
            ) : (
              <Link to="/login" className="rapi_mov">Iniciar sesión</Link>
            )}
          </div>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="solicitudes-main">
        {/* CABEZAL */}
        <section className="cabezal">
          {/* Requisito 3: Titular con contadores dinámicos */}
          <div className="titular">
            <h1>Mis Solicitudes</h1>
            <p>
              {pendientes} pendientes · {aprobadas} aprobadas · {historial} en el historial
            </p>
          </div>

          {/* Requisito 2: Filtros de Estado y Rango de Fechas */}
          <div className="filtros">
            <div className="select-custom">
              <select
                name="estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="enviada">Enviada</option>
                <option value="aprobada">Aprobada</option>
                <option value="entregada">Entregada</option>
                <option value="devuelta">Devuelta</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>

            <div className="date-range-picker">
              <input type="text" value={textoRangoFechas} readOnly />
              <input
                type="date"
                name="fecha_inicio"
                title="Fecha de inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
              <input
                type="date"
                name="fecha_fin"
                title="Fecha de fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
            </div>
          </div>
        </section>

        {/* Requisito 1: Tabla de Solicitudes */}
        <section className="tabla">
          <table>
            <thead>
              <tr>
                <th>EQUIPO Y CURSO</th>
                <th>FECHAS</th>
                <th>UNIDAD ASIGNADA</th>
                <th>ESTADO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesFiltradas.length === 0 ? (
                <tr className="fila-vacia">
                  <td colSpan={5}>No se encontraron solicitudes con los filtros aplicados.</td>
                </tr>
              ) : (
                solicitudesFiltradas.map((sol, idx) => {
                  const { inicio: fInicio, fin: fFin } = procesarRangoFechas(sol.fechas);
                  const { clave: estadoClave, label: estadoLabel } = normalizarEstado(sol.estado);
                  const { texto: accionTexto, clase: accionClase } = normalizarAccion(sol.accion);
                  const esCodigo = sol.unidadAsignada && sol.unidadAsignada.startsWith("INV-");

                  return (
                    <tr key={sol.id || idx}>
                      <td>
                        <div className="equipo-title">
                          {sol.nombreEquipo || "Equipo sin nombre"}
                        </div>
                        <div className="equipo-sub">{sol.curso || ""}</div>
                      </td>
                      <td className="col-fecha">
                        {fInicio} <span>→</span> {fFin}
                      </td>
                      <td className={esCodigo ? "col-codigo" : "text-muted"}>
                        {sol.unidadAsignada || "—"}
                      </td>
                      <td>
                        <span className={`badge badge-${estadoClave}`}>{estadoLabel}</span>
                      </td>
                      <td>
                        <a
                          href="#"
                          className={`btn-action ${accionClase}`}
                          onClick={(e) => handleAccion(sol, e)}
                        >
                          {accionTexto}
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <h2>Almacén de Equipos · Facultad de Ingeniería</h2>
        <section className="info_f">
          <a href="#">Reglamento de Prestamo</a>
          <p>almacen.equipos@ulima.edu.pe</p>
          <p>Anexo 3120</p>
        </section>
      </footer>
    </div>
  );
}

export default MisSolicitudes;