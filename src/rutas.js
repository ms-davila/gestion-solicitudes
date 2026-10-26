/* MENÚ LATERAL DEL ENCARGADO */

export const MENU = [
  {
    titulo: "Operación",
    enlaces: [
      {
        texto: "Inventario",
        to: "/inventario"
      },
      {
        texto: "Solicitudes",
        to: "/bandeja",
        tambien: ["/entrega", "/constancia"],
        contadorId: "solicitudes"
      },
      {
        texto: "Préstamos vigentes",
        to: "/vigentes",
        contadorId: "vigentes"
      },
      {
        texto: "Devoluciones",
        to: "/devoluciones"
      }
    ]
  },
  {
    titulo: "Complementarios",
    enlaces: [
      {
        texto: "Reservas",
        to: "/mis-reservas"
      },
      {
        texto: "Lista de espera",
        to: "/lista-espera"
      },
      {
        texto: "Usuarios",
        to: "/devoluciones/usuarios"
      }
    ]
  }
];

/* IDENTIFICAR ENLACE ACTIVO */

export function esActivo(enlace, pathname) {
  return (
    !enlace.alerta &&
    !!enlace.to &&
    (
      enlace.to === pathname ||
      !!enlace.tambien?.includes(pathname)
    )
  );
}

/* MENÚ SUPERIOR DEL ESTUDIANTE */

export const MENU_ESTUDIANTE = [
  {
    texto: "Catálogo",
    to: "/catalogo",
    tambien: ["/solicitarproducto"]
  },
  {
    texto: "Mis solicitudes",
    to: "/missolicitudes"
  },
  {
    texto: "Mis reservas",
    to: "/mis-reservas"
  },
  {
    texto: "Calendario",
    to: "/calendario"
  }
];

/* MENÚ SUPERIOR DEL VISITANTE */

export const MENU_VISITANTE = [
  {
    texto: "Inicio",
    to: "/"
  },
  {
    texto: "Catálogo",
    to: "/catalogo"
  },
  {
    texto: "Reglas del préstamo",
    to: "/"
  },
  {
    texto: "Ayuda",
    to: "/"
  }
];

/* MENÚ SUPERIOR DEL ENCARGADO
   PARA PANTALLAS DE RESERVAS */

export const MENU_ENCARGADO_SUPERIOR = [
  {
    texto: "Inventario",
    to: "/inventario"
  },
  {
    texto: "Solicitudes",
    to: "/bandeja"
  },
  {
    texto: "Calendario",
    to: "/calendario"
  },
  {
    texto: "Mis reservas",
    to: "/mis-reservas"
  },
  {
    texto: "Lista de espera",
    to: "/lista-espera"
  }
];

/* PÁGINA INICIAL SEGÚN EL ROL */

export function inicioPorRol(rol) {
  if (rol === "encargado") {
    return "/inventario";
  }

  if (rol === "estudiante") {
    return "/mi-cuenta";
  }

  return "/";
}

/* MENÚ SUPERIOR SEGÚN EL ROL */

export function menuSuperior(rol) {
  if (rol === "encargado") {
    return MENU_ENCARGADO_SUPERIOR;
  }

  if (rol === "estudiante") {
    return MENU_ESTUDIANTE;
  }

  return MENU_VISITANTE;
}
