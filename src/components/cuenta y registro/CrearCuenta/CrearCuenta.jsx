import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aviso from '../Aviso/Aviso.jsx';

const CrearCuenta = () => {

    const navigate = useNavigate();

    const [tipo, setTipo] = useState('');    
    const [aviso, setAviso] = useState(null);

    const handleContinuar = () => {
        if (tipo === 'estudiante') {
            navigate('/registro-estudiante');
        } else if (tipo === 'encargado') {
            navigate('/registro-encargado');
        } else {
            setAviso({ clase: 'alerta-roja', contenido: 'Elige si eres estudiante o encargado de almacén para continuar.' });
        }
    };

    return (
        <main>
            <section className="tarjeta tarjeta-estrecha">
                <h1>Crear cuenta</h1>
                <p className="texto-ayuda">Indica qué tipo de cuenta quieres crear.</p>

                <label className="opcion-cuenta">
                    <input type="radio" name="tipo" checked={tipo === 'estudiante'} onChange={() => setTipo('estudiante')} />
                    <span>
                        <b>Soy estudiante</b><br />
                        <span className="ayuda-campo">Solicita equipos y sigue tus préstamos. Correo @aloe.ulima.edu.pe</span>
                    </span>
                </label>

                <label className="opcion-cuenta">
                    <input type="radio" name="tipo" checked={tipo === 'encargado'} onChange={() => setTipo('encargado')} />
                    <span>
                        <b>Soy encargado de almacén</b><br />
                        <span className="ayuda-campo">Gestiona inventario, entregas y devoluciones. Correo @ulima.edu.pe</span>
                    </span>
                </label>

                <Aviso aviso={aviso} />

                <div className="botones-fila">
                    <button className="boton boton-secundario" onClick={() => navigate('/')}>Cancelar</button>
                    <button className="boton boton-primario" onClick={handleContinuar}>Continuar</button>
                </div>
            </section>
        </main>
    );
}

export default CrearCuenta
