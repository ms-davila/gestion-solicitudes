import { Link } from "react-router-dom";
import useIdentidad from "../useIdentidad.js";
import BotonSalir from "./BotonSalir.jsx";
import { SOLICITUDES } from "../../pages/aprobacion y entrega/BandejaPage.jsx";
import "./HeaderEncargado.css";

export default function HeaderEncargado({
  buscador,
  placeholder = "Buscar por código: PRE-2026-0318"
}) {
  const { nombreCorto, iniciales } = useIdentidad();

  const solicitudesPendientes = SOLICITUDES.filter(
    (solicitud) => solicitud.estado === "enviada"
  ).length;

  return (
    <header className="header-encargado">
      <div className="header-encargado__marca">
        <span
          className="header-encargado__logo"
          aria-hidden="true"
        />

        <Link
          to="/inventario"
          className="header-encargado__nombre"
        >
          Almacén de Equipos
        </Link>

        <span className="header-encargado__panel">
          PANEL DEL ENCARGADO
        </span>
      </div>

      <div className="header-encargado__busqueda">
        {buscador ?? (
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              placeholder={placeholder}
              aria-label="Buscar por código"
              readOnly
              title="Búsqueda no conectada en esta pantalla"
            />
          </form>
        )}
      </div>

      <Link
        to="/bandeja"
        className="header-encargado__pendientes"
      >
        <span>Solicitudes pendientes</span>

        <span className="header-encargado__contador">
          {solicitudesPendientes}
        </span>
      </Link>

      <div className="header-encargado__usuario">
        <span className="header-encargado__usuario-nombre">
          {nombreCorto} · H-102
        </span>

        <span className="header-encargado__avatar">
          {iniciales}
        </span>

        <BotonSalir />
      </div>
    </header>
  );
}
