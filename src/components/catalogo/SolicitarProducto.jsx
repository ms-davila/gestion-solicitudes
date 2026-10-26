import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/catalogo/solicitarproducto.css";
import useIdentidad from "../useIdentidad.js";
import BotonSalir from "../compartidos/BotonSalir.jsx";

// =============================================================================
// UTILIDADES PARA CÁLCULO DE FECHAS
// =============================================================================
/**
 * Calcula la diferencia en días calendario entre dos fechas (YYYY-MM-DD).
 * No permite valores negativos (mínimo 0).
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

  // No permite números negativos
  return Math.max(0, dias);
}

/**
 * Convierte YYYY-MM-DD a formato legible DD/MM/YYYY
 */
function formatearFechaLegible(fechaYmd) {
  if (!fechaYmd || !fechaYmd.includes("-")) return fechaYmd || "";
  const [y, m, d] = fechaYmd.split("-");
  return `${d}/${m}/${y}`;
}

const DEFAULT_PRODUCTO = {
  id: "INV-MED-0001",
  nombre: "Osciloscopio Digital 100MHz 4 Canales",
  marca: "Tektronix",
  modelo: "TBS1052B",
  disponible: 4,
  existente: 6
};

function SolicitarProducto({ duracionMaxima = 7, productoInicial = null }) {
  const { rol, nombreCorto, paginaCuenta } = useIdentidad();
  const location = useLocation();
  const navigate = useNavigate();

  // Producto recibido por navegación o valor predeterminado
  const producto = location.state?.producto || productoInicial || DEFAULT_PRODUCTO;
  const reservaOrigen = location.state?.reserva || null;

  // Requisito 1: Fechas y duración máxima (Y configurable vía prop o desde JS)
  const [duracionMaximaY, setDuracionMaximaY] = useState(() => {
    return typeof duracionMaxima === "number" && duracionMaxima > 0 ? duracionMaxima : 7;
  });

  useEffect(() => {
    window.establecerDuracionMaxima = (nuevoY) => {
      const num = Number(nuevoY);
      if (!isNaN(num) && num > 0) {
        setDuracionMaximaY(num);
        return num;
      }
      return duracionMaximaY;
    };
    window.setDuracionMaxima = window.establecerDuracionMaxima;
    window.setY = window.establecerDuracionMaxima;
    window.calcularDiasEntreFechas = calcularDiasEntreFechas;

    return () => {
      delete window.establecerDuracionMaxima;
      delete window.setDuracionMaxima;
      delete window.setY;
      delete window.calcularDiasEntreFechas;
    };
  }, [duracionMaximaY]);

  const [fechaInicio, setFechaInicio] = useState(
    reservaOrigen?.inicio || "2026-09-16"
  );

  const [fechaDevolucion, setFechaDevolucion] = useState(
    reservaOrigen?.fin || "2026-09-21"
  );

  // Campos adicionales del formulario
  const [curso, setCurso] = useState(
    "IN324 Laboratorio de Circuitos Electrónicos - Ing. Elena Rivas"
  );
  const [motivo, setMotivo] = useState("");

  // Requisito 3: Checkbox "Acepto las condiciones del préstamo"
  const [aceptoCondiciones, setAceptoCondiciones] = useState(false);

  // Requisito 1: Cálculo automático de la duración X
  const diasX = useMemo(() => {
    return calcularDiasEntreFechas(fechaInicio, fechaDevolucion);
  }, [fechaInicio, fechaDevolucion]);

  const textoDuracion = `${diasX} de ${duracionMaximaY} días`;

  // Requisito 2 y 3: Control y bloqueo del botón "btn-enviar"
  // 1. Fechas inválidas: X < 1 o X > Y
  const fechasInvalidas = diasX < 1 || diasX > duracionMaximaY;
  // 2. Bloqueado si fechas inválidas O hasta que se presione el checkbox
  const botonBloqueado = fechasInvalidas || !aceptoCondiciones;

  // Mensaje de ayuda / tooltip contextual según el motivo de bloqueo
  const tooltipBoton = useMemo(() => {
    if (diasX < 1) {
      return "La fecha de devolución debe ser posterior a la fecha de inicio (mínimo 1 día).";
    }
    if (diasX > duracionMaximaY) {
      return `La duración seleccionada (${diasX} días) supera el límite máximo de ${duracionMaximaY} días.`;
    }
    if (!aceptoCondiciones) {
      return "Debe aceptar las condiciones del préstamo para poder enviar la solicitud.";
    }
    return "Enviar solicitud de préstamo";
  }, [diasX, duracionMaximaY, aceptoCondiciones]);

  // Manejo de envío
    const handleEnviar = (e) => {
    e.preventDefault();

    if (botonBloqueado) return;

    let reservasActuales = [];

    if (reservaOrigen) {
      try {
        const datos = JSON.parse(
          localStorage.getItem("reservasH6") || "[]"
        );

        reservasActuales = Array.isArray(datos) ? datos : [];
      } catch {
        alert("No se pudieron verificar los datos de la reserva.");
        return;
      }

      const reservaValida = reservasActuales.find(
        (reserva) =>
          reserva.id === reservaOrigen.id &&
          reserva.estado === "Confirmada" &&
          !reserva.solicitudId &&
          reserva.estudianteCorreo ===
            (sessionStorage.getItem("sesion") ||
              localStorage.getItem("sesion")) &&
          reserva.inicio === fechaInicio &&
          reserva.fin === fechaDevolucion
      );

      if (!reservaValida) {
        alert(
          "Esta reserva ya fue utilizada, fue cancelada o sus datos cambiaron."
        );
        return;
      }

      const [anio, mes, dia] = reservaValida.inicio
        .split("-")
        .map(Number);

      const fechaReservaUTC = Date.UTC(anio, mes - 1, dia);
      const hoy = new Date();
      const hoyUTC = Date.UTC(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
      );

      const diasRestantes = Math.round(
        (fechaReservaUTC - hoyUTC) / 86400000
      );

      if (diasRestantes < 0 || diasRestantes > 2) {
        alert(
          "Puedes solicitar el préstamo desde 2 días antes del inicio de la reserva."
        );
        return;
      }
    }

    const idSolicitud = Date.now();

    const nuevaSolicitud = {
      id: idSolicitud,
      nombreEquipo: `${producto.nombre} ${producto.modelo || ""}`.trim(),
      curso: curso.split(" - ")[0] || curso,
      fechas: `${formatearFechaLegible(fechaInicio)} → ${formatearFechaLegible(fechaDevolucion)}`,
      unidadAsignada: "Pendiente de asignar",
      estado: "enviada",
      accion: "retirar solicitud",
      reservaId: reservaOrigen?.id || null,
      estudianteCorreo:
        sessionStorage.getItem("sesion") ||
        localStorage.getItem("sesion") ||
        null,
    };

    try {
      const datos = JSON.parse(
        localStorage.getItem("solicitudes_catalogo") || "[]"
      );

      const solicitudesActuales = Array.isArray(datos)
        ? datos
        : [];

      if (
        reservaOrigen &&
        solicitudesActuales.some(
          (solicitud) => solicitud.reservaId === reservaOrigen.id
        )
      ) {
        alert("Ya existe una solicitud para esta reserva.");
        return;
      }

      localStorage.setItem(
        "solicitudes_catalogo",
        JSON.stringify([nuevaSolicitud, ...solicitudesActuales])
      );

      if (reservaOrigen) {
        const nuevasReservas = reservasActuales.map((reserva) =>
          reserva.id === reservaOrigen.id
            ? { ...reserva, solicitudId: idSolicitud }
            : reserva
        );

        localStorage.setItem(
          "reservasH6",
          JSON.stringify(nuevasReservas)
        );
      }

      alert("¡Solicitud de préstamo enviada exitosamente!");
      navigate("/missolicitudes");
    } catch (error) {
      console.error("Error al registrar la solicitud:", error);
      alert("No se pudo registrar la solicitud.");
    }
  };


  const fechaDevolucionTexto = formatearFechaLegible(fechaDevolucion) || "XX/YY/ZZZZ";

  return (
    <div className="prestamo-page">
      {/* HEADER */}
      <header>
        <div className="title">
          <div className="square"></div>
          <h2>Almacén de equipos</h2>
        </div>
        <ul>
          <li>
            <Link to="/catalogo" className="rapi_mov selected">
              Catálogo
            </Link>
          </li>
          <li>
            <Link to="/missolicitudes" className="rapi_mov">
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
      <main className="prestamo-main">
        {/* CABEZAL */}
        <section className="cabezal">
          <div className="titular">
            <p>
              <Link to="/catalogo">Catálogo</Link> / {producto.nombre || "Producto XX"} / Solicitar préstamo
            </p>
            <h1>Solicitar Préstamo</h1>
          </div>
        </section>

        {/* SECCIÓN DE DATOS Y ASIDE */}
        <section className="datos">
          <article className="articulo-prestamo">
            <form className="form-prestamo" onSubmit={handleEnviar}>
              {/* SECCIÓN FECHAS */}
              <div className="form-section">
                <h3 className="section-subtitle">FECHAS DEL PRÉSTAMO</h3>
                <div className="grid-fechas">
                  <div className="form-group">
                    <label htmlFor="fecha-inicio">FECHA DE INICIO</label>
                    <input
                      type="date"
                      id="fecha-inicio"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fecha-devolucion">FECHA DE DEVOLUCIÓN</label>
                    <input
                      type="date"
                      id="fecha-devolucion"
                      value={fechaDevolucion}
                      onChange={(e) => setFechaDevolucion(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duracion">DURACIÓN</label>
                    {/* Requisito 1: input duración actualizado automáticamente */}
                    <input
                      type="text"
                      id="duracion"
                      value={textoDuracion}
                      readOnly
                      className="input-duracion"
                    />
                  </div>
                </div>
                <span className="field-help">
                  La duración máxima de este equipo es de {duracionMaximaY} días calendario.
                </span>
              </div>

              {/* SECCIÓN JUSTIFICACIÓN */}
              <div className="form-section">
                <h3 className="section-subtitle">JUSTIFICACIÓN</h3>

                <div className="form-group">
                  <label htmlFor="curso">CURSO ASOCIADO</label>
                  <select
                    id="curso"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                  >
                    <option value="IN324 Laboratorio de Circuitos Electrónicos - Ing. Elena Rivas">
                      IN324 Laboratorio de Circuitos Electrónicos - Ing. Elena Rivas
                    </option>
                    <option value="IN401 Proyecto Integrador - Ing. Carlos Soto">
                      IN401 Proyecto Integrador - Ing. Carlos Soto
                    </option>
                    <option value="CO210 Fotografía Documental - Lic. Ana Gómez">
                      CO210 Fotografía Documental - Lic. Ana Gómez
                    </option>
                    <option value="DI105 Dibujo Digital - Arq. Marcos Paz">
                      DI105 Dibujo Digital - Arq. Marcos Paz
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="motivo">MOTIVO DE LA SOLICITUD</label>
                  <textarea
                    id="motivo"
                    rows="4"
                    placeholder="Ingrese motivo..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  ></textarea>
                  <span className="field-help">
                    Mínimo 20 caracteres. El encargado lo verá al evaluar tu solicitud.
                  </span>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="form-actions">
                <Link to="/catalogo" className="btn-cancelar">
                  Cancelar
                </Link>
                {/* Requisito 2 y 3: botón deshabilitado / gris cuando inválido o sin aceptar condiciones */}
                <button
                  type="submit"
                  className={`btn-enviar ${botonBloqueado ? "disabled" : ""}`}
                  disabled={botonBloqueado}
                  title={tooltipBoton}
                >
                  Enviar solicitud
                </button>
              </div>
            </form>
          </article>

          {/* ASIDE LATERAL */}
          <aside className="aside-prestamo">
            <div className="card-producto">
              <div className="producto-info">
                <div className="producto-img-placeholder"></div>
                <div className="producto-detalles">
                  <h3>{producto.nombre || "NOMBRE PRODUCTO"}</h3>
                  <p className="producto-sub">
                    {producto.marca || "MARCA"} · {producto.disponible ?? 3} de{" "}
                    {producto.existente ?? 5} unidades libres
                  </p>
                </div>
              </div>

              <div className="condiciones-section">
                <h4>CONDICIONES QUE ACEPTAS</h4>
                <p className="condiciones-texto">
                  Devolución el <strong>{fechaDevolucionTexto}</strong> antes de las NN:00 en
                  el Almacén H-102 · verificación de accesorios en la entrega y el retorno ·
                  penalidad de <strong>S/ XX.00</strong> por día de retraso · sin renovación.
                </p>
                {/* Requisito 3: Checkbox de aceptación de condiciones */}
                <label className="checkbox-label" htmlFor="condiciones-checkbox">
                  <input
                    type="checkbox"
                    id="condiciones-checkbox"
                    checked={aceptoCondiciones}
                    onChange={(e) => setAceptoCondiciones(e.target.checked)}
                  />
                  <span>Acepto las condiciones del préstamo.</span>
                </label>
              </div>
            </div>
          </aside>
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

export default SolicitarProducto;