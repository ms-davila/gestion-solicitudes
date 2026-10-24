import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { contrasenaValida } from '../../../pages/cuenta y registro/utils/validaciones.js';
import { CARRERAS, CICLOS } from '../data/opciones.js';
import Campo from '../Campo/Campo.jsx';
import Aviso from '../Aviso/Aviso.jsx';

const DatosCuenta = ({ usuario }) => {

    const { update } = useUsuario();

    const datosGuardados = {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        carrera: usuario.carrera,
        ciclo: usuario.ciclo,
        celular: usuario.celular,
    };
    const [form, setForm] = useState(datosGuardados);
    const [errores, setErrores] = useState({});

    // Cambiar contraseña
    const [claves, setClaves] = useState({ actual: '', nueva: '', repetida: '' });
    const [erroresClave, setErroresClave] = useState({});

    const [aviso, setAviso] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleChangeClave = (e) => {
        const { name, value } = e.target;
        setClaves({ ...claves, [name]: value });
    };

    // Boton --------- guardar cambios
    const handleGuardar = (e) => {
        e.preventDefault();
        const nuevos = {};
        if (form.nombres.trim() === '') nuevos.nombres = 'Los nombres son obligatorios.';
        if (form.apellidos.trim() === '') nuevos.apellidos = 'Los apellidos son obligatorios.';
        if (form.carrera === '') nuevos.carrera = 'Elige tu carrera.';
        if (form.ciclo === '') nuevos.ciclo = 'Elige tu ciclo.';
        setErrores(nuevos);

        const cantidad = Object.keys(nuevos).length;
        if (cantidad > 0) {
            setAviso({ clase: 'alerta-roja', contenido: <b>Revisa {cantidad} campos antes de guardar.</b> });
            return;
        }

        update(usuario.correo, {
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            carrera: form.carrera,
            ciclo: form.ciclo,
            celular: form.celular.trim(),
        });
        setAviso({ clase: 'alerta-verde', contenido: <b>✓ Cambios guardados.</b> });
    };

    // Boton ------ descartar
    const handleDescartar = () => {
        setForm(datosGuardados);
        setErrores({});
        setAviso(null);
    };

    // Boton ------------------- actualizar contraseña
    const handleActualizarClave = (e) => {
        e.preventDefault();
        const nuevos = {};
        if (claves.actual !== usuario.clave) nuevos.actual = 'La contraseña actual no es correcta.';
        if (!contrasenaValida(claves.nueva)) nuevos.nueva = 'Mínimo 8 caracteres, una mayúscula y un número.';
        if (claves.nueva !== claves.repetida) nuevos.repetida = 'Las contraseñas no coinciden.';
        setErroresClave(nuevos);

        if (Object.keys(nuevos).length > 0) {
            setAviso({ clase: 'alerta-roja', contenido: <><b>No pudimos actualizar la contraseña.</b> Revisa los campos marcados.</> });
            return;
        }

        update(usuario.correo, { clave: claves.nueva });
        setClaves({ actual: '', nueva: '', repetida: '' });
        setAviso({ clase: 'alerta-verde', contenido: <b>✓ Contraseña actualizada.</b> });
    };

    return (
        <main>
            <p className="texto-ayuda" style={{ marginBottom: '5px' }}>Inicio / Mi cuenta</p>
            <h1>Mi cuenta</h1>

            {/* Aviso rojo de deuda */}
            {usuario.deuda > 0 && (
                <div className="alerta alerta-roja">
                    Tienes una penalidad pendiente de <b className="codigo">S/ {usuario.deuda.toFixed(2)}</b> {usuario.motivoDeuda}. Regularízala en Tesorería para volver a solicitar equipos.
                </div>
            )}
            <Aviso aviso={aviso} />

            {/* Datos personales */}
            <form className="tarjeta" style={{ marginTop: '20px' }} onSubmit={handleGuardar}>
                <h2>Datos personales</h2>
                <div className="fila-dos">
                    <Campo etiqueta="NOMBRES" nombre="nombres" valor={form.nombres} onChange={handleChange} error={errores.nombres} />
                    <Campo etiqueta="APELLIDOS" nombre="apellidos" valor={form.apellidos} onChange={handleChange} error={errores.apellidos} />
                </div>
                <div className="fila-dos">
                    <Campo etiqueta="CARRERA" nombre="carrera" valor={form.carrera} onChange={handleChange} error={errores.carrera} opciones={CARRERAS} />
                    <Campo etiqueta="CICLO" nombre="ciclo" valor={form.ciclo} onChange={handleChange} error={errores.ciclo} opciones={CICLOS} />
                </div>
                <div className="fila-dos">
                    <Campo etiqueta="CORREO INSTITUCIONAL" nombre="correo" valor={usuario.correo} onChange={() => {}} pista="No editable." mono deshabilitado />
                    <Campo etiqueta="CELULAR" nombre="celular" valor={form.celular} onChange={handleChange} mono />
                </div>
                <div className="botones-fila">
                    <button type="button" className="boton boton-secundario" onClick={handleDescartar}>Descartar</button>
                    <button type="submit" className="boton boton-primario">Guardar cambios</button>
                </div>
            </form>

            {/* Cambiar contraseña */}
            <form className="tarjeta" onSubmit={handleActualizarClave}>
                <h2>Cambiar contraseña</h2>
                <div className="fila-dos">
                    <Campo etiqueta="CONTRASEÑA ACTUAL" nombre="actual" tipo="password" valor={claves.actual} onChange={handleChangeClave} error={erroresClave.actual} />
                    <Campo etiqueta="NUEVA" nombre="nueva" tipo="password" valor={claves.nueva} onChange={handleChangeClave} error={erroresClave.nueva} />
                    <Campo etiqueta="CONFIRMAR" nombre="repetida" tipo="password" valor={claves.repetida} onChange={handleChangeClave} error={erroresClave.repetida} />
                </div>
                <div className="botones-fila">
                    <button type="submit" className="boton boton-primario">Actualizar contraseña</button>
                </div>
            </form>

            {/* Resumen de préstamos */}
            <section className="tarjeta">
                <h2>Resumen de préstamos</h2>
                <div className="resumen">
                    <div><b className="codigo">{usuario.prestamos}</b>préstamos</div>
                    <div><b className="codigo">{usuario.retrasos}</b>retrasos</div>
                    <div><b className="codigo" style={{ color: '#B4322B' }}>S/ {usuario.deuda.toFixed(2)}</b>deuda</div>
                </div>
            </section>
        </main>
    );
};

const MiCuenta = () => {
    const { usuarioSesion } = useUsuario();

    if (!usuarioSesion) {
        return <Navigate to="/login" />;
    }
    if (usuarioSesion.rol !== 'estudiante') {
        return <Navigate to="/" />;
    }
    return <DatosCuenta usuario={usuarioSesion} />;
}

export default MiCuenta
