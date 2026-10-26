import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../cuenta y registro/context/UsuarioContext.jsx";
import HeaderEstudiante from "../compartidos/HeaderEstudiante.jsx";
import ModalReserva from "./ModalReserva.jsx";
import "../../styles/reservas/Calendario.css";

const equipos = [
  { id: 1, nombre: "Osciloscopio Tektronix TBS1052B", unidades: 5 },
  { id: 2, nombre: "Cámara Canon EOS 90D", unidades: 4 },
  { id: 3, nombre: "Kit de robótica Arduino Mega", unidades: 6 },
  { id: 4, nombre: "Tableta gráfica Wacom Intuos", unidades: 3 },
];

const prestamos = [
  { equipoId: 1, inicio: "2026-10-26", fin: "2026-10-29", unidades: 2 },
  { equipoId: 2, inicio: "2026-10-27", fin: "2026-10-30", unidades: 1 },
  { equipoId: 4, inicio: "2026-11-10", fin: "2026-11-12", unidades: 3 },
];

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function leerReservas() {
  try {
    const datos = JSON.parse(localStorage.getItem("reservasH6") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function fechaTexto(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function Calendario() {
  const { usuarioSesion } = useUsuario();

  const correoEstudiante = usuarioSesion?.correo || "";
  const nombreEstudiante = usuarioSesion
    ? `${usuarioSesion.nombres} ${usuarioSesion.apellidos}`.trim()
    : "";

  const [fechaActual, setFechaActual] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });

  const [equipoId, setEquipoId] = useState(1);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [reservas, setReservas] = useState(leerReservas);

  const equipoSeleccionado = equipos.find(
    (equipo) => equipo.id === Number(equipoId)
  );

  const mes = fechaActual.getMonth();
  const anio = fechaActual.getFullYear();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;

  const casillas = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  const nombreMes = fechaActual.toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  });

  function cambiarMes(cantidad) {
    setFechaActual(new Date(anio, mes + cantidad, 1));
    setFechaInicio(null);
    setFechaFin(null);
    setMensaje("");
  }

  function seleccionarDia(dia) {
    if (dia === null) return;

    const fecha = new Date(anio, mes, dia);
    const hoy = fechaTexto(new Date());

    if (fechaTexto(fecha) < hoy) {
      setMensaje("No puedes seleccionar fechas anteriores a hoy.");
      return;
    }

    setMensaje("");

    if (!fechaInicio || fechaFin || fecha < fechaInicio) {
      setFechaInicio(fecha);
      setFechaFin(null);
    } else {
      setFechaFin(fecha);
    }
  }

  function estaSeleccionado(dia) {
    if (!dia || !fechaInicio) return false;

    const fecha = new Date(anio, mes, dia);

    if (!fechaFin) {
      return fecha.getTime() === fechaInicio.getTime();
    }

    return fecha >= fechaInicio && fecha <= fechaFin;
  }

  const totalDiasSeleccionados =
    fechaInicio && fechaFin
      ? Math.round(
          (
            Date.UTC(
              fechaFin.getFullYear(),
              fechaFin.getMonth(),
              fechaFin.getDate()
            ) -
            Date.UTC(
              fechaInicio.getFullYear(),
              fechaInicio.getMonth(),
              fechaInicio.getDate()
            )
          ) / 86400000
        ) + 1
      : 0;

  function formatearFecha(fecha) {
    return fecha.toLocaleDateString("es-PE");
  }

  function obtenerOcupacion(fecha) {
    const reservadas = reservas.filter(
      (reserva) =>
        Number(reserva.equipoId) === Number(equipoId) &&
        reserva.estado === "Confirmada" &&
        fecha >= reserva.inicio &&
        fecha <= reserva.fin
    ).length;

    const prestadas = prestamos
      .filter(
        (prestamo) =>
          prestamo.equipoId === equipoId &&
          fecha >= prestamo.inicio &&
          fecha <= prestamo.fin
      )
      .reduce((total, prestamo) => total + prestamo.unidades, 0);

    return { reservadas, prestadas };
  }

  function calcularDisponibilidad(fecha) {
    const { reservadas, prestadas } = obtenerOcupacion(fecha);

    return Math.max(
      0,
      equipoSeleccionado.unidades - reservadas - prestadas
    );
  }

  function disponibilidadRango(inicio, fin) {
    let minimo = equipoSeleccionado.unidades;
    const fecha = new Date(
      inicio.getFullYear(),
      inicio.getMonth(),
      inicio.getDate()
    );

    while (fecha <= fin) {
      minimo = Math.min(
        minimo,
        calcularDisponibilidad(fechaTexto(fecha))
      );

      fecha.setDate(fecha.getDate() + 1);
    }

    return minimo;
  }

  function confirmarReserva() {
    if (!fechaInicio || !fechaFin) return;

    if (!correoEstudiante || usuarioSesion?.rol !== "estudiante") {
      setMensaje("Debes iniciar sesión como estudiante para reservar.");
      setModalAbierto(false);
      return;
    }

    const inicio = fechaTexto(fechaInicio);
    const fin = fechaTexto(fechaFin);
    const hoy = fechaTexto(new Date());

    if (inicio < hoy || fin < inicio) {
      setMensaje("Selecciona un rango de fechas válido.");
      setModalAbierto(false);
      return;
    }

    const actuales = leerReservas();

    const existeReserva = actuales.some(
      (reserva) =>
        Number(reserva.equipoId) === Number(equipoId) &&
        reserva.estudianteCorreo === correoEstudiante &&
        ["Confirmada", "En espera"].includes(reserva.estado) &&
        inicio <= reserva.fin &&
        fin >= reserva.inicio
    );

    if (existeReserva) {
      setMensaje(
        "Ya tienes una reserva de este equipo en las fechas seleccionadas."
      );
      setModalAbierto(false);
      return;
    }

    const disponible = disponibilidadRango(fechaInicio, fechaFin) > 0;

    const nuevaReserva = {
      id: Date.now(),
      equipoId: Number(equipoId),
      equipo: equipoSeleccionado.nombre,
      estudiante: nombreEstudiante,
      estudianteCorreo: correoEstudiante,
      inicio,
      fin,
      estado: disponible ? "Confirmada" : "En espera",
      solicitudId: null,
    };

    const nuevasReservas = [...actuales, nuevaReserva];

    setReservas(nuevasReservas);
    localStorage.setItem("reservasH6", JSON.stringify(nuevasReservas));

    setModalAbierto(false);
    setFechaInicio(null);
    setFechaFin(null);

    setMensaje(
      disponible
        ? "Reserva confirmada correctamente."
        : "No hay unidades disponibles. Tu reserva se registró en lista de espera."
    );
  }

  return (
    <div className="cal-page">
      <HeaderEstudiante />

      <main className="cal-main">
        <div className="cal-encabezado">
          <div>
            <h1>Calendario de ocupación</h1>
            <p>
              {equipoSeleccionado.nombre} ·{" "}
              {equipoSeleccionado.unidades} unidades
            </p>
          </div>

          <div className="cal-controles">
            <select
              aria-label="Seleccionar equipo"
              value={equipoId}
              onChange={(e) => {
                setEquipoId(Number(e.target.value));
                setFechaInicio(null);
                setFechaFin(null);
                setMensaje("");
              }}
            >
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior"
            >
              ‹
            </button>

            <span className="cal-mes">{nombreMes}</span>

            <button
              type="button"
              onClick={() => cambiarMes(1)}
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>
        </div>

        <div className="cal-distribucion">
          <section className="cal-tarjeta">
            <div className="cal-dias-semana">
              {diasSemana.map((dia) => (
                <div key={dia}>{dia}</div>
              ))}
            </div>

            <div className="cal-cuadricula">
              {casillas.map((dia, indice) => {
                const fecha =
                  dia !== null
                    ? fechaTexto(new Date(anio, mes, dia))
                    : null;

                const ocupacion = fecha
                  ? obtenerOcupacion(fecha)
                  : null;

                const disponibles = fecha
                  ? calcularDisponibilidad(fecha)
                  : 0;

                const esPasado =
                  fecha !== null && fecha < fechaTexto(new Date());

                return (
                  <button
                    key={indice}
                    type="button"
                    disabled={dia === null || esPasado}
                    onClick={() => seleccionarDia(dia)}
                    className={`cal-dia ${
                      dia === null ? "cal-vacio" : ""
                    } ${
                      estaSeleccionado(dia) ? "cal-seleccionado" : ""
                    }`}
                  >
                    {dia !== null && (
                      <>
                        <span className="cal-numero">{dia}</span>

                        <div className="cal-estados">
                          <span
                            className={`cal-disponibilidad ${
                              disponibles === 0 ? "cal-sin-cupo" : ""
                            }`}
                          >
                            {disponibles === 0
                              ? "Sin cupo"
                              : `${disponibles} libres`}
                          </span>

                          {ocupacion.reservadas > 0 && (
                            <span className="cal-reservadas">
                              {ocupacion.reservadas} reservadas
                            </span>
                          )}

                          {ocupacion.prestadas > 0 && (
                            <span className="cal-prestadas">
                              {ocupacion.prestadas} prestadas
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="cal-panel">
            <h3>RANGO SELECCIONADO</h3>

            {fechaInicio ? (
              <>
                <p className="cal-fechas">
                  {formatearFecha(fechaInicio)}
                  {fechaFin && ` → ${formatearFecha(fechaFin)}`}
                </p>

                {fechaFin ? (
                  <>
                    <p>{totalDiasSeleccionados} días seleccionados</p>
                    <p className="cal-rango-disponible">
                      {disponibilidadRango(fechaInicio, fechaFin)}{" "}
                      unidades libres durante todo el rango
                    </p>
                  </>
                ) : (
                  <p>Selecciona la fecha de finalización.</p>
                )}
              </>
            ) : (
              <p>Selecciona un rango de fechas en el calendario.</p>
            )}

            <button
              type="button"
              className="cal-boton-reservar"
              disabled={!fechaInicio || !fechaFin}
              onClick={() => {
                setReservas(leerReservas());
                setModalAbierto(true);
              }}
            >
              Reservar este rango
            </button>

            {!correoEstudiante && (
              <p>
                <Link to="/login">Inicia sesión</Link> para reservar.
              </p>
            )}
          </aside>
        </div>

        {mensaje && <p className="cal-mensaje">{mensaje}</p>}

        {modalAbierto && (
          <ModalReserva
            equipo={equipoSeleccionado}
            estudiante={nombreEstudiante}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            cerrar={() => setModalAbierto(false)}
            confirmar={confirmarReserva}
          />
        )}
      </main>

      <footer className="cal-footer">
        <span>Almacén de Equipos · Facultad de Ingeniería</span>
        <span>almacen.equipos@aloe.ulima.edu.pe · Anexo 3120</span>
      </footer>
    </div>
  );
}

export default Calendario;
