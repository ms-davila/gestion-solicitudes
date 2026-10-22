import { useState } from "react";
import "../../styles/reservas/Calendario.css";
import ModalReserva from "./ModalReserva.jsx";

// Datos simulados de los equipos
const equipos = [
  { id: 1, nombre: "Osciloscopio Tektronix TBS1052B", unidades: 5 },
  { id: 2, nombre: "Cámara Canon EOS 90D", unidades: 4 },
  { id: 3, nombre: "Kit de robótica Arduino Mega", unidades: 6 },
  { id: 4, nombre: "Tableta gráfica Wacom Intuos", unidades: 3 },
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

  // Confirmar la reserva
  
function confirmarReserva() {

  // Convertir las fechas al formato AAAA-MM-DD
  function fechaTexto(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  }

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
    reserva.estado === "Confirmada" &&
    inicio <= reserva.fin &&
    fin >= reserva.inicio
  );

  if (existeReserva) {
    setMensaje("Ya tienes una reserva de este equipo en las fechas seleccionadas.");
    setModalAbierto(false);
    return;
  }

  // Crear una nueva reserva
  const nuevaReserva = {
    id: Date.now(),
    equipoId: equipoId,
    equipo: equipoSeleccionado.nombre,
    estudiante: "Natalia Rebatta",
    inicio: inicio,
    fin: fin,
    estado: "Confirmada"
  };

  // Agregar la reserva al arreglo
  const nuevasReservas = [...reservas, nuevaReserva];

  // Actualizar React y guardar en el navegador
  setReservas(nuevasReservas);
  localStorage.setItem("reservasH6", JSON.stringify(nuevasReservas));

  setModalAbierto(false);
  setMensaje("Reserva confirmada correctamente.");
  setFechaInicio(null);
  setFechaFin(null);
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
          <a href="#">Mis reservas</a>
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
              onChange={(e) => setEquipoId(Number(e.target.value))}
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
                    <span className="cal-numero">{dia}</span>
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
                  <p>{totalDiasSeleccionados} días seleccionados</p>
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
