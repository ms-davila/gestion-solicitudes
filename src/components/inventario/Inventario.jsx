import { useEffect } from 'react';

import '../../styles/inventario/inventario.css';

const LEGACY_SCRIPTS = [
  '/legacy/js/data.js',
  '/legacy/js/storage.js',
  '/legacy/js/inventory.js',
  '/legacy/js/app.js',
];

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-inventory-script="${src}"]`);
    if (existing?.dataset.loaded === 'true') return resolve();
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.inventoryScript = src;
    script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.body.appendChild(script);
  });
}

export default function Inventario() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (const src of LEGACY_SCRIPTS) {
          if (cancelled) return;
          await loadClassicScript(src);
        }
      } catch (error) {
        console.error(error);
        const node = document.getElementById('avisos');
        if (node) node.textContent = 'No se pudo iniciar el módulo de inventario. Revisa la consola.';
      }
    })();
    return () => { cancelled = true; };
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
          <a className="pendientes" href="#" data-fuera="1">Solicitudes pendientes</a>
          <span className="avatar" />
        </div>
      </header>

      <nav>
        <p>Operación</p>
        <ul>
          <li><a className="activo" href="#" data-accion="inventario">Inventario</a></li>
          <li><a href="#" data-fuera="1">Solicitudes</a></li>
          <li><a href="#" data-fuera="1">Préstamos vigentes</a></li>
          <li><a href="#" data-fuera="1">Vencidos</a></li>
          <li><a href="#" data-fuera="1">Devoluciones</a></li>
        </ul>
        <hr />
        <p>Complementarios</p>
        <ul>
          <li><a href="#" data-fuera="1">Reservas</a></li>
          <li><a href="#" data-fuera="1">Lista de espera</a></li>
          <li><a href="#" data-fuera="1">Tablero</a></li>
          <li><a href="#" data-fuera="1">Usuarios</a></li>
        </ul>
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
