import { useNavigate } from 'react-router-dom';
import { useUsuario } from './cuenta y registro/context/UsuarioContext.jsx';
import { inicioPorRol } from '../rutas.js';

// Datos de la sesión listos para pintar en cualquier cabecera.
export default function useIdentidad() {
  const { usuarioSesion, logout } = useUsuario();
  const navigate = useNavigate();

  const nombres = usuarioSesion?.nombres?.split(' ')[0] ?? '';
  const apellido = usuarioSesion?.apellidos?.split(' ')[0] ?? '';
  const rol = usuarioSesion?.rol ?? null;

  return {
    rol,
    nombreCorto: `${nombres} ${apellido}`.trim(),
    iniciales: (nombres.charAt(0) + apellido.charAt(0)).toUpperCase(),
    paginaCuenta: inicioPorRol(rol),
    salir: (e) => {
      e?.preventDefault?.();
      navigate('/');
      setTimeout(logout, 100);
    },
  };
}