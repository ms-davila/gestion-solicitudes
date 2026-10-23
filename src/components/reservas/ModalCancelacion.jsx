function ModalCancelacion({ reserva, cerrar, confirmar }) {
  return (
    <div className="mis-modal-fondo">
      <div className="mis-modal">

        <h2>¿Cancelar reserva?</h2>

        <p>¿Estás segura de que deseas cancelar esta reserva?</p>

        <div className="mis-modal-detalle">
          <p><strong>Equipo:</strong> {reserva.equipo}</p>
          <p><strong>Fecha de inicio:</strong> {reserva.inicio}</p>
          <p><strong>Fecha de fin:</strong> {reserva.fin}</p>
        </div>

        <div className="mis-modal-botones">
          <button
            type="button"
            className="mis-modal-volver"
            onClick={cerrar}
          >
            Mantener reserva
          </button>

          <button
            type="button"
            className="mis-modal-confirmar"
            onClick={confirmar}
          >
            Cancelar reserva
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalCancelacion;
