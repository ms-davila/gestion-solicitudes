import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { inicioPorRol } from '../../../rutas.js';
import Campo from '../Campo/Campo.jsx';
import Aviso from '../Aviso/Aviso.jsx';

const Login = () => {

    const { login } = useUsuario();
    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [recordar, setRecordar] = useState(false);

    const [intentos, setIntentos] = useState(5);     
    const [errores, setErrores] = useState({});      
    const [aviso, setAviso] = useState(null);        
    const [ingresando, setIngresando] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();   

        const usuario = login(correo.trim().toLowerCase(), clave, recordar);

        if (!usuario) {
            const quedan = intentos - 1;
            setIntentos(quedan);
            setErrores({ correo: '', clave: 'Verifica tus datos e inténtalo otra vez.' });
            if (quedan > 0) {
                setAviso({
                    clase: 'alerta-roja',
                    contenido: <><b>Correo o contraseña incorrectos.</b> Te quedan {quedan} intentos.</>,
                });
            } else {
                setAviso({
                    clase: 'alerta-roja',
                    contenido: <><b>Demasiados intentos.</b> Espera unos minutos antes de volver a intentar.</>,
                });
            }
            return;
        }

        setErrores({});
        setIngresando(true);
        // estudiante -> /mi-cuenta · encargado -> /inventario
        const destino = inicioPorRol(usuario.rol);

        let espera = 800;
        if (usuario.deuda > 0) {
            espera = 2500;
            setAviso({
                clase: 'alerta-amarilla',
                contenido: (
                    <>
                        <b>Cuenta bloqueada:</b> penalidad pendiente de S/ {usuario.deuda.toFixed(2)} {usuario.motivoDeuda}.
                        Puedes ingresar para ver tu historial, pero no solicitar equipos hasta regularizar en Tesorería.
                    </>
                ),
            });
        } else {
            setAviso(null);
        }
        setTimeout(() => navigate(destino), espera);
    };

    return (
        <main>
            <section className="tarjeta tarjeta-estrecha">
                <h1>Inicia sesión</h1>
                <p className="texto-ayuda">Usa tu correo institucional para solicitar y seguir tus préstamos.</p>

                <form onSubmit={handleSubmit}>
                    <Campo
                        etiqueta="CORREO INSTITUCIONAL"
                        nombre="correo"
                        valor={correo}
                        onChange={e => setCorreo(e.target.value)}
                        error={errores.correo}
                        placeholder="tucorreo@aloe.ulima.edu.pe"
                        mono
                    />
                    <Campo
                        etiqueta="CONTRASEÑA"
                        nombre="clave"
                        tipo="password"
                        valor={clave}
                        onChange={e => setClave(e.target.value)}
                        error={errores.clave}
                        placeholder="••••••••"
                    />

                    <div className="fila-enlaces">
                        <label>
                            <input type="checkbox" checked={recordar} onChange={e => setRecordar(e.target.checked)} /> Recordarme
                        </label>
                        <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <Aviso aviso={aviso} />

                    <button type="submit" className="boton boton-primario boton-ancho" disabled={ingresando || intentos <= 0}>
                        {ingresando ? 'Ingresando…' : 'Ingresar'}
                    </button>
                </form>

                <p className="texto-ayuda texto-centro" style={{ marginTop: '15px' }}>
                    ¿No tienes cuenta? <Link to="/crear-cuenta">Crear cuenta</Link>
                </p>
            </section>
        </main>
    );
}

export default Login