import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <main className="texto-centro">
            <p className="error-grande" style={{ color: '#17505C' }}>?</p>
            <span className="etiqueta-campo">ERROR 404 · PÁGINA NO ENCONTRADA</span>
            <h1>No encontramos esta página</h1>
            <p className="texto-ayuda" style={{ marginTop: '10px' }}>
                El enlace pudo cambiar o la ficha del equipo ya no está publicada en el catálogo.
            </p>
            <div className="botones-fila" style={{ justifyContent: 'center' }}>
                <button className="boton boton-primario" onClick={() => navigate('/')}>Ir al inicio</button>
                <button className="boton boton-secundario" onClick={() => navigate('/')}>Buscar un equipo</button>
            </div>
        </main>
    );
}

export default Error404
