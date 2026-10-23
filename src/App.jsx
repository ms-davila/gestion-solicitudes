import { Routes, Route } from 'react-router-dom';
import Devoluciones from './components/devoluciones/Devoluciones.jsx';
import Usuarios from './components/devoluciones/Usuarios.jsx';
import CalendarioPage from "./pages/reservas/CalendarioPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/devoluciones" element={<Devoluciones />} />
      <Route path="/devoluciones/usuarios" element={<Usuarios />} />
      <Route path="/calendario" element={<CalendarioPage />} />
    </Routes>
  );
}

export default App;