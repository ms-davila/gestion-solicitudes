const Aviso = ({ aviso }) => {
    if (!aviso) {
        return null;
    }
    return <div className={'alerta ' + aviso.clase}>{aviso.contenido}</div>;
}

export default Aviso
