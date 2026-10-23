
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/reservas/MisReservas.css";
import ModalCancelacion from "./ModalCancelacion.jsx";

function MisReservas() {

  // Obtener reservas guardadas
  const [reservas, setReservas] = useState(() => {
    const guardadas = localStorage.getItem("reservasH6");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [filtro, setFiltro] = useState("Todas");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Filtrar las reservas de Natalia
  const misReservas = reservas.filter(
    (reserva) => reserva.estudiante === "Natalia Rebatta"
  );

  const reservasFiltradas = misReservas.filter(
    (reserva) => filtro === "Todas" || reserva.estado === filtro
  );

  function formatearFecha(fecha) {
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
    const nuevasReservas = reservas.map((reserva) => {
      if (reserva.id === reservaSeleccionada.id) {
        return { ...reserva, estado: "Cancelada" };
      }

      return reserva;
    });

    setReservas(nuevasReservas);
    localStorage.setItem("reservasH6", JSON.stringify(nuevasReservas));

    setReservaSeleccionada(null);
    setMensaje("Reserva cancelada correctamente.");
  }

  return (
    <div className="mis-page">

      <header className="mis-header">
        <div className="mis-logo">
          <div className="mis-logo-cuadro"></div>
          <h2>Almacén de Equipos</h2>
        </div>

        <nav className="mis-nav">
          <a href="#">Catálogo</a>
          <a href="#">Mis solicitudes</a>
          <Link to="/mis-reservas" className="mis-activo">
            Mis reservas
          </Link>
          <Link to="/calendario">Calendario</Link>
        </nav>

        <div className="mis-perfil">
          <span>Natalia Rebatta</span>
          <div className="mis-avatar">NR</div>
        </div>
      </header>

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
            <label htmlFor="filtro-reservas">Filtrar por estado:</label>

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
                  reservasFiltradas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.equipo}</td>
                      <td>{formatearFecha(reserva.inicio)}</td>
                      <td>{formatearFecha(reserva.fin)}</td>
                      <td>
                        <span className={`mis-estado mis-${reserva.estado.toLowerCase().replace(" ", "-")}`}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td>
                        {reserva.estado === "Confirmada" ? (
                          <button
                            type="button"
                            className="mis-cancelar"
                            onClick={() => abrirCancelacion(reserva)}
                          >
                            Cancelar reserva
                          </button>
                        ) : (
                          <span className="mis-sin-accion">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="mis-vacio">
                      No tienes reservas para mostrar.
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
        <span>Almacén de Equipos · Facultad de Ingeniería</span>
        <span>almacen.equipos@aloe.ulima.edu.pe · Anexo 3120</span>
      </footer>

    </div>
  );
}

export default MisReservas;
