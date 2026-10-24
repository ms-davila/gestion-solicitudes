import { Fragment } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import "../../styles/h4/base.css";
import "../../styles/h4/layout.css";
import "../../styles/h4/componentes.css";
import "../../styles/h4/historia4.css";


const SECCIONES = [
    {
        titulo: 'Operación',
        enlaces: [
            { texto: 'Inventario', contador: 42 },
            { texto: 'Solicitudes', to: '/bandeja', tambien: ['/entrega', '/constancia'], contador: 12 },
            { texto: 'Préstamos vigentes', to: '/vigentes', contador: 8 },
            { texto: 'Vencidos', to: '/vigentes', contador: 2, alerta: true },
            { texto: 'Devoluciones', contador: '—' },
        ],
    },
    {
        titulo: 'Complementarios',
        enlaces: [
            { texto: 'Reservas', contador: 5 },
            { texto: 'Lista de espera', contador: 6 },
            { texto: 'Tablero' },
            { texto: 'Usuarios', contador: 15 },
        ],
    },
];

export default function LayoutEncargado() {
    const { pathname } = useLocation();

    return (
        <div className="pagina">
            <header className="header">
                <div className="square"></div>
                <Link className="header__marca" to="/bandeja">Almacén de Equipos</Link>
                <span className="header__panel">Panel del encargado</span>

                <form className="header__buscador" role="search" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="campo__input"
                        type="search"
                        id="buscar-prestamo"
                        placeholder="Buscar por código: PRE-2026-0318"
                    />
                </form>

                <Link className="header__pendientes" to="/bandeja">
                    Solicitudes pendientes <span className="header__contador">12</span>
                </Link>

                <div className="header__usuario">
                    <span className="header__usuario-nombre">Elena Rivas · H-102</span>
                    <span className="avatar">ER</span>
                </div>
            </header>

            <div className="app">
                <aside className="sidebar">
                    <nav aria-label="Navegación del encargado">
                        {SECCIONES.map((seccion) => (
                            <Fragment key={seccion.titulo}>
                                <h2 className="sidebar__titulo">{seccion.titulo}</h2>
                                <ul className="sidebar__lista">
                                    {seccion.enlaces.map((e) => {
                                        const activo = !e.alerta && (e.to === pathname || e.tambien?.includes(pathname));
                                        return (
                                            <li key={e.texto}>
                                                <Link
                                                    to={e.to ?? '#'}
                                                    className={`sidebar__enlace${activo ? ' is-active' : ''}${e.alerta ? ' sidebar__enlace--alerta' : ''}`}
                                                    aria-current={activo ? 'page' : undefined}
                                                >
                                                    {e.texto}
                                                    {e.contador !== undefined && (
                                                        <span className="sidebar__contador">{e.contador}</span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Fragment>
                        ))}
                    </nav>
                </aside>

                <main className="contenido">
                    <Outlet />
                </main>
            </div>

            <footer className="footer">
                <p>Almacén de Equipos · Panel del encargado · Almacén H-102</p>
                <p>
                    <a href="#">Manual del encargado</a>
                    <span>Soporte: sistemas@ulima.edu.pe</span>
                    <span>Última sincronización: <span className="codigo">14/09/2026 08:05</span></span>
                </p>
            </footer>
        </div>
    );
}