import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU, esActivo } from '../rutas.js';

// Menú lateral de Devoluciones y Usuarios (usa las clases de Devoluciones.css).
// conContadores=true muestra los números a la derecha (como en Usuarios).
export default function MenuLateral({ conContadores = false }) {
  const { pathname } = useLocation();

  return (
    <nav className="menu-lateral">
      {MENU.map((seccion, i) => (
        <Fragment key={seccion.titulo}>
          {i > 0 && <hr className="menu-linea" />}
          <p className="menu-titulo">{seccion.titulo.toUpperCase()}</p>
          {seccion.enlaces.map((e) => {
            const clase = `menu-item${esActivo(e, pathname) ? ' menu-item-activo' : ''}`;
            const contador = conContadores && e.contador !== undefined && (
              <span className={`menu-contador${e.color ? ` menu-contador-${e.color}` : ''}`}>{e.contador}</span>
            );
            return e.to ? (
              <Link key={e.texto} className={clase} to={e.to}>
                <span>{e.texto}</span>{contador}
              </Link>
            ) : (
              <a key={e.texto} className={clase} href="#" onClick={(ev) => ev.preventDefault()}>
                <span>{e.texto}</span>{contador}
              </a>
            );
          })}
        </Fragment>
      ))}
    </nav>
  );
}
