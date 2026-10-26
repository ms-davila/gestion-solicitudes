import HeaderEncargado from "../compartidos/HeaderEncargado.jsx";
import MenuLateral from "../compartidos/MenuLateral.jsx";

import "../../styles/devoluciones/Devoluciones.css";
import "../../styles/devoluciones/Usuarios.css";

export default function Usuarios() {
  return (
    <div className="pagina-devoluciones">

      {/* CABECERA COMPARTIDA DEL ENCARGADO */}
      <HeaderEncargado />

      {/* CUERPO PRINCIPAL */}
      <div className="cuerpo">

        {/* MENÚ LATERAL COMPARTIDO */}
        <MenuLateral />

        {/* CONTENIDO DE USUARIOS */}
        <main className="contenido">

          {/* RUTA DE NAVEGACIÓN */}
          <p className="ruta">
            Usuarios / Estudiantes / Camila Quispe Andrade
          </p>

          {/* ENCABEZADO DEL ESTUDIANTE */}
          <div className="fila-encabezado">
            <div>
              <h1 className="titulo-pantalla">
                Camila Quispe Andrade
              </h1>

              <p className="datos-estudiante">
                Ingeniería Industrial · 8.º ciclo · código{" "}
                <span className="codigo">20204512</span>
                {" · "}
                <span className="codigo">
                  cquispe@aloe.ulima.edu.pe
                </span>
              </p>
            </div>

            <div className="botones-encabezado">
              <button
                className="boton boton-secundario"
                id="btn-pago"
                type="button"
              >
                Registrar pago
              </button>

              <button
                className="boton boton-destructivo"
                id="btn-bloquear"
                type="button"
              >
                Bloquear cuenta
              </button>
            </div>
          </div>

          {/* MENSAJE DE RESULTADO */}
          <div
            id="mensaje"
            className="alerta oculto"
            role="status"
          />

          {/* AVISO DE DEUDA PENDIENTE */}
          <div className="alerta alerta-roja alerta-borde aviso-deuda">
            <strong>Aviso de deuda pendiente.</strong>{" "}
            <span className="codigo">S/ 45.00</span>
            {" "}por 3 días de retraso en{" "}
            <span className="codigo">PRE-2026-0291</span>,
            {" "}más 1 accesorio faltante por valorizar.
            La estudiante no puede solicitar equipos.
          </div>

          {/* RESUMEN DEL ESTUDIANTE */}
          <div className="tarjetas-resumen">

            <div className="resumen">
              <span className="etiqueta-campo">
                PRÉSTAMOS
              </span>
              <span className="resumen-numero codigo">
                14
              </span>
            </div>

            <div className="resumen">
              <span className="etiqueta-campo">
                RETRASOS ACUMULADOS
              </span>
              <span className="resumen-numero numero-rojo codigo">
                2
              </span>
            </div>

            <div className="resumen">
              <span className="etiqueta-campo">
                PENALIDADES
              </span>
              <span className="resumen-numero numero-ambar codigo">
                S/ 45.00
              </span>
            </div>

            <div className="resumen">
              <span className="etiqueta-campo">
                ESTADO
              </span>
              <span
                className="etiqueta-estado"
                id="estado-cuenta"
              >
                Con deuda
              </span>
            </div>

          </div>

          {/* HISTORIAL DE PRÉSTAMOS */}
          <div className="contenedor-tabla">
            <table className="tabla">
              <thead>
                <tr>
                  <th>PRÉSTAMO</th>
                  <th>EQUIPO Y UNIDAD</th>
                  <th>ENTREGA</th>
                  <th>DEVOLUCIÓN</th>
                  <th>RETRASO</th>
                  <th>PENALIDAD</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td className="codigo">
                    PRE-2026-0291
                  </td>
                  <td>
                    Tableta Wacom Intuos ·{" "}
                    <span className="codigo">
                      INV-TAB-0004
                    </span>
                  </td>
                  <td className="codigo">
                    07/09/2026
                  </td>
                  <td className="codigo">
                    14/09/2026
                  </td>
                  <td>
                    <span className="insignia-roja codigo">
                      3 d
                    </span>
                  </td>
                  <td
                    className="codigo texto-rojo"
                    id="penalidad-0291"
                  >
                    S/ 45.00
                  </td>
                </tr>

                <tr>
                  <td className="codigo">
                    PRE-2026-0245
                  </td>
                  <td>
                    Cámara Canon EOS 90D ·{" "}
                    <span className="codigo">
                      INV-CAM-0010
                    </span>
                  </td>
                  <td className="codigo">
                    20/08/2026
                  </td>
                  <td className="codigo">
                    25/08/2026
                  </td>
                  <td className="texto-gris">
                    —
                  </td>
                  <td className="texto-gris">
                    —
                  </td>
                </tr>

                <tr>
                  <td className="codigo">
                    PRE-2026-0198
                  </td>
                  <td>
                    Trípode Manfrotto MT055 ·{" "}
                    <span className="codigo">
                      INV-TRI-0007
                    </span>
                  </td>
                  <td className="codigo">
                    05/08/2026
                  </td>
                  <td className="codigo">
                    09/08/2026
                  </td>
                  <td>
                    <span className="insignia-roja codigo">
                      1 d
                    </span>
                  </td>
                  <td className="codigo texto-gris">
                    S/ 15.00 pagada
                  </td>
                </tr>

                <tr>
                  <td className="codigo">
                    PRE-2026-0142
                  </td>
                  <td>
                    Multímetro Fluke 117 ·{" "}
                    <span className="codigo">
                      INV-MUL-0022
                    </span>
                  </td>
                  <td className="codigo">
                    14/07/2026
                  </td>
                  <td className="codigo">
                    18/07/2026
                  </td>
                  <td className="texto-gris">
                    —
                  </td>
                  <td className="texto-gris">
                    —
                  </td>
                </tr>

                <tr>
                  <td className="codigo">
                    PRE-2026-0087
                  </td>
                  <td>
                    Kit de robótica Arduino Mega ·{" "}
                    <span className="codigo">
                      INV-ARD-0013
                    </span>
                  </td>
                  <td className="codigo">
                    02/07/2026
                  </td>
                  <td className="codigo">
                    09/07/2026
                  </td>
                  <td className="texto-gris">
                    —
                  </td>
                  <td className="texto-gris">
                    —
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* PIE DE PÁGINA */}
      <footer className="pie">
        <span>
          Almacén de Equipos · Panel del encargado · Almacén H-102
        </span>

        <div className="pie-derecha">
          <span>Manual del encargado</span>
          <span>Soporte: sistemas@ulima.edu.pe</span>
          <span className="codigo">
            Última sincronización: 14/09/2026 08:05
          </span>
        </div>
      </footer>

    </div>
  );
}
