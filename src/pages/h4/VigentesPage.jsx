import { useEffect } from 'react';
import "../../styles/h4/base.css";
import "../../styles/h4/layout.css";
import "../../styles/h4/componentes.css";
import "../../styles/h4/historia4.css";

const GRUPOS = [
    {
        clave: 'vencidos',
        titulo: 'Vencidos',
        columna: 'Retraso',
        claseFila: 'tabla__fila--vencido',
        acciones: 'registrar',
        filas: [
            { codigo: 'PRE-2026-0291', unidad: 'INV-TAB-0004', estudiante: 'Camila Quispe Andrade', vence: '11/09/2026', indicador: 'vencido', texto: '3 d de retraso' },
            { codigo: 'PRE-2026-0303', unidad: 'INV-CAM-0012', estudiante: 'Alejandra Huamán Solís', vence: '12/09/2026', indicador: 'vencido', texto: '2 d de retraso' },
        ],
    },
    {
        clave: 'hoy',
        titulo: 'Vencen hoy',
        columna: 'Estado',
        claseFila: 'tabla__fila--hoy',
        acciones: 'registrar',
        filas: [
            { codigo: 'PRE-2026-0311', unidad: 'INV-MUL-0021', estudiante: 'Lucía Paredes Ynga', vence: '14/09/2026', indicador: 'hoy', texto: 'vence hoy' },
        ],
    },
    {
        clave: 'curso',
        titulo: 'En curso',
        columna: 'Días restantes',
        claseFila: '',
        acciones: 'curso',
        filas: [
            { codigo: 'PRE-2026-0318', unidad: 'INV-OSC-0042', estudiante: 'Renzo Mendoza Cárdenas', vence: '21/09/2026', indicador: 'normal', texto: 'vence en 7 d' },
            { codigo: 'PRE-2026-0319', unidad: 'INV-CAM-0009', estudiante: 'Fabiana Loayza Ramos', vence: '19/09/2026', indicador: 'normal', texto: 'vence en 5 d' },
            { codigo: 'PRE-2026-0320', unidad: 'INV-TRI-0007', estudiante: 'Mateo Chávez Ríos', vence: '17/09/2026', indicador: 'pronto', texto: 'vence en 3 d' },
            { codigo: 'PRE-2026-0321', unidad: 'INV-ARD-0015', estudiante: 'Diego Salcedo Vera', vence: '25/09/2026', indicador: 'normal', texto: 'vence en 11 d' },
            { codigo: 'PRE-2026-0322', unidad: 'INV-RED-0002', estudiante: 'Sebastián Rojas Ynga', vence: '23/09/2026', indicador: 'normal', texto: 'vence en 9 d' },
        ],
    },
];

export default function VigentesPage() {
    useEffect(() => {
        document.title = 'Préstamos vigentes · Almacén de Equipos';
    }, []);

    return (
        <>
            <div className="encabezado-pantalla">
                <div>
                    <h1 className="titulo-pantalla">Préstamos vigentes</h1>
                    <p className="texto-auxiliar">8 préstamos activos · 1 vence hoy · 2 vencidos</p>
                </div>
            </div>

            {GRUPOS.map((g) => (
                <GrupoPrestamos key={g.clave} grupo={g} />
            ))}
        </>
    );
}

function GrupoPrestamos({ grupo }) {
    return (
        <section className={`grupo grupo--${grupo.clave}`}>
            <h2 className="subtitulo">
                {grupo.titulo} <span className="grupo__contador">{grupo.filas.length}</span>
            </h2>

            <div className="tabla-contenedor">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th scope="col">Préstamo</th>
                            <th scope="col">Unidad</th>
                            <th scope="col">Estudiante</th>
                            <th scope="col">Vencimiento</th>
                            <th scope="col">{grupo.columna}</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupo.filas.map((f) => (
                            <tr key={f.codigo} className={`tabla__fila ${grupo.claseFila}`.trim()}>
                                <td className="codigo">{f.codigo}</td>
                                <td className="codigo">{f.unidad}</td>
                                <td>{f.estudiante}</td>
                                <td className="codigo">{f.vence}</td>
                                <td>
                                    <span className={`indicador indicador--${f.indicador}`}>{f.texto}</span>
                                </td>
                                <td className="tabla__acciones">
                                    {grupo.acciones === 'registrar' ? (
                                        <button type="button" className="btn btn--primary">Registrar devolución</button>
                                    ) : (
                                        <>
                                            <button type="button" className="btn btn--secondary">Devolución</button>
                                            <button type="button" className="btn btn--tertiary">Renovar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}