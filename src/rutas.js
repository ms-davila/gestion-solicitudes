// Fuente única del menú lateral del encargado.
// Para agregar o cambiar una opción, edítala SOLO aquí.
// - to:       ruta a la que navega (sin "to" = aún no existe la pantalla)
// - tambien:  otras rutas donde esta opción debe verse resaltada
// - contador: número que se muestra al lado (opcional)
// - color:    'azul' | 'rojo' para el contador (opcional)
// - alerta:   true = nunca se resalta como activa (ej. Vencidos comparte ruta con Vigentes)
export const MENU = [
  {
    titulo: 'Operación',
    enlaces: [
      { texto: 'Inventario', to: '/inventario', contador: 42 },
      { texto: 'Solicitudes', to: '/bandeja', tambien: ['/entrega', '/constancia'], contador: 12, color: 'azul' },
      { texto: 'Préstamos vigentes', to: '/vigentes', contador: 8 },
      { texto: 'Vencidos', to: '/vigentes', contador: 2, color: 'rojo', alerta: true },
      { texto: 'Devoluciones', to: '/devoluciones', contador: '—' },
    ],
  },
  {
    titulo: 'Complementarios',
    enlaces: [
      { texto: 'Reservas', to: '/calendario', tambien: ['/mis-reservas'], contador: 5 },
      { texto: 'Lista de espera', to: '/lista-espera', contador: 6 },
      { texto: 'Tablero' },
      { texto: 'Usuarios', to: '/devoluciones/usuarios', contador: 15 },
    ],
  },
];

export function esActivo(enlace, pathname) {
  return !enlace.alerta && !!enlace.to &&
    (enlace.to === pathname || !!enlace.tambien?.includes(pathname));
}

// ---------------------------------------------------------------------------
// Navegación por rol (fuente única). Edita SOLO aquí para cambiar menús.
// ---------------------------------------------------------------------------

// Menú superior del ESTUDIANTE (ventanas 1.6, 3.x, 6.1, 6.3)
export const MENU_ESTUDIANTE = [
  { texto: 'Catálogo', to: '/catalogo', tambien: ['/solicitarproducto'] },
  { texto: 'Mis solicitudes', to: '/missolicitudes' },
  { texto: 'Mis reservas', to: '/mis-reservas' },
  { texto: 'Calendario', to: '/calendario' },
];

// Menú superior del VISITANTE (sin sesión)
export const MENU_VISITANTE = [
  { texto: 'Inicio', to: '/' },
  { texto: 'Catálogo', to: '/catalogo' },
  { texto: 'Reglas del préstamo', to: '/' },
  { texto: 'Ayuda', to: '/' },
];

// Menú superior que usa el ENCARGADO en las pantallas de reservas
// (comparten componente con el estudiante)
export const MENU_ENCARGADO_SUPERIOR = [
  { texto: 'Inventario', to: '/inventario' },
  { texto: 'Solicitudes', to: '/bandeja' },
  { texto: 'Calendario', to: '/calendario' },
  { texto: 'Mis reservas', to: '/mis-reservas' },
  { texto: 'Lista de espera', to: '/lista-espera' },
];

// A dónde va cada rol justo después de iniciar sesión
export function inicioPorRol(rol) {
  if (rol === 'encargado') return '/inventario';
  if (rol === 'estudiante') return '/mi-cuenta';
  return '/';
}

// Menú superior según el rol de la sesión
export function menuSuperior(rol) {
  if (rol === 'encargado') return MENU_ENCARGADO_SUPERIOR;
  if (rol === 'estudiante') return MENU_ESTUDIANTE;
  return MENU_VISITANTE;
}