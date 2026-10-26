import { useEffect } from 'react';
import "../../styles/aprobacion y entrega/base.css";
import "../../styles/aprobacion y entrega/layout.css";
import "../../styles/aprobacion y entrega/componentes.css";
import "../../styles/aprobacion y entrega/historia4.css";

const ACCESORIOS = [
    { texto: '2 sondas de medición', entregado: 'Sí' },
    { texto: 'Cable USB', entregado: 'Sí' },
    { texto: 'Estuche rígido', entregado: 'No' },
];

export default function ConstanciaPage() {
    useEffect(() => {
        document.title = 'Constancia de entrega · Almacén de Equipos';
    }, []);

    return (
        <>
            <div className="encabezado-pantalla">
                <h1 className="titulo-pantalla">Constancia de entrega</h1>
                <div className="encabezado-pantalla__acciones">
                    {/* Por ahora "Descargar PDF" abre el diálogo de impresión: ahí se puede elegir "Guardar como PDF" */}
                    <button type="button" className="btn btn--secondary" onClick={() => window.print()}>
                        Descargar PDF
                    </button>
                    <button type="button" className="btn btn--primary" onClick={() => window.print()}>
                        Imprimir
                    </button>
                </div>
            </div>

            <article className="constancia">
                <header className="constancia__cabecera">
                    <p className="constancia__institucion">Universidad de Lima · Facultad de Ingeniería</p>
                    <h2 className="constancia__titulo">Constancia de entrega de equipo</h2>
                </header>

                <dl className="constancia__datos">
                    <div className="constancia__dato">
                        <dt className="campo__etiqueta">Código de préstamo</dt>
                        <dd className="codigo">PRE-2026-0318</dd>
                    </div>

                    <div className="constancia__dato">
                        <dt className="campo__etiqueta">Estudiante</dt>
                        <dd>
                            Renzo Andrés Mendoza Cárdenas
                            <span className="texto-auxiliar">
                                Ing. Electrónica · 6.º ciclo · código <span className="codigo">20213456</span>
                            </span>
                        </dd>
                    </div>

                    <div className="constancia__dato">
                        <dt className="campo__etiqueta">Curso asociado</dt>
                        <dd>
                            IN324 Laboratorio de Circuitos
                            <span className="texto-auxiliar">Docente: Ing. Elena Rivas Talledo</span>
                        </dd>
                    </div>

                    <div className="constancia__dato">
                        <dt className="campo__etiqueta">Equipo y unidad</dt>
                        <dd>
                            Osciloscopio Tektronix TBS1052B
                            <span className="texto-auxiliar">
                                <span className="codigo">INV-OSC-0042</span> · Almacén H-102
                            </span>
                        </dd>
                    </div>

                    <div className="constancia__dato">
                        <dt className="campo__etiqueta">Fechas</dt>
                        <dd>
                            Entrega: <span className="codigo">16/09/2026 09:20</span>
                            <br />
                            Devolución: <span className="codigo">21/09/2026 19:00</span>
                        </dd>
                    </div>
                </dl>

                <section>
                    <h3 className="subtitulo">Accesorios entregados</h3>
                    <table className="tabla tabla--simple">
                        <thead>
                            <tr>
                                <th scope="col">Accesorio</th>
                                <th scope="col">Entregado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ACCESORIOS.map((a) => (
                                <tr key={a.texto}>
                                    <td>{a.texto}</td>
                                    <td>{a.entregado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <p className="constancia__declaracion">
                    Declaro recibir el equipo en las condiciones descritas y me comprometo a devolverlo en la fecha pactada.
                    El retraso genera una penalidad de S/ 15.00 por día y suspende nuevos préstamos.
                </p>

                <div className="constancia__firmas">
                    <div className="constancia__firma">
                        <span className="constancia__linea"></span>
                        <p>Firma del estudiante</p>
                    </div>
                    <div className="constancia__firma">
                        <span className="constancia__linea"></span>
                        <p>Firma del encargado de almacén</p>
                    </div>
                </div>
            </article>
        </>
    );
}