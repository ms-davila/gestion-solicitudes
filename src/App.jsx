
import { Routes, Route, Navigate } from 'react-router-dom';

import Devoluciones from './components/devoluciones/Devoluciones.jsx';
import Usuarios from './components/devoluciones/Usuarios.jsx';

import CalendarioPage from "./pages/reservas/CalendarioPage.jsx";
import MisReservasPage from "./pages/reservas/MisReservasPage.jsx";
import ListaEsperaPage from "./pages/reservas/ListaEsperaPage.jsx";

import InventarioPage from './pages/inventario/InventarioPage.jsx';

import CatalogoPage from './pages/catalogo/CatalogoPage.jsx';
import MisSolicitudesPage from './pages/catalogo/MisSolicitudesPage.jsx';
import SolicitarProductoPage from './pages/catalogo/SolicitarProductoPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/devoluciones" element={<Devoluciones />} />
      <Route path="/devoluciones/usuarios" element={<Usuarios />} />
        
      <Route path="/calendario" element={<CalendarioPage />} />
      <Route path="/mis-reservas" element={<MisReservasPage />} />
      <Route path="/lista-espera" element={<ListaEsperaPage />} />
      
      <Route path="/inventario" element={<InventarioPage />} />

      <Route path='/catalogo' element={<CatalogoPage />}/>
      <Route path='/missolicitudes' element={<MisSolicitudesPage />}/>
      <Route path='/solicitarproducto' element={<SolicitarProductoPage />}/>
    </Routes>
  );
}

export default App;
