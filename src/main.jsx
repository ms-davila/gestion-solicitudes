import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. Traemos las herramientas de enrutamiento (la tuya y la de ella)
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

// 2. Traemos el Contexto de ella (asegúrate de que esta sea la ruta correcta)
import { UsuarioProvider } from './components/cuenta y registro/context/UsuarioContext.jsx' 

// 3. Importación de estilos
import './index.css'
// AQUÍ LLAMAS A SU ESTILO: Asegúrate de poner la ruta exacta donde guardaste su CSS
import './styles/cuenta y registro/cuenta y registro.css' 

// 4. Tu App original
import App from './App.jsx'

// 5. Las páginas de ella para el Router
import InicioPage from './pages/cuenta y registro/InicioPage.jsx'
import LoginPage from './pages/cuenta y registro/LoginPage.jsx'
import CrearCuentaPage from './pages/cuenta y registro/CrearCuentaPage.jsx'
import RegistroEstudiantePage from './pages/cuenta y registro/RegistroEstudiantePage.jsx'
import RegistroEncargadoPage from './pages/cuenta y registro/RegistroEncargadoPage.jsx'
import RecuperarPage from './pages/cuenta y registro/RecuperarPage.jsx'
import MiCuentaPage from './pages/cuenta y registro/MiCuentaPage.jsx'
import Error403Page from './pages/cuenta y registro/Error403Page.jsx'
import Error404Page from './pages/cuenta y registro/Error404Page.jsx'

// 6. Configuramos el Router de ella
const router = createBrowserRouter([
  // --- TUS RUTAS (El App original) ---
  // Al poner el "*" aquí, cualquier ruta que no coincida con las de ella, 
  // cargará tu App (y dentro de tu App tendrás tus propias rutas si las tienes).
  { path: "*", element: <App /> }, 

  // --- RUTAS DE ELLA ---
  // Nota: Si alguna ruta choca (ej: ella tiene "/login" y tú también en tu App), 
  // la que esté primero en esta lista ganará. Si quieres priorizar tu App, deja el "*" arriba.
  // Si quieres priorizar las de ella, pon sus rutas arriba y el "*" hasta abajo.
  { path: "/", element: <InicioPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/crear-cuenta", element: <CrearCuentaPage /> },
  { path: "/registro-estudiante", element: <RegistroEstudiantePage /> },
  { path: "/registro-encargado", element: <RegistroEncargadoPage /> },
  { path: "/recuperar", element: <RecuperarPage /> },
  { path: "/mi-cuenta", element: <MiCuentaPage /> },
  { path: "/403", element: <Error403Page /> },
  { path: "/404", element: <Error404Page /> }, 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 7. Envolvemos TODO con el contexto de ella */}
    <UsuarioProvider>
      <RouterProvider router={router} />
    </UsuarioProvider>
  </StrictMode>,
)