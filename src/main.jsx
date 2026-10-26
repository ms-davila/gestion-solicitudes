import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { UsuarioProvider } from './components/cuenta y registro/context/UsuarioContext.jsx'

import './index.css'

import App from './App.jsx'
import ScopeLayout from "./components/compartidos/ScopeLayout.jsx";

import InicioPage from './pages/cuenta y registro/InicioPage.jsx'
import LoginPage from './pages/cuenta y registro/LoginPage.jsx'
import CrearCuentaPage from './pages/cuenta y registro/CrearCuentaPage.jsx'
import RegistroEstudiantePage from './pages/cuenta y registro/RegistroEstudiantePage.jsx'
import RegistroEncargadoPage from './pages/cuenta y registro/RegistroEncargadoPage.jsx'
import RecuperarPage from './pages/cuenta y registro/RecuperarPage.jsx'
import MiCuentaPage from './pages/cuenta y registro/MiCuentaPage.jsx'
import Error403Page from './pages/cuenta y registro/Error403Page.jsx'
import Error404Page from './pages/cuenta y registro/Error404Page.jsx'
import RutaProtegida from './components/compartidos/RutaProtegida.jsx'


// ScopeLayout envuelve cada pantalla con su clase (pagina-cuenta, pagina-catalogo...).
// React Router da prioridad a las rutas específicas sobre "*", así que
// el orden no importa; "*" solo atrapa lo que no coincida (tu App).
const router = createBrowserRouter([
  {
    element: <ScopeLayout />,
    children: [
      { path: '/', element: <InicioPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/crear-cuenta', element: <CrearCuentaPage /> },
      { path: '/registro-estudiante', element: <RegistroEstudiantePage /> },
      { path: '/registro-encargado', element: <RegistroEncargadoPage /> },
      { path: '/recuperar', element: <RecuperarPage /> },
      {
        element: <RutaProtegida roles={['estudiante']} />,
        children: [{ path: '/mi-cuenta', element: <MiCuentaPage /> }],
      },
      { path: '/403', element: <Error403Page /> },
      { path: '/404', element: <Error404Page /> },
      { path: '*', element: <App /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsuarioProvider>
      <RouterProvider router={router} />
    </UsuarioProvider>
  </StrictMode>,
)