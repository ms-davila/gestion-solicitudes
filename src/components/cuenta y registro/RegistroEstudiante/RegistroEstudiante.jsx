import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { contrasenaValida } from '../../../pages/cuenta y registro/utils/validaciones.js';
import { CARRERAS, CICLOS } from '../../cuenta y registro/data/opciones.js';
import Campo from '../../cuenta y registro/Campo/Campo.jsx';
import Aviso from '../../cuenta y registro/Aviso/Aviso.jsx';

const FORM_VACIO = {
    nombres: '', apellidos: '', carrera: '', ciclo: '',
    correo: '', clave: '', clave2: '', acepto: false,
};

const RegistroEstudiante = () => {

    const { create, existeCorreo } = useUsuario();
    const navigate = useNavigate();

    const [form, setForm] = useState(FORM_VACIO);   
    const [errores, setErrores] = useState({});     
    const [aviso, setAviso] = useState(null);
    const [creada, setCreada] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const correo = form.correo.trim().toLowerCase();

        const nuevos = {};
        if (form.nombres.trim() === '') nuevos.nombres = 'Los nombres son obligatorios.';
        if (form.apellidos.trim() === '') nuevos.apellidos = 'Los apellidos son obligatorios.';
        if (form.carrera === '') nuevos.carrera = 'Elige tu carrera.';
        if (form.ciclo === '') nuevos.ciclo = 'Elige tu ciclo.';
        if (!correo.endsWith('@aloe.ulima.edu.pe')) nuevos.correo = 'Debe terminar en @aloe.ulima.edu.pe';
        if (!contrasenaValida(form.clave)) nuevos.clave = 'Mínimo 8 caracteres, una mayúscula y un número.';
        if (form.clave !== form.clave2) nuevos.clave2 = 'Las contraseñas no coinciden.';
        if (!form.acepto) nuevos.acepto = 'Debes aceptar el reglamento.';
        setErrores(nuevos);

        const cantidad = Object.keys(nuevos).length;
        if (cantidad > 0) {
            setAviso({ clase: 'alerta-roja', contenido: <b>Revisa {cantidad} campos antes de continuar.</b> });
            return;
        }

        if (existeCorreo(correo)) {
            setAviso({
                clase: 'alerta-roja',
                contenido: <>Ya existe una cuenta con el correo <span className="codigo">{correo}</span>. Inicia sesión o recupera tu contraseña.</>,
            });
            return;
        }

        create({
            rol: 'estudiante',
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            carrera: form.carrera,
            ciclo: form.ciclo,
            correo: correo,
            clave: form.clave,
            celular: '',
            prestamos: 0,
            retrasos: 0,
            deuda: 0,
            motivoDeuda: '',
        });
        setCreada(true);
        setAviso({
            clase: 'alerta-verde',
            contenido: <><b>✓ Cuenta creada.</b> Enviamos un enlace de verificación a <span className="codigo">{correo}</span>. Válido por 24 horas.</>,
        });
        setTimeout(() => navigate('/mi-cuenta'), 2000);
    };

    return (
        <main>
            <h1>Crea tu cuenta de estudiante</h1>
            <p className="texto-ayuda">Solo se admiten correos @aloe.ulima.edu.pe. La cuenta se activa con el enlace de verificación.</p>

            <form className="tarjeta" onSubmit={handleSubmit}>
                <h3 className="subtitulo-seccion">DATOS PERSONALES</h3>
                <hr />
                <div className="fila-dos">
                    <Campo etiqueta="NOMBRES" nombre="nombres" valor={form.nombres} onChange={handleChange} error={errores.nombres} placeholder="Renzo Andrés" />
                    <Campo etiqueta="APELLIDOS" nombre="apellidos" valor={form.apellidos} onChange={handleChange} error={errores.apellidos} placeholder="Mendoza Cárdenas" />
                </div>
                <div className="fila-dos">
                    <Campo etiqueta="CARRERA" nombre="carrera" valor={form.carrera} onChange={handleChange} error={errores.carrera} opciones={CARRERAS} />
                    <Campo etiqueta="CICLO" nombre="ciclo" valor={form.ciclo} onChange={handleChange} error={errores.ciclo} opciones={CICLOS} />
                </div>

                <h3 className="subtitulo-seccion" style={{ marginTop: '25px' }}>ACCESO</h3>
                <hr />
                <Campo
                    etiqueta="CORREO INSTITUCIONAL" nombre="correo" valor={form.correo} onChange={handleChange}
                    error={errores.correo} placeholder="nombre@aloe.ulima.edu.pe" pista="Debe terminar en @aloe.ulima.edu.pe" mono
                />
                <div className="fila-dos">
                    <Campo
                        etiqueta="CONTRASEÑA" nombre="clave" tipo="password" valor={form.clave} onChange={handleChange}
                        error={errores.clave} placeholder="••••••••" pista="Mínimo 8 caracteres, una mayúscula y un número."
                    />
                    <Campo
                        etiqueta="CONFIRMAR CONTRASEÑA" nombre="clave2" tipo="password" valor={form.clave2} onChange={handleChange}
                        error={errores.clave2} placeholder="••••••••"
                    />
                </div>

                <label className="casilla">
                    <input type="checkbox" checked={form.acepto} onChange={e => setForm({ ...form, acepto: e.target.checked })} />
                    <span>Acepto el reglamento de préstamo de equipos y me responsabilizo por el cuidado y la devolución de las unidades asignadas.</span>
                </label>
                {errores.acepto && <span className="ayuda-error">{errores.acepto}</span>}

                <Aviso aviso={aviso} />

                <div className="botones-fila">
                    <button type="button" className="boton boton-secundario" onClick={() => navigate('/crear-cuenta')}>Cancelar</button>
                    <button type="submit" className="boton boton-primario" disabled={creada}>Crear cuenta</button>
                </div>
            </form>
        </main>
    );
}

export default RegistroEstudiante
