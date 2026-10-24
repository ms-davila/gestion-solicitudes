import { useNavigate } from 'react-router-dom';

const Error403 = () => {
    const navigate = useNavigate();

    return (
        <main className="texto-centro">
            <p className="error-grande">!</p>
            <span className="etiqueta-campo">ERROR 403 · ACCESO DENEGADO</span>
            <h1>No tienes permiso para ver esta página</h1>
            <p className="texto-ayuda" style={{ marginTop: '10px' }}>
                Esta sección pertenece al panel del encargado de almacén. Si crees que es un error, escribe a almacen.equipos@ulima.edu.pe indicando tu código de estudiante.
            </p>
            <div className="botones-fila" style={{ justifyContent: 'center' }}>
                <button className="boton boton-primario" onClick={() => navigate('/')}>Ir al catálogo</button>
                <button className="boton boton-secundario" onClick={() => navigate('/mi-cuenta')}>Ver mis solicitudes</button>
            </div>
        </main>
    );
}

export default Error403
