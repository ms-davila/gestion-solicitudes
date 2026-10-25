import { Navigate, Outlet } from 'react-router-dom';
import { useUsuario } from './cuenta y registro/context/UsuarioContext.jsx';

// Protege un grupo de rutas según el rol de la sesión.
//   <Route element={<RutaProtegida roles={['encargado']} />}> ...rutas... </Route>
// - sin sesión          -> /login
// - rol no permitido    -> /403
// - 'publico' en roles  -> también deja pasar al visitante sin sesión
export default function RutaProtegida({ roles }) {
  const { usuarioSesion } = useUsuario();

  if (!usuarioSesion) {
    if (roles.includes('publico')) return <Outlet />;
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(usuarioSesion.rol) && !roles.includes('publico')) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}
