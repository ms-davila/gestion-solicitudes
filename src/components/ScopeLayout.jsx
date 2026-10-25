import { Outlet, useLocation } from 'react-router-dom';

// Cada grupo de pantallas recibe una clase contenedora. Los CSS se aíslan con
// esa clase (node aislar-css.mjs "archivo.css" pagina-xxx), así no se pisan.
const RUTAS_CUENTA = [
  '/', '/login', '/crear-cuenta', '/registro-estudiante',
  '/registro-encargado', '/recuperar', '/mi-cuenta', '/403', '/404',
];

function obtenerClase(pathname) {
  if (RUTAS_CUENTA.includes(pathname)) return 'pagina-cuenta';
  if (pathname.startsWith('/catalogo')) return 'pagina-catalogo';
  if (pathname.startsWith('/mis-solicitudes')) return 'pagina-solicitudes';
  if (pathname.startsWith('/inventario')) return 'pagina-inventario';
  if (pathname.startsWith('/devoluciones')) return 'pagina-devoluciones';
  if (['/calendario', '/mis-reservas', '/lista-espera'].some(r => pathname.startsWith(r))) return 'pagina-reservas';
  if (['/bandeja', '/entrega', '/constancia', '/vigentes'].some(r => pathname.startsWith(r))) return 'pagina-encargado';
  return '';
}

export default function ScopeLayout() {
  const { pathname } = useLocation();
  const clase = obtenerClase(pathname);
  if (!clase) return <Outlet />;
  return (
    <div className={clase}>
      <Outlet />
    </div>
  );
}
