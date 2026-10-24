import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import { contrasenaValida } from '../../utils/validaciones.js';
import Campo from '../Campo/Campo.jsx';
import Aviso from '../Aviso/Aviso.jsx';

const Recuperar = () => {

    const { update } = useUsuario();

    const [paso, setPaso] = useState(1);                  
    const [correo, setCorreo] = useState('');
    const [correoEnviado, setCorreoEnviado] = useState('');
    const [errorCorreo, setErrorCorreo] = useState(undefined);
    const [segundos, setSegundos] = useState(45);         
    const [claveNueva, setClaveNueva] = useState('');
    const [errorClave, setErrorClave] = useState(undefined);
    const [aviso, setAviso] = useState(null);
    const [guardada, setGuardada] = useState(false);

    useEffect(() => {
        if (paso !== 2 || segundos <= 0) {
            return;
        }
        const temporizador = setTimeout(() => setSegundos(s => s - 1), 1000);
        return () => clearTimeout(temporizador);   
    }, [paso, segundos]);

    const reloj = '00:' + (segundos < 10 ? '0' : '') + segundos;

    const handleEnviar = (e) => {
        e.preventDefault();
        const valor = correo.trim().toLowerCase();
        const valido = valor.endsWith('@aloe.ulima.edu.pe') || valor.endsWith('@ulima.edu.pe');
        if (!valido) {
            setErrorCorreo('Escribe tu correo institucional (@aloe.ulima.edu.pe).');
            return;
        }
        setErrorCorreo(undefined);
        setCorreoEnviado(valor);
        setSegundos(45);
        setPaso(2);
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        if (!contrasenaValida(claveNueva)) {
            setErrorClave('Mínimo 8 caracteres, una mayúscula y un número.');
            return;
        }
        setErrorClave(undefined);
        update(correoEnviado, { clave: claveNueva });
        setGuardada(true);
        setAviso({
            clase: 'alerta-verde',
            contenido: <><b>✓ Contraseña actualizada.</b> Ya puedes <Link to="/login">iniciar sesión</Link>.</>,
        });
    };

    return (
        <main>
            <section className="tarjeta tarjeta-estrecha">

                {/* Círculos 1 · 2 · 3 */}
                <div className="pasos">
                    <span className={paso === 1 ? 'paso paso-activo' : 'paso'}>1</span>
                    <span className={paso === 2 ? 'paso paso-activo' : 'paso'}>2</span>
                    <span className={paso === 3 ? 'paso paso-activo' : 'paso'}>3</span>
                </div>

                {/*escribir el correo */}
                {paso === 1 && (
                    <form onSubmit={handleEnviar}>
                        <h1>Recupera tu acceso</h1>
                        <p className="texto-ayuda">Te enviaremos un enlace para crear una contraseña nueva. El enlace expira en 60 minutos.</p>
                        <Campo
                            etiqueta="CORREO INSTITUCIONAL" nombre="correo" valor={correo}
                            onChange={e => setCorreo(e.target.value)} error={errorCorreo}
                            placeholder="nombre@aloe.ulima.edu.pe" mono
                        />
                        <button type="submit" className="boton boton-primario boton-ancho">Enviar enlace</button>
                        <p className="texto-centro" style={{ marginTop: '15px' }}>
                            <Link to="/login">Volver al inicio de sesión</Link>
                        </p>
                    </form>
                )}

                {/* confirmación de envío */}
                {paso === 2 && (
                    <div className="texto-centro">
                        <h2>✉ Revisa tu correo</h2>
                        <p className="texto-ayuda">
                            Enviamos el enlace a <span className="codigo">{correoEnviado}</span>. Podrás reenviarlo en <span className="codigo">{reloj}</span>.
                        </p>
                        <button className="boton boton-secundario" disabled={segundos > 0} onClick={() => setSegundos(45)}>Reenviar enlace</button>
                        <button className="boton boton-primario" onClick={() => setPaso(3)}>Ya abrí el enlace</button>
                    </div>
                )}

                {/* contraseña nueva */}
                {paso === 3 && (
                    <form onSubmit={handleGuardar}>
                        <h1>Nueva contraseña</h1>
                        <Campo
                            etiqueta="NUEVA CONTRASEÑA" nombre="claveNueva" tipo="password" valor={claveNueva}
                            onChange={e => setClaveNueva(e.target.value)} error={errorClave}
                        />
                        {/* Indicador de seguridad */}
                        {claveNueva !== '' && (
                            contrasenaValida(claveNueva)
                                ? <span className="ayuda-campo" style={{ color: '#1E7F4D' }}>Segura</span>
                                : <span className="ayuda-campo" style={{ color: '#B4322B' }}>Débil: mínimo 8 caracteres, una mayúscula y un número.</span>
                        )}
                        <Aviso aviso={aviso} />
                        <button type="submit" className="boton boton-primario boton-ancho" disabled={guardada}>Guardar contraseña</button>
                    </form>
                )}
            </section>
        </main>
    );
}

export default Recuperar
