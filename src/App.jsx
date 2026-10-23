import { Routes, Route } from 'react-router-dom';
import Devoluciones from './components/devoluciones/Devoluciones.jsx';
import Usuarios from './components/devoluciones/Usuarios.jsx';
import CalendarioPage from "./pages/reservas/CalendarioPage.jsx";
import MisReservasPage from "./pages/reservas/MisReservasPage.jsx";
import ListaEsperaPage from "./pages/reservas/ListaEsperaPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/devoluciones" element={<Devoluciones />} />
      <Route path="/devoluciones/usuarios" element={<Usuarios />} />
      <Route path="/calendario" element={<CalendarioPage />} />
      <Route path="/mis-reservas" element={<MisReservasPage />} />
      <Route path="/lista-espera" element={<ListaEsperaPage />} />
    </Routes>
  );
}

export default App;