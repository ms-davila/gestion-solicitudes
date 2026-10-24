import { createContext, useContext, useEffect, useState } from 'react'

const USUARIO_PRUEBA = {
    rol: 'estudiante',
    nombres: 'Renzo Andrés',
    apellidos: 'Mendoza Cárdenas',
    carrera: 'Ingeniería Electrónica',
    ciclo: '6.º',
    correo: 'rmendoza@aloe.ulima.edu.pe',
    clave: 'Hola1234',
    celular: '987 654 321',
    prestamos: 14,
    retrasos: 2,
    deuda: 45,
    motivoDeuda: 'por 3 días de retraso en PRE-2026-0291',
};

const UsuarioContext = createContext(null);

export const UsuarioProvider = ({ children }) => {

    const [usuarios, setUsuarios] = useState(() => {
        try {
            const guardado = JSON.parse(localStorage.getItem('usuarios'));
            if (Array.isArray(guardado) && guardado.length > 0) {
                return guardado;
            }
        } catch (e) {
            console.error(e);
        }
        return [USUARIO_PRUEBA];
    });

    const [sesion, setSesion] = useState(
        () => sessionStorage.getItem('sesion') || localStorage.getItem('sesion')
    );

    useEffect(() => {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }, [usuarios]);

    const usuarioSesion = usuarios.find(u => u.correo === sesion) || null;

    const existeCorreo = (correo) => usuarios.some(u => u.correo === correo);

    const iniciarSesion = (correo, recordar) => {
        if (recordar) {
            localStorage.setItem('sesion', correo);
        } else {
            sessionStorage.setItem('sesion', correo);
        }
        setSesion(correo);
    };

    const login = (correo, clave, recordar) => {
        const encontrado = usuarios.find(u => u.correo === correo && u.clave === clave);
        if (!encontrado) {
            return null;
        }
        iniciarSesion(encontrado.correo, recordar);
        return encontrado;
    };

    const logout = () => {
        localStorage.removeItem('sesion');
        sessionStorage.removeItem('sesion');
        setSesion(null);
    };

    const create = (nuevo) => {
        setUsuarios(prev => [...prev, nuevo]);
        iniciarSesion(nuevo.correo, true);
    };

    const update = (correo, datos) => {
        setUsuarios(prev => prev.map(u => (u.correo === correo ? { ...u, ...datos } : u)));
    };

    return (
        <UsuarioContext.Provider value={{ usuarios, usuarioSesion, existeCorreo, login, logout, create, update }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuario = () => useContext(UsuarioContext);
