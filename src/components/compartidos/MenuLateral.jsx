import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import { MENU, esActivo } from "../../rutas.js";
import { SOLICITUDES } from "../../pages/aprobacion y entrega/BandejaPage.jsx";
import { GRUPOS } from "../../pages/aprobacion y entrega/VigentesPage.jsx";

import "./MenuLateral.css";

export default function MenuLateral() {
  const { pathname } = useLocation();

  const totalSolicitudes = SOLICITUDES.length;

  const totalVigentes = GRUPOS.reduce(
    (total, grupo) => total + grupo.filas.length,
    0
  );

  const contadores = {
    solicitudes: totalSolicitudes,
    vigentes: totalVigentes
  };

  return (
    <aside className="sidebar-compartido">
      <nav
        className="sidebar-compartido__nav"
        aria-label="Navegación del encargado"
      >
        {MENU.map((seccion) => (
          <Fragment key={seccion.titulo}>
            <h2 className="sidebar-compartido__titulo">
              {seccion.titulo}
            </h2>

            <ul className="sidebar-compartido__lista">
              {seccion.enlaces
                .filter((enlace) => enlace.texto !== "Vencidos")
                .map((enlace) => {
                  const activo = esActivo(enlace, pathname);

                  const contador =
                    enlace.contadorId !== undefined
                      ? contadores[enlace.contadorId]
                      : undefined;

                  return (
                    <li key={enlace.texto}>
                      {enlace.to ? (
                        <Link
                          to={enlace.to}
                          className={
                            "sidebar-compartido__enlace" +
                            (activo ? " is-active" : "")
                          }
                          aria-current={
                            activo ? "page" : undefined
                          }
                        >
                          <span>{enlace.texto}</span>

                          {contador !== undefined && (
                            <span className="sidebar-compartido__contador">
                              {contador}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="sidebar-compartido__enlace sidebar-compartido__enlace--inactivo">
                          {enlace.texto}
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </Fragment>
        ))}
      </nav>
    </aside>
  );
}
