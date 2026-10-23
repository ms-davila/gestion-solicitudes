function ModalReserva({ equipo, fechaInicio, fechaFin, cerrar, confirmar }) {

  function formatearFecha(fecha) {
    return fecha.toLocaleDateString("es-PE");
  }

  return (
    <div className="cal-modal-fondo">
      <div className="cal-modal">

        <div className="cal-modal-titulo">
          <h2>Confirmar reserva</h2>
          <button type="button" onClick={cerrar}>×</button>
        </div>

        <p>Revisa los datos antes de confirmar tu reserva.</p>

        <div className="cal-modal-detalle">
          <p><strong>Estudiante:</strong> Natalia Rebatta</p>
          <p><strong>Equipo:</strong> {equipo.nombre}</p>
          <p><strong>Fecha de inicio:</strong> {formatearFecha(fechaInicio)}</p>
          <p><strong>Fecha de fin:</strong> {formatearFecha(fechaFin)}</p>
          <p><strong>Unidades solicitadas:</strong> 1</p>
        </div>

        <div className="cal-modal-botones">
          <button
            type="button"
            className="cal-modal-cancelar"
            onClick={cerrar}
          >
            Volver
          </button>

          <button
            type="button"
            className="cal-modal-confirmar"
            onClick={confirmar}
          >
            Confirmar reserva
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalReserva;
