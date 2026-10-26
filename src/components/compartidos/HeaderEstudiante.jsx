
import { Link } from "react-router-dom";
import NavSuperior from "./NavSuperior.jsx";
import useIdentidad from "../useIdentidad.js";
import BotonSalir from "./BotonSalir.jsx";
import "./HeaderEstudiante.css";

export default function HeaderEstudiante({
  busqueda,
  setBusqueda,
  onBuscar
}) {
  const { rol, nombreCorto, iniciales, paginaCuenta } = useIdentidad();

  const handleBuscar = (e) => {
    e.preventDefault();
    if (onBuscar) onBuscar(e);
  };

  return (
    <header className="res-header-global">
      <Link to="/catalogo" className="res-global-logo">
        <span className="res-global-cuadro"></span>
        Almacén de Equipos
      </Link>

      <nav className="res-global-nav" aria-label="Navegación principal">
        <NavSuperior claseActivo="res-global-activo" />
      </nav>

      <form className="res-global-busqueda" onSubmit={handleBuscar}>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Buscar equipo o código de inventario"
          aria-label="Buscar equipo o código de inventario"
          value={busqueda ?? ""}
          onChange={(e) => setBusqueda?.(e.target.value)}
          readOnly={!setBusqueda}
        />
      </form>

      <div className="res-global-perfil">
        {rol ? (
          <>
            <span className="res-global-nombre">{nombreCorto}</span>

            <Link
              to={paginaCuenta}
              className="res-global-avatar"
              title="Mi cuenta"
            >
              {iniciales}
            </Link>

            <BotonSalir />
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </header>
  );
}
