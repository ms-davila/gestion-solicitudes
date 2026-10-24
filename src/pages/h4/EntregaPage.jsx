import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/h4/base.css";
import "../../styles/h4/layout.css";
import "../../styles/h4/componentes.css";
import "../../styles/h4/historia4.css";

const ACCESORIOS = [
    { id: 1, texto: '2 sondas de medición completas', entregado: true },
    { id: 2, texto: 'Cable USB', entregado: true },
    { id: 3, texto: 'Estuche rígido', entregado: false, nota: 'No se entrega' },
];

export default function EntregaPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Registrar entrega · Almacén de Equipos';
    }, []);

    const registrar = (e) => {
        e.preventDefault();
        // TODO: guardar la entrega antes de ir a la constancia
        navigate('/constancia');
    };

    return (
        <>
            <nav className="migas" aria-label="Ruta de navegación">
                <Link to="/bandeja">Solicitudes</Link> /{' '}
                <a href="#" className="codigo">PRE-2026-0318</a> /{' '}
                <span>Registrar entrega</span>
            </nav>

            <h1 className="titulo-pantalla">Registrar entrega</h1>

            <form className="formulario" onSubmit={registrar}>
                <section className="resumen" aria-label="Datos del préstamo">
                    <dl className="resumen__lista">
                        <div className="resumen__item">
                            <dt className="campo__etiqueta">Estudiante</dt>
                            <dd>Renzo Mendoza Cárdenas</dd>
                        </div>
                        <div className="resumen__item">
                            <dt className="campo__etiqueta">Código de préstamo</dt>
                            <dd className="codigo">PRE-2026-0318</dd>
                        </div>
                        <div className="resumen__item">
                            <dt className="campo__etiqueta">Equipo y unidad</dt>
                            <dd>Osciloscopio TBS1052B · <span className="codigo">INV-OSC-0042</span></dd>
                        </div>
                        <div className="resumen__item">
                            <dt className="campo__etiqueta">Devolución pactada</dt>
                            <dd className="codigo">21/09/2026 · 19:00</dd>
                        </div>
                    </dl>
                </section>

                <fieldset className="campo-grupo">
                    <legend className="subtitulo">Accesorios entregados</legend>
                    {ACCESORIOS.map((a) => (
                        <label className="checklist__item" key={a.id}>
                            <input type="checkbox" name="accesorio" defaultChecked={a.entregado} />
                            <span>{a.texto}</span>
                            {a.nota && <span className="texto-auxiliar">{a.nota}</span>}
                        </label>
                    ))}
                </fieldset>

                <div className="campo">
                    <label className="campo__etiqueta" htmlFor="fecha-entrega">Fecha de entrega</label>
                    <input
                        className="campo__input codigo"
                        type="text"
                        id="fecha-entrega"
                        defaultValue="16/09/2026 · 09:20"
                    />
                </div>

                <div className="campo">
                    <label className="campo__etiqueta" htmlFor="observaciones">Observaciones del estado inicial</label>
                    <textarea
                        className="campo__input"
                        id="observaciones"
                        rows={4}
                        defaultValue="Carcasa con rayadura superficial en la tapa. Pantalla y perillas operativas."
                    />
                </div>

                <div className="formulario__acciones">
                    <Link className="btn btn--secondary" to="/bandeja">Cancelar</Link>
                    <button className="btn btn--primary" type="submit">
                        Registrar entrega y generar constancia
                    </button>
                </div>
            </form>
        </>
    );
}