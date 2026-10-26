import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Datos de ejemplo de la bandeja.
// Se exportan para que LayoutEncargado pueda calcular su contador.
export const SOLICITUDES = [
  {
    id: 1,
    solicitante: "Renzo Mendoza Cárdenas",
    carrera: "Ing. Electrónica · 6.º",
    equipo: "Osciloscopio TBS1052B",
    fechas: "16/09 → 21/09/2026",
    motivo: "Práctica calificada 3 de circuitos",
    antiguedad: "hace 2 h",
    estado: "enviada",
  },
  {
    id: 2,
    solicitante: "Alejandra Huamán Solís",
    deuda: 60,
    equipo: "Cámara Canon EOS 90D",
    fechas: "17/09 → 22/09/2026",
    motivo: "Registro fotográfico del taller",
    antiguedad: "hace 5 h",
    estado: "enviada",
  },
  {
    id: 3,
    solicitante: "Diego Salcedo Vera",
    carrera: "Ing. Industrial · 8.º",
    equipo: "Kit de robótica Arduino Mega",
    fechas: "18/09 → 25/09/2026",
    motivo: "Prototipo del proyecto integrador",
    antiguedad: "hace 1 d",
    estado: "enviada",
  },
  {
    id: 4,
    solicitante: "Fabiana Loayza Ramos",
    carrera: "Comunicación · 5.º",
    equipo: "Trípode Manfrotto MT055",
    fechas: "16/09 → 18/09/2026",
    motivo: "Grabación del cortometraje",
    antiguedad: "hace 1 d",
    estado: "enviada",
  },
  {
    id: 5,
    solicitante: "Mateo Chávez Ríos",
    carrera: "Ing. de Sistemas · 7.º",
    equipo: "Analizador de redes portátil",
    fechas: "19/09 → 23/09/2026",
    motivo: "Certificación de cableado del lab.",
    antiguedad: "hace 2 d",
    estado: "aprobada",
  },
  {
    id: 6,
    solicitante: "Lucía Paredes Ynga",
    carrera: "Ing. Electrónica · 9.º",
    equipo: "Multímetro Fluke 117",
    fechas: "15/09 → 19/09/2026",
    motivo: "Mediciones de la tesis",
    antiguedad: "hace 3 d",
    estado: "aprobada",
  },
  {
    id: 7,
    solicitante: "Camila Quispe Andrade",
    deuda: 45,
    equipo: "Tableta gráfica Wacom Intuos",
    fechas: "10/09 → 14/09/2026",
    motivo: "Entrega del curso de dibujo",
    antiguedad: "hace 6 d",
    estado: "rechazada",
  },
];

// Unidades simuladas para el modal de aprobación.
const UNIDADES = [
  {
    codigo: "INV-OSC-0042",
    ubicacion: "Almacén H-102 · anaquel 3",
  },
  {
    codigo: "INV-OSC-0043",
    ubicacion: "Almacén H-102 · anaquel 3",
  },
  {
    codigo: "INV-OSC-0046",
    ubicacion: "Almacén N-005",
  },
];

const ETIQUETA_ESTADO = {
  enviada: "Enviada",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

export default function BandejaPage() {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    document.title = "Bandeja de solicitudes · Almacén de Equipos";
  }, []);

  // CONTADORES AUTOMÁTICOS
  const totalSolicitudes = SOLICITUDES.length;

  const enviadas = SOLICITUDES.filter(
    (s) => s.estado === "enviada"
  ).length;

  const aprobadas = SOLICITUDES.filter(
    (s) => s.estado === "aprobada"
  ).length;

  const rechazadas = SOLICITUDES.filter(
    (s) => s.estado === "rechazada"
  ).length;

  const solicitudesConDeuda = SOLICITUDES.filter(
    (s) => Number(s.deuda) > 0
  );

  const totalDeudas = solicitudesConDeuda.reduce(
    (total, s) => total + Number(s.deuda),
    0
  );

  // MODALES
  const cerrar = () => setModal(null);

  const rechazar = (solicitud) => {
    setModal({
      tipo: "rechazar",
      solicitud,
    });
  };

  const aprobar = (solicitud) => {
    setModal({
      tipo: solicitud.deuda ? "sin-unidades" : "aprobar",
      solicitud,
    });
  };

  return (
    <>
      {/* ENCABEZADO */}
      <div className="encabezado-pantalla">
        <div>
          <h1 className="titulo-pantalla">
            Bandeja de solicitudes
          </h1>

          <p className="texto-auxiliar">
            {totalSolicitudes} solicitudes · Almacén H-102
          </p>
        </div>
      </div>

      {/* PESTAÑAS CON CONTADORES AUTOMÁTICOS */}
      <div className="pestanas" role="tablist">
        <a
          className="pestanas__item is-active"
          href="#"
          role="tab"
          aria-selected="true"
          onClick={(e) => e.preventDefault()}
        >
          Enviadas
          <span className="pestanas__contador">
            {enviadas}
          </span>
        </a>

        <a
          className="pestanas__item"
          href="#"
          role="tab"
          onClick={(e) => e.preventDefault()}
        >
          Aprobadas
          <span className="pestanas__contador">
            {aprobadas}
          </span>
        </a>

        <a
          className="pestanas__item"
          href="#"
          role="tab"
          onClick={(e) => e.preventDefault()}
        >
          Rechazadas
          <span className="pestanas__contador">
            {rechazadas}
          </span>
        </a>
      </div>

      {/* AVISO DE DEUDAS */}
      {solicitudesConDeuda.length > 0 && (
        <div
          className="aviso aviso--danger"
          role="alert"
        >
          <strong>Aviso de deuda pendiente.</strong>{" "}
          {solicitudesConDeuda.length} solicitantes de esta
          bandeja tienen penalidades sin regularizar por S/{" "}
          {totalDeudas.toFixed(2)} en total.
          Sus filas están marcadas con el indicador de deuda.
        </div>
      )}

      {/* FILTROS ORIGINALES */}
      <form
        className="filtros"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="campo">
          <label
            className="campo__etiqueta"
            htmlFor="filtro-estado"
          >
            Estado
          </label>

          <select
            className="campo__input"
            id="filtro-estado"
          >
            <option>Enviadas</option>
            <option>Aprobadas</option>
            <option>Rechazadas</option>
          </select>
        </div>

        <div className="campo">
          <label
            className="campo__etiqueta"
            htmlFor="filtro-categoria"
          >
            Categoría
          </label>

          <select
            className="campo__input"
            id="filtro-categoria"
          >
            <option>Todas</option>
            <option>Medición</option>
            <option>Audiovisual</option>
            <option>Robótica</option>
          </select>
        </div>

        <div className="campo campo--ancho">
          <label
            className="campo__etiqueta"
            htmlFor="filtro-busqueda"
          >
            Buscar
          </label>

          <input
            className="campo__input"
            type="search"
            id="filtro-busqueda"
            placeholder="Estudiante, curso o equipo"
          />
        </div>
      </form>

      {/* TABLA DE SOLICITUDES */}
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th scope="col">Solicitante</th>
              <th scope="col">Equipo</th>
              <th scope="col">Fechas</th>
              <th scope="col">Motivo</th>
              <th scope="col">Antigüedad</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {SOLICITUDES.map((solicitud) => (
              <FilaSolicitud
                key={solicitud.id}
                s={solicitud}
                onAprobar={() => aprobar(solicitud)}
                onRechazar={() => rechazar(solicitud)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL DE REGISTROS */}
      <nav
        className="paginacion"
        aria-label="Resumen de solicitudes"
      >
        <p className="texto-auxiliar">
          Mostrando{" "}
          {totalSolicitudes === 0 ? 0 : 1} a{" "}
          {totalSolicitudes} de{" "}
          {totalSolicitudes} solicitudes
        </p>
      </nav>

      {/* MODALES */}
      {modal?.tipo === "aprobar" && (
        <ModalAprobar
          solicitud={modal.solicitud}
          onCerrar={cerrar}
        />
      )}

      {modal?.tipo === "sin-unidades" && (
        <ModalSinUnidades
          solicitud={modal.solicitud}
          onCerrar={cerrar}
          onRechazar={() => rechazar(modal.solicitud)}
        />
      )}

      {modal?.tipo === "rechazar" && (
        <ModalRechazar onCerrar={cerrar} />
      )}
    </>
  );
}

/* ==========================================
   FILA INDIVIDUAL DE SOLICITUD
   ========================================== */

function FilaSolicitud({ s, onAprobar, onRechazar }) {
  return (
    <tr
      className={
        `tabla__fila${s.deuda ? " tabla__fila--deuda" : ""}`
      }
    >
      <td>
        <span className="tabla__principal">
          {s.solicitante}
        </span>

        {s.deuda ? (
          <span className="badge badge--deuda">
            Deuda S/ {s.deuda.toFixed(2)}
          </span>
        ) : (
          <span className="texto-auxiliar">
            {s.carrera}
          </span>
        )}
      </td>

      <td>{s.equipo}</td>
      <td className="codigo">{s.fechas}</td>
      <td>{s.motivo}</td>
      <td>{s.antiguedad}</td>

      <td>
        <span className={`badge badge--${s.estado}`}>
          {ETIQUETA_ESTADO[s.estado]}
        </span>
      </td>

      <td className="tabla__acciones">
        {s.estado === "enviada" && (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onAprobar}
            >
              Aprobar
            </button>

            <button
              type="button"
              className="btn btn--destructive"
              onClick={onRechazar}
            >
              Rechazar
            </button>
          </>
        )}

        {s.estado === "aprobada" && (
          <Link
            className="btn btn--secondary"
            to="/entrega"
          >
            Registrar entrega
          </Link>
        )}

        {s.estado === "rechazada" && (
          <button
            type="button"
            className="btn btn--tertiary"
          >
            Ver motivo
          </button>
        )}
      </td>
    </tr>
  );
}

/* ==========================================
   MODAL: APROBAR SOLICITUD
   ========================================== */

function ModalAprobar({ solicitud, onCerrar }) {
  const [unidad, setUnidad] = useState(
    UNIDADES[0].codigo
  );

  const enviar = (e) => {
    e.preventDefault();

    // Simulación original.
    // Aquí se conectará la aprobación real posteriormente.
    onCerrar();
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aprobar-titulo"
    >
      <div
        className="modal__fondo"
        onClick={onCerrar}
      />

      <div className="modal__caja">
        <h2
          className="modal__titulo"
          id="aprobar-titulo"
        >
          Aprobar solicitud
        </h2>

        <p className="texto-auxiliar">
          {solicitud.equipo} ·{" "}
          {solicitud.solicitante} ·{" "}
          <span className="codigo">
            {solicitud.fechas}
          </span>
        </p>

        <form onSubmit={enviar}>
          <fieldset className="campo-grupo">
            <legend className="campo__etiqueta">
              Asigna una unidad
            </legend>

            {UNIDADES.map((u) => (
              <label
                className="opcion-unidad"
                key={u.codigo}
              >
                <input
                  type="radio"
                  name="unidad"
                  value={u.codigo}
                  checked={unidad === u.codigo}
                  onChange={() => setUnidad(u.codigo)}
                />

                <span className="codigo">
                  {u.codigo}
                </span>

                <span className="texto-auxiliar">
                  {u.ubicacion}
                </span>

                <span className="badge badge--disponible">
                  Disponible
                </span>
              </label>
            ))}
          </fieldset>

          <div className="modal__acciones">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onCerrar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn--primary"
            >
              Aprobar y asignar unidad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================
   MODAL: NO SE PUEDE APROBAR
   ========================================== */

function ModalSinUnidades({
  solicitud,
  onCerrar,
  onRechazar,
}) {
  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sin-unidades-titulo"
    >
      <div
        className="modal__fondo"
        onClick={onCerrar}
      />

      <div className="modal__caja">
        <h2
          className="modal__titulo"
          id="sin-unidades-titulo"
        >
          No se puede aprobar
        </h2>

        <p className="texto-auxiliar">
          {solicitud.equipo} ·{" "}
          {solicitud.solicitante} ·{" "}
          <span className="codigo">
            {solicitud.fechas}
          </span>
        </p>

        <div
          className="aviso aviso--warning"
          role="alert"
        >
          <strong>
            Sin unidades libres en el rango.
          </strong>{" "}
          No hay unidades disponibles para{" "}
          {solicitud.fechas}.
        </div>

        <div
          className="aviso aviso--danger"
          role="alert"
        >
          <strong>Solicitante con deuda.</strong>{" "}
          Tiene una penalidad pendiente de S/{" "}
          {solicitud.deuda.toFixed(2)}.
          No puede recibir equipos hasta regularizar
          en Tesorería.
        </div>

        <div className="modal__acciones">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCerrar}
          >
            Cerrar
          </button>

          <button
            type="button"
            className="btn btn--destructive"
            onClick={onRechazar}
          >
            Rechazar solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MODAL: RECHAZAR SOLICITUD
   ========================================== */

function ModalRechazar({ onCerrar }) {
  const enviar = (e) => {
    e.preventDefault();

    // Simulación original.
    // Aquí se conectará el rechazo real posteriormente.
    onCerrar();
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rechazar-titulo"
    >
      <div
        className="modal__fondo"
        onClick={onCerrar}
      />

      <div className="modal__caja">
        <h2
          className="modal__titulo"
          id="rechazar-titulo"
        >
          Rechazar solicitud
        </h2>

        <p className="texto-auxiliar">
          El estudiante recibirá el motivo en su solicitud.
        </p>

        <form onSubmit={enviar}>
          <div className="campo">
            <label
              className="campo__etiqueta"
              htmlFor="rechazo-motivo"
            >
              Motivo
            </label>

            <select
              className="campo__input"
              id="rechazo-motivo"
            >
              <option>Sin unidades disponibles</option>
              <option>Falta autorización del docente</option>
              <option>Penalidad pendiente</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="campo">
            <label
              className="campo__etiqueta"
              htmlFor="rechazo-detalle"
            >
              Detalle
            </label>

            <textarea
              className="campo__input"
              id="rechazo-detalle"
              rows={4}
              placeholder="Explica al estudiante qué debe corregir"
            />

            <p className="campo__ayuda">
              Mínimo 20 caracteres.
            </p>
          </div>

          <div className="modal__acciones">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onCerrar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn--destructive"
            >
              Rechazar solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
