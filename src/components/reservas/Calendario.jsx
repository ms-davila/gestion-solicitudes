import { useState } from "react";
import "../../styles/reservas/Calendario.css";
import ModalReserva from "./ModalReserva.jsx";
import { Link } from "react-router-dom";

// Datos simulados de los equipos
const equipos = [
  { id: 1, nombre: "Osciloscopio Tektronix TBS1052B", unidades: 5 },
  { id: 2, nombre: "Cámara Canon EOS 90D", unidades: 4 },
  { id: 3, nombre: "Kit de robótica Arduino Mega", unidades: 6 },
  { id: 4, nombre: "Tableta gráfica Wacom Intuos", unidades: 3 },
];

// Préstamos activos de ejemplo
const prestamos = [
  {
    equipoId: 1,
    inicio: "2026-10-26",
    fin: "2026-10-29",
    unidades: 2
  },
  {
    equipoId: 2,
    inicio: "2026-10-27",
    fin: "2026-10-30",
    unidades: 1
  },
  {
  equipoId: 4,
  inicio: "2026-11-10",
  fin: "2026-11-12",
  unidades: 3
  }
];

// Días de la semana
const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function Calendario() {

  // Hook para controlar el mes que se muestra
  const [fechaActual, setFechaActual] = useState(new Date(2026, 9, 1));

  // Hook para controlar el equipo seleccionado
  const [equipoId, setEquipoId] = useState(1);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Reservas guardadas en el navegador
  const [reservas, setReservas] = useState(() => {
    const guardadas = localStorage.getItem("reservasH6");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  // Obtener el equipo seleccionado
  const equipoSeleccionado = equipos.find(
    (equipo) => equipo.id === Number(equipoId)
  );

  // Obtener el mes y el año
  const mes = fechaActual.getMonth();
  const anio = fechaActual.getFullYear();

  // Cantidad de días del mes
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  // Día de la semana en que inicia el mes (lunes = 0)
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;

  // Crear las casillas del calendario
  const casillas = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  // Mostrar el nombre del mes
  const nombreMes = fechaActual.toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  });

  // Cambiar de mes
  const cambiarMes = (cantidad) => {
    setFechaActual(new Date(anio, mes + cantidad, 1));
    setFechaInicio(null);
    setFechaFin(null);
  };

    // Seleccionar fechas
  function seleccionarDia(dia) {
    const fecha = new Date(anio, mes, dia);

    if (!fechaInicio || fechaFin || fecha < fechaInicio) {
      setFechaInicio(fecha);
      setFechaFin(null);
    } else {
      setFechaFin(fecha);
    }
  }

  // Verificar los días seleccionados
  function estaSeleccionado(dia) {
    if (!dia || !fechaInicio) return false;

    const fecha = new Date(anio, mes, dia);

    if (!fechaFin) {
      return fecha.getTime() === fechaInicio.getTime();
    }

    return fecha >= fechaInicio && fecha <= fechaFin;
  }

  // Calcular la cantidad de días
  const totalDiasSeleccionados = fechaInicio && fechaFin
    ? Math.round((fechaFin - fechaInicio) / 86400000) + 1
    : 0;

    // Mostrar fechas en formato día/mes/año
  function formatearFecha(fecha) {
    return fecha.toLocaleDateString("es-PE");
  }

    // Abrir el modal
  function abrirModal() {
    setModalAbierto(true);
  }

  // Cerrar el modal
  function cerrarModal() {
    setModalAbierto(false);
  }

  // Comprobar disponibilidad durante todo el rango
  function hayDisponibilidad(inicio, fin) {
    const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const ultimoDia = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());

    while (fecha <= ultimoDia) {
      const disponibles = calcularDisponibilidad(fechaTexto(fecha));

      if (disponibles === 0) {
        return false;
      }

      fecha.setDate(fecha.getDate() + 1);
    }

    return true;
  }

  // Confirmar la reserva
  function confirmarReserva() {

    const inicio = fechaTexto(fechaInicio);
    const fin = fechaTexto(fechaFin);
    const hoy = fechaTexto(new Date());

    if (inicio < hoy) {
      setMensaje("No puedes reservar equipos en fechas anteriores a hoy.");
      setModalAbierto(false);
      return;
    }

    // Verificar si ya existe una reserva del mismo estudiante
    const existeReserva = reservas.some((reserva) =>
      reserva.equipoId === equipoId &&
      reserva.estudiante === "Natalia Rebatta" &&
      ["Confirmada", "En espera"].includes(reserva.estado) &&
      inicio <= reserva.fin &&
      fin >= reserva.inicio
    );

    if (existeReserva) {
      setMensaje("Ya tienes una reserva de este equipo en las fechas seleccionadas.");
      setModalAbierto(false);
      return;
    }

    // Crear una nueva reserva
    const disponible = hayDisponibilidad(fechaInicio, fechaFin);

    const nuevaReserva = {
      id: Date.now(),
      equipoId: equipoId,
      equipo: equipoSeleccionado.nombre,
      estudiante: "Natalia Rebatta",
      inicio: inicio,
      fin: fin,
      estado: disponible ? "Confirmada" : "En espera"
    };

    // Agregar la reserva al arreglo
    const nuevasReservas = [...reservas, nuevaReserva];

    // Actualizar React y guardar en el navegador
    setReservas(nuevasReservas);
    localStorage.setItem("reservasH6", JSON.stringify(nuevasReservas));

    setModalAbierto(false);
    setMensaje(
      disponible
        ? "Reserva confirmada correctamente."
        : "No hay unidades disponibles. Se registró tu solicitud en lista de espera."
    );
    setFechaInicio(null);
    setFechaFin(null);
  }

  // Consultar unidades reservadas y prestadas
    function obtenerOcupacion(fecha) {
      const reservadas = reservas.filter((reserva) =>
        reserva.equipoId === equipoId &&
        reserva.estado === "Confirmada" &&
        fecha >= reserva.inicio &&
        fecha <= reserva.fin
      ).length;

      const prestadas = prestamos
        .filter((prestamo) =>
          prestamo.equipoId === equipoId &&
          fecha >= prestamo.inicio &&
          fecha <= prestamo.fin
        )
        .reduce((total, prestamo) => total + prestamo.unidades, 0);

      return { reservadas, prestadas };
    }

    // Calcular unidades libres
    function calcularDisponibilidad(fecha) {
      const { reservadas, prestadas } = obtenerOcupacion(fecha);

      return Math.max(
        0,
        equipoSeleccionado.unidades - reservadas - prestadas
      );
    }
  // Convertir una fecha al formato AAAA-MM-DD
  function fechaTexto(fecha) {
    const anioFecha = fecha.getFullYear();
    const mesFecha = String(fecha.getMonth() + 1).padStart(2, "0");
    const diaFecha = String(fecha.getDate()).padStart(2, "0");

    return `${anioFecha}-${mesFecha}-${diaFecha}`;
  }

  // Calcular unidades libres durante todo el rango
  function disponibilidadRango(inicio, fin) {
    let minimo = equipoSeleccionado.unidades;
    const fecha = new Date(inicio);

    while (fecha <= fin) {
      const disponibles = calcularDisponibilidad(fechaTexto(fecha));

      if (disponibles < minimo) {
        minimo = disponibles;
      }

      fecha.setDate(fecha.getDate() + 1);
    }

    return minimo;
  }

  return (
    <div className="cal-page">

      {/* CABECERA */}
      <header className="cal-header">
        <div className="cal-logo">
          <div className="cal-logo-cuadro"></div>
          <h2>Almacén de Equipos</h2>
        </div>

        <nav className="cal-nav">
          <a href="#">Catálogo</a>
          <a href="#">Mis solicitudes</a>
          <Link to="/mis-reservas">Mis reservas</Link>
          <a href="/calendario" className="cal-activo">
            Calendario
          </a>
        </nav>

        <div className="cal-perfil">
          <span>Natalia Rebatta</span>
          <div className="cal-avatar">NR</div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="cal-main">

        <div className="cal-encabezado">
          <div>
            <h1>Calendario de ocupación</h1>
            <p>
              {equipoSeleccionado.nombre} · {equipoSeleccionado.unidades} unidades
            </p>
          </div>

          <div className="cal-controles">

            {/* SELECCIONAR EQUIPO */}
            <select
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

            {/* NAVEGACIÓN DEL MES */}
            <button onClick={() => cambiarMes(-1)}>‹</button>
            <span className="cal-mes">{nombreMes}</span>
            <button onClick={() => cambiarMes(1)}>›</button>

          </div>
        </div>

        {/* CALENDARIO */}

        {/* Calendario y panel de reserva */}
        <div className="cal-distribucion">

          <section className="cal-tarjeta">

            <div className="cal-dias-semana">
              {diasSemana.map((dia) => (
                <div key={dia}>{dia}</div>
              ))}
            </div>

            <div className="cal-cuadricula">
              {casillas.map((dia, indice) => (
                <button
                  type="button"
                  key={indice}
                  disabled={dia === null}
                  onClick={() => seleccionarDia(dia)}
                  className={`cal-dia
                    ${dia === null ? "cal-vacio" : ""}
                    ${estaSeleccionado(dia) ? "cal-seleccionado" : ""}
                  `}
                >
                  {dia !== null && (
                    <>
                      <span className="cal-numero">{dia}</span>

                      <div className="cal-estados">

                        <span
                          className={`cal-disponibilidad ${
                            calcularDisponibilidad(fechaTexto(new Date(anio, mes, dia))) === 0
                              ? "cal-sin-cupo"
                              : ""
                          }`}
                        >
                          {calcularDisponibilidad(fechaTexto(new Date(anio, mes, dia))) === 0
                            ? "Sin cupo"
                            : `${calcularDisponibilidad(fechaTexto(new Date(anio, mes, dia)))} libres`}
                        </span>

                        {obtenerOcupacion(fechaTexto(new Date(anio, mes, dia))).reservadas > 0 && (
                          <span className="cal-reservadas">
                            {obtenerOcupacion(fechaTexto(new Date(anio, mes, dia))).reservadas} reservadas
                          </span>
                        )}

                        {obtenerOcupacion(fechaTexto(new Date(anio, mes, dia))).prestadas > 0 && (
                          <span className="cal-prestadas">
                            {obtenerOcupacion(fechaTexto(new Date(anio, mes, dia))).prestadas} prestadas
                          </span>
                        )}

                      </div>

                    </>
                  )}
                </button>
              ))}
            </div>

          </section>

          {/* Panel lateral */}
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
                      {disponibilidadRango(fechaInicio, fechaFin)} unidades libres
                      durante todo el rango
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
              onClick={abrirModal}
            >
              Reservar este rango
            </button>
          </aside>

        </div>

        {mensaje && (
          <p className="cal-mensaje">{mensaje}</p>
        )}

        {modalAbierto && (
          <ModalReserva
            equipo={equipoSeleccionado}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            cerrar={cerrarModal}
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
