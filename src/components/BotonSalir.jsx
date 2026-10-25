import useIdentidad from './useIdentidad.js';

// Enlace "Salir" discreto para las cabeceras que no tienen uno.
export default function BotonSalir({ style }) {
  const { salir } = useIdentidad();
  return (
    <a href="#salir" onClick={salir} style={{ fontSize: 13, marginLeft: 12, color: 'inherit', ...style }}>
      Salir
    </a>
  );
}
