import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext.jsx';

const Error403 = () => {
    const navigate = useNavigate();
    const { usuarioSesion } = useUsuario();
    const esEncargado = usuarioSesion?.rol === 'encargado';

    return (
        <main className="texto-centro">
            <p className="error-grande">!</p>
            <span className="etiqueta-campo">ERROR 403 · ACCESO DENEGADO</span>
            <h1>No tienes permiso para ver esta página</h1>
            <p className="texto-ayuda" style={{ marginTop: '10px' }}>
                Esta sección pertenece al panel del encargado de almacén. Si crees que es un error, escribe a almacen.equipos@ulima.edu.pe indicando tu código de estudiante.
            </p>
            <div className="botones-fila" style={{ justifyContent: 'center' }}>
                <button className="boton boton-primario" onClick={() => navigate(esEncargado ? '/inventario' : '/catalogo')}>
                    {esEncargado ? 'Ir al inventario' : 'Ir al catálogo'}
                </button>
                <button className="boton boton-secundario" onClick={() => navigate(esEncargado ? '/bandeja' : '/missolicitudes')}>
                    {esEncargado ? 'Ver solicitudes' : 'Ver mis solicitudes'}
                </button>
            </div>
        </main>
    );
}

export default Error403