import { Routes, Route } from 'react-router-dom';

import Devoluciones from './components/devoluciones/Devoluciones.jsx';
import Usuarios from './components/devoluciones/Usuarios.jsx';

import CalendarioPage from './pages/reservas/CalendarioPage.jsx';

import LayoutEncargado from './pages/h4/LayoutEncargado.jsx';
import BandejaPage from './pages/h4/BandejaPage.jsx';
import EntregaPage from './pages/h4/EntregaPage.jsx';
import VigentesPage from './pages/h4/VigentesPage.jsx';
import ConstanciaPage from './pages/h4/ConstanciaPage.jsx';
import MisReservasPage from './pages/reservas/MisReservasPage.jsx';
import ListaEsperaPage from './pages/reservas/ListaEsperaPage.jsx';
import InventarioPage from './pages/inventario/InventarioPage.jsx';
import CatalogoPage from './pages/catalogo/CatalogoPage.jsx';
import MisSolicitudesPage from './pages/catalogo/MisSolicitudesPage.jsx';
import SolicitarProductoPage from './pages/catalogo/SolicitarProductoPage.jsx';
// Cuando conviertas catalogo.html y missolicitudes.html a componentes,
// descomenta estas líneas (las rutas deben coincidir con ScopeLayout.jsx):
// import CatalogoPage from './pages/catalogo/CatalogoPage.jsx';
// import MisSolicitudesPage from './pages/solicitudes/MisSolicitudesPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/devoluciones" element={<Devoluciones />} />
      <Route path="/devoluciones/usuarios" element={<Usuarios />} />

      <Route path="/calendario" element={<CalendarioPage />} />

      <Route element={<LayoutEncargado />}>
        <Route path="/bandeja" element={<BandejaPage />} />
        <Route path="/entrega" element={<EntregaPage />} />
        <Route path="/constancia" element={<ConstanciaPage />} />
        <Route path="/vigentes" element={<VigentesPage />} />
      </Route>

      <Route path="/mis-reservas" element={<MisReservasPage />} />
      <Route path="/lista-espera" element={<ListaEsperaPage />} />
      <Route path="/inventario" element={<InventarioPage />} />

      <Route path='/catalogo' element={<CatalogoPage />}/>
      <Route path='/missolicitudes' element={<MisSolicitudesPage />}/>
      <Route path='/solicitarproducto' element={<SolicitarProductoPage />}/>

      {/* <Route path="/catalogo" element={<CatalogoPage />} /> */}
      {/* <Route path="/mis-solicitudes" element={<MisSolicitudesPage />} /> */}
    </Routes>
  );
}

export default App;