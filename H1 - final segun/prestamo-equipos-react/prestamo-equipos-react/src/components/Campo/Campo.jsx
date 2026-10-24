const Campo = ({
    etiqueta,
    nombre,
    valor,
    onChange,
    error,
    tipo = 'text',
    placeholder = '',
    pista = '',
    mono = false,
    opciones = null,
    deshabilitado = false,
}) => {

    let clase = 'campo';
    if (mono) {
        clase = clase + ' codigo';
    }
    if (deshabilitado) {
        clase = clase + ' campo-deshabilitado';
    }
    if (error !== undefined) {
        clase = clase + ' campo-error';
    }

    return (
        <div className="grupo-campo">
            <label className="etiqueta-campo">{etiqueta}</label>

            {opciones ? (
                <select className={clase} name={nombre} value={valor} onChange={onChange}>
                    <option value="">Selecciona</option>
                    {opciones.map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>
            ) : (
                <input
                    className={clase}
                    type={tipo}
                    name={nombre}
                    value={valor}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={deshabilitado}
                />
            )}

            {pista && <span className="ayuda-campo">{pista}</span>}
            {error && <span className="ayuda-error">{error}</span>}
        </div>
    );
}

export default Campo
