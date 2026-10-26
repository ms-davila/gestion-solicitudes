import { Outlet } from "react-router-dom";
import { SOLICITUDES } from "./BandejaPage.jsx";

import "../../styles/aprobacion y entrega/base.css";
import "../../styles/aprobacion y entrega/layout.css";
import "../../styles/aprobacion y entrega/componentes.css";
import "../../styles/aprobacion y entrega/historia4.css";

import useIdentidad from "../../components/useIdentidad.js";
import MenuLateral from "../../components/compartidos/MenuLateral.jsx";
import HeaderEncargado from "../../components/compartidos/HeaderEncargado.jsx";

export default function LayoutEncargado() {
  const { nombreCorto, iniciales } = useIdentidad();

  // Solicitudes pendientes para la cabecera superior
  const solicitudesPendientes = SOLICITUDES.filter(
    (solicitud) => solicitud.estado === "enviada"
  ).length;

  return (
    <div className="pagina">

      {/* CABECERA COMPARTIDA DEL ENCARGADO */}
      <HeaderEncargado />

      {/* MENÚ LATERAL COMPARTIDO Y CONTENIDO */}
      <div className="app">

        <MenuLateral />

        <main className="contenido">
          <Outlet />
        </main>

      </div>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <p>
          Almacén de Equipos · Panel del encargado ·
          Almacén H-102
        </p>

        <p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Manual del encargado
          </a>

          <span>
            Soporte: sistemas@ulima.edu.pe
          </span>

          <span>
            Última sincronización:{" "}
            <span className="codigo">
              14/09/2026 08:05
            </span>
          </span>
        </p>
      </footer>

    </div>
  );
}
