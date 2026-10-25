import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { contrasenaValida } from '../../../pages/cuenta y registro/utils/validaciones.js';
import { ALMACENES } from '../data/opciones.js';
import Campo from '../Campo/Campo.jsx';
import Aviso from '../Aviso/Aviso.jsx';

const FORM_VACIO = {
    nombres: '', apellidos: '', correo: '', clave: '', clave2: '', almacen: '', anexo: '',
};

const RegistroEncargado = () => {

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
        if (!correo.endsWith('@ulima.edu.pe')) nuevos.correo = 'Debe terminar en @ulima.edu.pe';
        if (!contrasenaValida(form.clave)) nuevos.clave = 'Mínimo 8 caracteres, una mayúscula y un número.';
        if (form.clave !== form.clave2) nuevos.clave2 = 'Las contraseñas no coinciden.';
        if (form.almacen === '') nuevos.almacen = 'Elige un almacén.';
        if (form.anexo.trim() === '') nuevos.anexo = 'El anexo es obligatorio.';
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
            rol: 'encargado',
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            correo: correo,
            clave: form.clave,
            almacen: form.almacen,
            anexo: form.anexo.trim(),
            estado: 'Pendiente de aprobación',
            deuda: 0,
        });
        setCreada(true);
        setAviso({
            clase: 'alerta-verde',
            contenido: <><b>✓ Cuenta creada.</b> Quedó en estado «Pendiente de aprobación» hasta que el jefe de laboratorio la apruebe.</>,
        });
        setTimeout(() => navigate('/inventario'), 2000);
    };

    return (
        <main>
            <h1>Registro de encargado de almacén</h1>
            <p className="texto-ayuda">El alta queda pendiente hasta que el jefe de laboratorio la apruebe. Solo se admiten correos @ulima.edu.pe del personal.</p>

            <form className="tarjeta" onSubmit={handleSubmit}>
                <h3 className="subtitulo-seccion">DATOS PERSONALES</h3>
                <hr />
                <div className="fila-dos">
                    <Campo etiqueta="NOMBRES" nombre="nombres" valor={form.nombres} onChange={handleChange} error={errores.nombres} placeholder="Elena Sofía" />
                    <Campo etiqueta="APELLIDOS" nombre="apellidos" valor={form.apellidos} onChange={handleChange} error={errores.apellidos} placeholder="Rivas Talledo" />
                </div>

                <h3 className="subtitulo-seccion" style={{ marginTop: '25px' }}>ACCESO</h3>
                <hr />
                <Campo
                    etiqueta="CORREO INSTITUCIONAL" nombre="correo" valor={form.correo} onChange={handleChange}
                    error={errores.correo} placeholder="erivas@ulima.edu.pe" pista="Debe terminar en @ulima.edu.pe" mono
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

                <h3 className="subtitulo-seccion" style={{ marginTop: '25px' }}>ASIGNACIÓN</h3>
                <hr />
                <div className="fila-dos">
                    <Campo
                        etiqueta="ALMACÉN ASIGNADO" nombre="almacen" valor={form.almacen} onChange={handleChange}
                        error={errores.almacen} opciones={ALMACENES}
                        pista="Opciones: Almacén H-102, Almacén N-005, Laboratorio de Electrónica H210."
                    />
                    <Campo etiqueta="ANEXO TELEFÓNICO" nombre="anexo" valor={form.anexo} onChange={handleChange} error={errores.anexo} placeholder="3120" mono />
                </div>

                <div className="alerta alerta-amarilla">
                    La cuenta se crea en estado «Pendiente de aprobación». Hasta entonces no podrá aprobar solicitudes ni registrar entregas.
                </div>

                <Aviso aviso={aviso} />

                <div className="botones-fila">
                    <button type="button" className="boton boton-secundario" onClick={() => navigate('/crear-cuenta')}>Cancelar</button>
                    <button type="submit" className="boton boton-primario" disabled={creada}>Registrar encargado</button>
                </div>
            </form>
        </main>
    );
}

export default RegistroEncargado