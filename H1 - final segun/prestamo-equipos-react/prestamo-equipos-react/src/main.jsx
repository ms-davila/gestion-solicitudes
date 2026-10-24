import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UsuarioProvider } from './context/UsuarioContext.jsx'

import './index.css'
import InicioPage from './pages/InicioPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CrearCuentaPage from './pages/CrearCuentaPage.jsx'
import RegistroEstudiantePage from './pages/RegistroEstudiantePage.jsx'
import RegistroEncargadoPage from './pages/RegistroEncargadoPage.jsx'
import RecuperarPage from './pages/RecuperarPage.jsx'
import MiCuentaPage from './pages/MiCuentaPage.jsx'
import Error403Page from './pages/Error403Page.jsx'
import Error404Page from './pages/Error404Page.jsx'

const router = createBrowserRouter([
  { path: "/", element: <InicioPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/crear-cuenta", element: <CrearCuentaPage /> },
  { path: "/registro-estudiante", element: <RegistroEstudiantePage /> },
  { path: "/registro-encargado", element: <RegistroEncargadoPage /> },
  { path: "/recuperar", element: <RecuperarPage /> },
  { path: "/mi-cuenta", element: <MiCuentaPage /> },
  { path: "/403", element: <Error403Page /> },
  { path: "*", element: <Error404Page /> },   
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsuarioProvider>
      <RouterProvider router={router} />
    </UsuarioProvider>
  </StrictMode>,
)
