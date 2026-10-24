
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SOLICITUDES = [
    { id: 1, solicitante: 'Renzo Mendoza Cárdenas', carrera: 'Ing. Electrónica · 6.º', equipo: 'Osciloscopio TBS1052B', fechas: '16/09 → 21/09/2026', motivo: 'Práctica calificada 3 de circuitos', antiguedad: 'hace 2 h', estado: 'enviada' },
    { id: 2, solicitante: 'Alejandra Huamán Solís', deuda: 60, equipo: 'Cámara Canon EOS 90D', fechas: '17/09 → 22/09/2026', motivo: 'Registro fotográfico del taller', antiguedad: 'hace 5 h', estado: 'enviada' },
    { id: 3, solicitante: 'Diego Salcedo Vera', carrera: 'Ing. Industrial · 8.º', equipo: 'Kit de robótica Arduino Mega', fechas: '18/09 → 25/09/2026', motivo: 'Prototipo del proyecto integrador', antiguedad: 'hace 1 d', estado: 'enviada' },
    { id: 4, solicitante: 'Fabiana Loayza Ramos', carrera: 'Comunicación · 5.º', equipo: 'Trípode Manfrotto MT055', fechas: '16/09 → 18/09/2026', motivo: 'Grabación del cortometraje', antiguedad: 'hace 1 d', estado: 'enviada' },
    { id: 5, solicitante: 'Mateo Chávez Ríos', carrera: 'Ing. de Sistemas · 7.º', equipo: 'Analizador de redes portátil', fechas: '19/09 → 23/09/2026', motivo: 'Certificación de cableado del lab.', antiguedad: 'hace 2 d', estado: 'aprobada' },
    { id: 6, solicitante: 'Lucía Paredes Ynga', carrera: 'Ing. Electrónica · 9.º', equipo: 'Multímetro Fluke 117', fechas: '15/09 → 19/09/2026', motivo: 'Mediciones de la tesis', antiguedad: 'hace 3 d', estado: 'aprobada' },
    { id: 7, solicitante: 'Camila Quispe Andrade', deuda: 45, equipo: 'Tableta gráfica Wacom Intuos', fechas: '10/09 → 14/09/2026', motivo: 'Entrega del curso de dibujo', antiguedad: 'hace 6 d', estado: 'rechazada' },
];

// Por ahora fijas; luego vendrán del inventario según el equipo
const UNIDADES = [
    { codigo: 'INV-OSC-0042', ubicacion: 'Almacén H-102 · anaquel 3' },
    { codigo: 'INV-OSC-0043', ubicacion: 'Almacén H-102 · anaquel 3' },
    { codigo: 'INV-OSC-0046', ubicacion: 'Almacén N-005' },
];

const ETIQUETA_ESTADO = { enviada: 'Enviada', aprobada: 'Aprobada', rechazada: 'Rechazada' };

export default function BandejaPage() {
    // null = ningún modal abierto; si no: { tipo: 'aprobar' | 'sin-unidades' | 'rechazar', solicitud }
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.title = 'Bandeja de solicitudes · Almacén de Equipos';
    }, []);

    const cerrar = () => setModal(null);
    const rechazar = (s) => setModal({ tipo: 'rechazar', solicitud: s });
    // Con deuda se muestra el modal de "No se puede aprobar" (igual que tu HTML)
    const aprobar = (s) => setModal({ tipo: s.deuda ? 'sin-unidades' : 'aprobar', solicitud: s });

    return (
        <>
            <div className="encabezado-pantalla">
                <div>
                    <h1 className="titulo-pantalla">Bandeja de solicitudes</h1>
                    <p className="texto-auxiliar">12 solicitudes · Almacén H-102</p>
                </div>
            </div>

            {/* Pestañas: por ahora estáticas, todavía no filtran */}
            <div className="pestanas" role="tablist">
                <a className="pestanas__item is-active" href="#" role="tab" aria-selected="true">Enviadas <span className="pestanas__contador">6</span></a>
                <a className="pestanas__item" href="#" role="tab">Aprobadas <span className="pestanas__contador">4</span></a>
                <a className="pestanas__item" href="#" role="tab">Rechazadas <span className="pestanas__contador">2</span></a>
            </div>

            <div className="aviso aviso--danger" role="alert">
                <strong>Aviso de deuda pendiente.</strong>{' '}
                2 solicitantes de esta bandeja tienen penalidades sin regularizar por S/ 105.00 en total.
                Sus filas están marcadas con el indicador de deuda.
            </div>

            <form className="filtros" onSubmit={(e) => e.preventDefault()}>
                <div className="campo">
                    <label className="campo__etiqueta" htmlFor="filtro-estado">Estado</label>
                    <select className="campo__input" id="filtro-estado">
                        <option>Enviadas</option>
                        <option>Aprobadas</option>
                        <option>Rechazadas</option>
                    </select>
                </div>
                <div className="campo">
                    <label className="campo__etiqueta" htmlFor="filtro-categoria">Categoría</label>
                    <select className="campo__input" id="filtro-categoria">
                        <option>Todas</option>
                        <option>Medición</option>
                        <option>Audiovisual</option>
                        <option>Robótica</option>
                    </select>
                </div>
                <div className="campo campo--ancho">
                    <label className="campo__etiqueta" htmlFor="filtro-busqueda">Buscar</label>
                    <input className="campo__input" type="search" id="filtro-busqueda" placeholder="Estudiante, curso o equipo" />
                </div>
            </form>

            <div className="tabla-contenedor">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th scope="col">Solicitante</th>
                            <th scope="col">Equipo</th>
                            <th scope="col">Fechas</th>
                            <th scope="col">Motivo</th>
                            <th scope="col">Antigüedad</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SOLICITUDES.map((s) => (
                            <FilaSolicitud
                                key={s.id}
                                s={s}
                                onAprobar={() => aprobar(s)}
                                onRechazar={() => rechazar(s)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <nav className="paginacion" aria-label="Paginación">
                <p className="texto-auxiliar">Mostrando 1 a 7 de 12 solicitudes</p>
                <ul className="paginacion__lista">
                    <li><a className="paginacion__enlace" href="#" aria-label="Anterior">‹</a></li>
                    <li><a className="paginacion__enlace is-active" href="#" aria-current="page">1</a></li>
                    <li><a className="paginacion__enlace" href="#">2</a></li>
                    <li><a className="paginacion__enlace" href="#" aria-label="Siguiente">›</a></li>
                </ul>
            </nav>

            {modal?.tipo === 'aprobar' && (
                <ModalAprobar solicitud={modal.solicitud} onCerrar={cerrar} />
            )}
            {modal?.tipo === 'sin-unidades' && (
                <ModalSinUnidades
                    solicitud={modal.solicitud}
                    onCerrar={cerrar}
                    onRechazar={() => rechazar(modal.solicitud)}
                />
            )}
            {modal?.tipo === 'rechazar' && <ModalRechazar onCerrar={cerrar} />}
        </>
    );
}

function FilaSolicitud({ s, onAprobar, onRechazar }) {
    return (
        <tr className={`tabla__fila${s.deuda ? ' tabla__fila--deuda' : ''}`}>
            <td>
                <span className="tabla__principal">{s.solicitante}</span>
                {s.deuda ? (
                    <span className="badge badge--deuda">Deuda S/ {s.deuda.toFixed(2)}</span>
                ) : (
                    <span className="texto-auxiliar">{s.carrera}</span>
                )}
            </td>
            <td>{s.equipo}</td>
            <td className="codigo">{s.fechas}</td>
            <td>{s.motivo}</td>
            <td>{s.antiguedad}</td>
            <td>
                <span className={`badge badge--${s.estado}`}>{ETIQUETA_ESTADO[s.estado]}</span>
            </td>
            <td className="tabla__acciones">
                {s.estado === 'enviada' && (
                    <>
                        <button type="button" className="btn btn--primary" onClick={onAprobar}>Aprobar</button>
                        <button type="button" className="btn btn--destructive" onClick={onRechazar}>Rechazar</button>
                    </>
                )}
                {s.estado === 'aprobada' && (
                    <Link className="btn btn--secondary" to="/entrega">Registrar entrega</Link>
                )}
                {s.estado === 'rechazada' && (
                    <button type="button" className="btn btn--tertiary">Ver motivo</button>
                )}
            </td>
        </tr>
    );
}

function ModalAprobar({ solicitud, onCerrar }) {
    const [unidad, setUnidad] = useState(UNIDADES[0].codigo);

    const enviar = (e) => {
        e.preventDefault();
        // TODO: aprobar la solicitud con la unidad elegida
        onCerrar();
    };

    return (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="aprobar-titulo">
            <div className="modal__fondo" onClick={onCerrar} />
            <div className="modal__caja">
                <h2 className="modal__titulo" id="aprobar-titulo">Aprobar solicitud</h2>
                <p className="texto-auxiliar">
                    {solicitud.equipo} · {solicitud.solicitante} · <span className="codigo">{solicitud.fechas}</span>
                </p>

                <form onSubmit={enviar}>
                    <fieldset className="campo-grupo">
                        <legend className="campo__etiqueta">Asigna una unidad</legend>
                        {UNIDADES.map((u) => (
                            <label className="opcion-unidad" key={u.codigo}>
                                <input
                                    type="radio"
                                    name="unidad"
                                    value={u.codigo}
                                    checked={unidad === u.codigo}
                                    onChange={() => setUnidad(u.codigo)}
                                />
                                <span className="codigo">{u.codigo}</span>
                                <span className="texto-auxiliar">{u.ubicacion}</span>
                                <span className="badge badge--disponible">Disponible</span>
                            </label>
                        ))}
                    </fieldset>

                    <div className="modal__acciones">
                        <button type="button" className="btn btn--secondary" onClick={onCerrar}>Cancelar</button>
                        <button type="submit" className="btn btn--primary">Aprobar y asignar unidad</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ModalSinUnidades({ solicitud, onCerrar, onRechazar }) {
    return (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sin-unidades-titulo">
            <div className="modal__fondo" onClick={onCerrar} />
            <div className="modal__caja">
                <h2 className="modal__titulo" id="sin-unidades-titulo">No se puede aprobar</h2>
                <p className="texto-auxiliar">
                    {solicitud.equipo} · {solicitud.solicitante} · <span className="codigo">{solicitud.fechas}</span>
                </p>

                <div className="aviso aviso--warning" role="alert">
                    <strong>Sin unidades libres en el rango.</strong>{' '}
                    No hay unidades disponibles para {solicitud.fechas}.
                </div>
                <div className="aviso aviso--danger" role="alert">
                    <strong>Solicitante con deuda.</strong>{' '}
                    Tiene una penalidad pendiente de S/ {solicitud.deuda.toFixed(2)}. No puede recibir equipos hasta regularizar en Tesorería.
                </div>

                <div className="modal__acciones">
                    <button type="button" className="btn btn--secondary" onClick={onCerrar}>Cerrar</button>
                    <button type="button" className="btn btn--destructive" onClick={onRechazar}>Rechazar solicitud</button>
                </div>
            </div>
        </div>
    );
}

function ModalRechazar({ onCerrar }) {
    const enviar = (e) => {
        e.preventDefault();
        // TODO: rechazar la solicitud con el motivo y el detalle
        onCerrar();
    };

    return (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rechazar-titulo">
            <div className="modal__fondo" onClick={onCerrar} />
            <div className="modal__caja">
                <h2 className="modal__titulo" id="rechazar-titulo">Rechazar solicitud</h2>
                <p className="texto-auxiliar">El estudiante recibirá el motivo en su solicitud.</p>

                <form onSubmit={enviar}>
                    <div className="campo">
                        <label className="campo__etiqueta" htmlFor="rechazo-motivo">Motivo</label>
                        <select className="campo__input" id="rechazo-motivo">
                            <option>Sin unidades disponibles</option>
                            <option>Falta autorización del docente</option>
                            <option>Penalidad pendiente</option>
                            <option>Otro</option>
                        </select>
                    </div>

                    <div className="campo">
                        <label className="campo__etiqueta" htmlFor="rechazo-detalle">Detalle</label>
                        <textarea
                            className="campo__input"
                            id="rechazo-detalle"
                            rows={4}
                            placeholder="Explica al estudiante qué debe corregir"
                        />
                        <p className="campo__ayuda">Mínimo 20 caracteres.</p>
                    </div>

                    <div className="modal__acciones">
                        <button type="button" className="btn btn--secondary" onClick={onCerrar}>Cancelar</button>
                        <button type="submit" className="btn btn--destructive">Rechazar solicitud</button>
                    </div>
                </form>
            </div>
        </div>
    );
}