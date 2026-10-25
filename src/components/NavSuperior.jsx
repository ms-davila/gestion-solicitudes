import { Link, useLocation } from 'react-router-dom';
import { menuSuperior } from '../rutas.js';
import useIdentidad from './useIdentidad.js';

// Enlaces del menú superior según el rol (estudiante / encargado / visitante).
// Se usa dentro del <nav> propio de cada pantalla para no tocar sus estilos.
export default function NavSuperior({ claseActivo = 'activo' }) {
  const { pathname } = useLocation();
  const { rol } = useIdentidad();

  return menuSuperior(rol).map((e) => {
    const activo = e.to === pathname || e.tambien?.includes(pathname);
    return (
      <Link key={e.texto} to={e.to} className={activo ? claseActivo : undefined}>
        {e.texto}
      </Link>
    );
  });
}
