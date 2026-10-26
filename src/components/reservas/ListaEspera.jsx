import { useState } from "react";
import "../../styles/reservas/ListaEspera.css";

import HeaderEncargado from "../compartidos/HeaderEncargado.jsx";
import MenuLateral from "../compartidos/MenuLateral.jsx";

function ListaEspera() {
  const [reservas] = useState(() => {
    try {
      const guardadas = JSON.parse(
        localStorage.getItem("reservasH6") || "[]"
      );
      return Array.isArray(guardadas) ? guardadas : [];
    } catch {
      return [];
    }
  });

  const listaEspera = reservas
    .filter((reserva) => reserva.estado === "En espera")
    .sort((a, b) => Number(a.id) - Number(b.id));

  function formatearFecha(fecha) {
    if (!fecha) return "—";

    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  function calcularPosicion(reservaActual) {
    const anteriores = listaEspera.filter((reserva) => {
      return (
        reserva.equipoId === reservaActual.equipoId &&
        Number(reserva.id) < Number(reservaActual.id) &&
        reserva.inicio <= reservaActual.fin &&
        reserva.fin >= reservaActual.inicio
      );
    });

    return anteriores.length + 1;
  }

  return (
    <div className="espera-page">
      <HeaderEncargado />

      <div className="espera-cuerpo">
        <MenuLateral />

        <main className="espera-main">
          <div className="espera-encabezado">
            <div>
              <h1>Lista de espera</h1>
              <p>
                Consulta las solicitudes pendientes de disponibilidad.
              </p>
            </div>
          </div>

          <section className="espera-tarjeta">
            <h2>Reservas en espera ({listaEspera.length})</h2>

            <div className="espera-tabla-contenedor">
              <table className="espera-tabla">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Estudiante</th>
                    <th>Fecha de inicio</th>
                    <th>Fecha de fin</th>
                    <th>Estado</th>
                    <th>Posición</th>
                  </tr>
                </thead>

                <tbody>
                  {listaEspera.length > 0 ? (
                    listaEspera.map((reserva) => (
                      <tr key={reserva.id}>
                        <td>{reserva.equipo}</td>
                        <td>{reserva.estudiante}</td>
                        <td>{formatearFecha(reserva.inicio)}</td>
                        <td>{formatearFecha(reserva.fin)}</td>
                        <td>
                          <span className="espera-estado">
                            En espera
                          </span>
                        </td>
                        <td>
                          <span className="espera-posicion">
                            {calcularPosicion(reserva)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="espera-vacio">
                        No hay reservas en lista de espera.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <footer className="espera-footer">
        <span>Almacén de Equipos · Facultad de Ingeniería</span>
        <span>almacen.equipos@aloe.ulima.edu.pe · Anexo 3120</span>
      </footer>
    </div>
  );
}

export default ListaEspera;
