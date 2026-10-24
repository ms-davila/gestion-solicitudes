import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext.jsx';

const Header = () => {

    const { usuarioSesion, logout } = useUsuario();
    const navigate = useNavigate();

    const handleSalir = (e) => {
        e.preventDefault();  
        logout();
        navigate('/');
    };

    let nombre = '';
    let apellido = '';
    let iniciales = '';
    let paginaCuenta = '/';
    if (usuarioSesion) {
        nombre = usuarioSesion.nombres.split(' ')[0];
        apellido = usuarioSesion.apellidos.split(' ')[0];
        iniciales = (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
        if (usuarioSesion.rol === 'estudiante') {
            paginaCuenta = '/mi-cuenta';
        }
    }

    return (
        <header>
            <div className="cabecera-izquierda">
                <Link to="/">
                    <div className="logo"></div>
                    <span className="nombre-sistema">Almacén de Equipos</span>
                </Link>
            </div>

            <nav>
                <ul>
                    <li><a href="#">Catálogo</a></li>
                    <li><a href="#">Mis solicitudes</a></li>
                    <li><a href="#">Mis reservas</a></li>
                    <li><a href="#">Calendario</a></li>
                </ul>
            </nav>

            <div className="cabecera-derecha">
                {usuarioSesion ? (
                    <>
                        <span>{nombre} {apellido}</span>
                        <Link to={paginaCuenta} className="logo-usuario">{iniciales}</Link>
                        <a href="#salir" onClick={handleSalir}>Salir</a>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="boton boton-secundario">Iniciar sesión</Link>
                        <Link to="/crear-cuenta" className="boton boton-primario">Crear cuenta</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header
