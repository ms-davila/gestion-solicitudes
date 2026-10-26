import { useEffect } from "react";

import "../../styles/inventario/inventario.css";

import MenuLateral from "../compartidos/MenuLateral.jsx";
import HeaderEncargado from "../compartidos/HeaderEncargado.jsx";

const LEGACY_SCRIPTS = [
  "/legacy/js/data.js",
  "/legacy/js/storage.js",
  "/legacy/js/inventory.js",
  "/legacy/js/app.js",
];

export default function Inventario() {
  useEffect(() => {
    let cancelado = false;

    const original = document.addEventListener;
    const registrados = [];

    (async () => {
      try {
        const textos = await Promise.all(
          LEGACY_SCRIPTS.map(async (src) => {
            const respuesta = await fetch(src);

            if (!respuesta.ok) {
              throw new Error(`No se pudo cargar ${src}`);
            }

            return respuesta.text();
          })
        );

        if (cancelado) return;

        document.addEventListener = function (
          tipo,
          fn,
          opciones
        ) {
          registrados.push([tipo, fn, opciones]);

          return original.call(
            this,
            tipo,
            fn,
            opciones
          );
        };

        try {
          new Function(textos.join("\n;\n"))();
        } finally {
          document.addEventListener = original;
        }

      } catch (error) {
        console.error(error);

        const node = document.getElementById("avisos");

        if (node) {
          node.textContent =
            "No se pudo iniciar el módulo de inventario. Revisa la consola.";
        }
      }
    })();

    return () => {
      cancelado = true;
      document.addEventListener = original;

      registrados.forEach(([tipo, fn, opciones]) => {
        document.removeEventListener(
          tipo,
          fn,
          opciones
        );
      });
    };
  }, []);

  return (
    <div className="app-shell">

      {/* HEADER COMPARTIDO DEL ENCARGADO */}
      <HeaderEncargado
        buscador={
          <form
            className="buscador"
            id="busqueda-general"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              id="q-general"
              placeholder="Buscar por código: INV-OSC-0042"
              aria-label="Buscar por código de inventario"
            />

            <div
              className="sugerencias"
              id="sugerencias"
              hidden
            />
          </form>
        }
      />

      {/* MENÚ LATERAL COMPARTIDO */}
      <MenuLateral />

      {/* CONTENIDO DEL INVENTARIO */}
      <main id="vista" />

      {/* PIE DE PÁGINA */}
      <footer>
        Almacén de Equipos · Panel del encargado · Almacén H-102

        <div className="pie-derecha">
          <a
            href="#"
            data-fuera="1"
            onClick={(e) => e.preventDefault()}
          >
            Manual del encargado
          </a>

          <span>
            Soporte: sistemas@ulima.edu.pe
          </span>

          <button id="restaurar" type="button">
            Restaurar datos
          </button>
        </div>
      </footer>

      {/* CONTENEDORES UTILIZADOS POR EL JS ANTIGUO */}
      <div id="modal" />
      <div id="avisos" />

    </div>
  );
}
