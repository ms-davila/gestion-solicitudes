import { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../../styles/inventario/inventario.css';
import { MENU, esActivo } from '../../rutas.js';
import useIdentidad from '../useIdentidad.js';
import BotonSalir from '../BotonSalir.jsx';

const LEGACY_SCRIPTS = [
  '/legacy/js/data.js',
  '/legacy/js/storage.js',
  '/legacy/js/inventory.js',
  '/legacy/js/app.js',
];

// Los scripts viejos guardan elementos del DOM y registran listeners en `document`.
// Para poder salir y volver a /inventario desde el menú sin que quede vacío:
//  1) se ejecutan dentro de una función (así se pueden correr de nuevo sin chocar con sus `const`),
//  2) se anotan sus listeners de `document` y se quitan al salir de la pantalla.
export default function Inventario() {
  const { nombreCorto, iniciales } = useIdentidad();
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelado = false;
    const original = document.addEventListener;
    const registrados = [];

    (async () => {
      try {
        const textos = await Promise.all(
          LEGACY_SCRIPTS.map(async (src) => {
            const r = await fetch(src);
            if (!r.ok) throw new Error(`No se pudo cargar ${src}`);
            return r.text();
          }),
        );
        if (cancelado) return;
        document.addEventListener = function (tipo, fn, opciones) {
          registrados.push([tipo, fn, opciones]);
          return original.call(this, tipo, fn, opciones);
        };
        try {
          new Function(textos.join('\n;\n'))();
        } finally {
          document.addEventListener = original;
        }
      } catch (error) {
        console.error(error);
        const node = document.getElementById('avisos');
        if (node) node.textContent = 'No se pudo iniciar el módulo de inventario. Revisa la consola.';
      }
    })();

    return () => {
      cancelado = true;
      document.addEventListener = original;
      registrados.forEach(([tipo, fn, opciones]) => document.removeEventListener(tipo, fn, opciones));
    };
  }, []);

  return (
    <div className="app-shell">
      <header>
        <a href="#" data-accion="inventario">
          <span className="logo" />
          <span className="nombre-sitio">Almacén de Equipos</span>
        </a>
        <form className="buscador" id="busqueda-general" autoComplete="off">
          <input type="search" id="q-general" placeholder="⌕ Buscar por código de inventario: INV-OSC-0042" />
          <div className="sugerencias" id="sugerencias" hidden />
        </form>
        <div className="derecha">
          <Link className="pendientes" to="/bandeja">Solicitudes pendientes</Link>
          <span style={{ fontSize: 13 }}>{nombreCorto}</span>
          <span className="avatar">{iniciales}</span>
          <BotonSalir />
        </div>
      </header>

      <nav>
        {MENU.map((seccion, i) => (
          <Fragment key={seccion.titulo}>
            {i > 0 && <hr />}
            <p>{seccion.titulo}</p>
            <ul>
              {seccion.enlaces.map((e) => (
                <li key={e.texto}>
                  {e.to ? (
                    <Link
                      to={e.to}
                      className={esActivo(e, pathname) ? 'activo' : undefined}
                      {...(e.to === '/inventario' ? { 'data-accion': 'inventario' } : {})}
                    >
                      {e.texto}
                    </Link>
                  ) : (
                    <a href="#" onClick={(ev) => ev.preventDefault()}>{e.texto}</a>
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </nav>

      <main id="vista" />

      <footer>
        Almacén de Equipos · Panel del encargado · Almacén H-102
        <div className="pie-derecha">
          <a href="#" data-fuera="1">Manual del encargado</a>
          <span>Soporte: sistemas@ulima.edu.pe</span>
          <button id="restaurar" type="button">Restaurar datos</button>
        </div>
      </footer>
      <div id="modal" />
      <div id="avisos" />
    </div>
  );
}