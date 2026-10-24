import { useState } from 'react';
import { EQUIPOS } from '../data/opciones.js';

const Inicio = () => {

    const [busqueda, setBusqueda] = useState('');

    const handleBuscar = () => {
        if (busqueda === '') {
            alert('Escribe el nombre de un equipo o una categoría.');
        } else {
            alert('El catálogo pertenece a otra historia de usuario. Buscaste: ' + busqueda);
        }
    };

    return (
        <>
            <section className="hero">
                <div className="hero-texto">
                    <h1>Reserva el equipo del laboratorio antes de tu práctica</h1>
                    <p className="texto-ayuda">
                        Busca por equipo o categoría, revisa cuántas unidades hay libres y solicita el préstamo con tus fechas. Recojo en el Almacén H-102.
                    </p>
                    <div className="fila-buscar">
                        <input
                            className="campo"
                            type="text"
                            placeholder="Busca un equipo: «osciloscopio» o «robótica»"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                        <button className="boton boton-primario" onClick={handleBuscar}>Buscar</button>
                    </div>
                </div>
                <div className="foto foto-hero">fotografía del almacén · 520 × 300</div>
            </section>

            <main className="ancho">
                <h2>Equipos destacados</h2>

                {/* tarjeta x c/u equipo de la lista */}
                <div className="lista-equipos">
                    {EQUIPOS.map(equipo => (
                        <article key={equipo.id}>
                            <div className="foto foto-equipo">foto 1:1</div>
                            <p className="nombre-equipo">{equipo.nombre}</p>
                            <p className="marca-equipo">{equipo.marca}</p>
                            <span className={equipo.libres === 0 ? 'libres libres-cero codigo' : 'libres codigo'}>
                                {equipo.libres} / {equipo.total} libres
                            </span>
                        </article>
                    ))}
                </div>

                <div className="lista-pasos">
                    <article>
                        <p><span className="numero-paso">1</span> <b>Solicita con anticipación</b></p>
                        <p className="texto-ayuda">El encargado responde en un máximo de 24 horas hábiles.</p>
                    </article>
                    <article>
                        <p><span className="numero-paso">2</span> <b>Recoge con tu carné</b></p>
                        <p className="texto-ayuda">Verifica los accesorios en la entrega y firma la constancia.</p>
                    </article>
                    <article>
                        <p><span className="numero-paso">3</span> <b>Devuelve a tiempo</b></p>
                        <p className="texto-ayuda">Cada día de retraso genera penalidad y bloquea nuevos préstamos.</p>
                    </article>
                </div>
            </main>
        </>
    );
}

export default Inicio
