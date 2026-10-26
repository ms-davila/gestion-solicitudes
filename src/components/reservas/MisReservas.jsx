import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsuario } from "../cuenta y registro/context/UsuarioContext.jsx";
import HeaderEstudiante from "../compartidos/HeaderEstudiante.jsx";
import ModalCancelacion from "./ModalCancelacion.jsx";
import "../../styles/reservas/MisReservas.css";

const DIAS_ANTICIPACION = 2;

function leerReservas() {
  try {
    const datos = JSON.parse(localStorage.getItem("reservasH6") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function diasHasta(fechaTexto) {
  const [anio, mes, dia] = fechaTexto.split("-").map(Number);

  const inicioUTC = Date.UTC(anio, mes - 1, dia);
  const hoy = new Date();
  const hoyUTC = Date.UTC(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );

  return Math.round((inicioUTC - hoyUTC) / 86400000);
}

function MisReservas() {
  const navigate = useNavigate();
  const { usuarioSesion } = useUsuario();
  const correoEstudiante = usuarioSesion?.correo || "";

  const [reservas, setReservas] = useState(leerReservas);
  const [filtro, setFiltro] = useState("Todas");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Solo reservas de la sesión actual
  const misReservas = reservas.filter(
    (reserva) =>
      correoEstudiante &&
      reserva.estudianteCorreo === correoEstudiante
  );

  const reservasFiltradas = misReservas.filter(
    (reserva) =>
      filtro === "Todas" || reserva.estado === filtro
  );

  function formatearFecha(fecha) {
    if (!fecha) return "—";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  function abrirCancelacion(reserva) {
    setReservaSeleccionada(reserva);
  }

  function cerrarCancelacion() {
    setReservaSeleccionada(null);
  }

  function confirmarCancelacion() {
    if (!reservaSeleccionada) return;

    const actuales = leerReservas();

    const nuevasReservas = actuales.map((reserva) => {
      if (
        reserva.id === reservaSeleccionada.id &&
        reserva.estudianteCorreo === correoEstudiante &&
        ["Confirmada", "En espera"].includes(reserva.estado)
      ) {
        return {
          ...reserva,
          estado: "Cancelada",
        };
      }

      return reserva;
    });

    localStorage.setItem(
      "reservasH6",
      JSON.stringify(nuevasReservas)
    );

    setReservas(nuevasReservas);
    setReservaSeleccionada(null);
    setMensaje("Reserva cancelada correctamente.");
  }

  function puedeSolicitar(reserva) {
    if (reserva.estado !== "Confirmada") return false;
    if (reserva.solicitudId) return false;

    const dias = diasHasta(reserva.inicio);

    return dias >= 0 && dias <= DIAS_ANTICIPACION;
  }

  function solicitarPrestamo(reserva) {
    if (!puedeSolicitar(reserva)) return;

    navigate("/solicitarproducto", {
      state: {
        reserva: {
          id: reserva.id,
          equipoId: reserva.equipoId,
          equipo: reserva.equipo,
          inicio: reserva.inicio,
          fin: reserva.fin,
          estudianteCorreo: reserva.estudianteCorreo,
        },
        producto: {
          id: reserva.equipoId,
          nombre: reserva.equipo,
          marca: "",
          modelo: "",
          disponible: 1,
          existente: 1,
        },
      },
    });
  }

  return (
    <div className="mis-page">
      <HeaderEstudiante />

      <main className="mis-main">
        <div className="mis-encabezado">
          <div>
            <h1>Mis reservas</h1>
            <p>Consulta y administra tus reservas de equipos.</p>
          </div>

          <Link to="/calendario" className="mis-nueva">
            + Nueva reserva
          </Link>
        </div>

        <section className="mis-tarjeta">
          <div className="mis-filtros">
            <label htmlFor="filtro-reservas">
              Filtrar por estado:
            </label>

            <select
              id="filtro-reservas"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="Todas">Todas</option>
              <option value="Confirmada">Confirmadas</option>
              <option value="En espera">En espera</option>
              <option value="Completada">Completadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          <div className="mis-tabla-contenedor">
            <table className="mis-tabla">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>Fecha de inicio</th>
                  <th>Fecha de fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.length > 0 ? (
                  reservasFiltradas.map((reserva) => {
                    const permiteCancelar = [
                      "Confirmada",
                      "En espera",
                    ].includes(reserva.estado);

                    const permiteSolicitar =
                      puedeSolicitar(reserva);

                    return (
                      <tr key={reserva.id}>
                        <td>{reserva.equipo}</td>

                        <td>{formatearFecha(reserva.inicio)}</td>

                        <td>{formatearFecha(reserva.fin)}</td>

                        <td>
                          <span
                            className={`mis-estado mis-${reserva.estado
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {reserva.estado}
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            {permiteSolicitar && (
                              <button
                                type="button"
                                className="mis-nueva"
                                style={{
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  solicitarPrestamo(reserva)
                                }
                              >
                                Solicitar préstamo
                              </button>
                            )}

                            {permiteCancelar && (
                              <button
                                type="button"
                                className="mis-cancelar"
                                onClick={() =>
                                  abrirCancelacion(reserva)
                                }
                              >
                                Cancelar reserva
                              </button>
                            )}

                            {reserva.solicitudId && (
                              <Link to="/missolicitudes">
                                Ver solicitud
                              </Link>
                            )}

                            {!permiteSolicitar &&
                              !permiteCancelar &&
                              !reserva.solicitudId && (
                                <span className="mis-sin-accion">
                                  —
                                </span>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="mis-vacio">
                      {correoEstudiante
                        ? "No tienes reservas para mostrar."
                        : "Inicia sesión para consultar tus reservas."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {mensaje && (
          <p className="mis-mensaje">{mensaje}</p>
        )}

        {reservaSeleccionada && (
          <ModalCancelacion
            reserva={reservaSeleccionada}
            cerrar={cerrarCancelacion}
            confirmar={confirmarCancelacion}
          />
        )}
      </main>

      <footer className="mis-footer">
        <span>
          Almacén de Equipos · Facultad de Ingeniería
        </span>
        <span>
          almacen.equipos@aloe.ulima.edu.pe · Anexo 3120
        </span>
      </footer>
    </div>
  );
}

export default MisReservas;
