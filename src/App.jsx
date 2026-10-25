import { Routes, Route, Navigate } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida.jsx';

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
      {/* VISITANTE y ESTUDIANTE: catálogo en modo lectura */}
      <Route element={<RutaProtegida roles={['publico']} />}>
        <Route path="/catalogo" element={<CatalogoPage />} />
      </Route>

      {/* SOLO ESTUDIANTE */}
      <Route element={<RutaProtegida roles={['estudiante']} />}>
        <Route path="/missolicitudes" element={<MisSolicitudesPage />} />
        <Route path="/solicitarproducto" element={<SolicitarProductoPage />} />
      </Route>

      {/* ESTUDIANTE y ENCARGADO (comparten pantalla de reservas) */}
      <Route element={<RutaProtegida roles={['estudiante', 'encargado']} />}>
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/mis-reservas" element={<MisReservasPage />} />
      </Route>

      {/* SOLO ENCARGADO DE ALMACÉN */}
      <Route element={<RutaProtegida roles={['encargado']} />}>
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/devoluciones" element={<Devoluciones />} />
        <Route path="/devoluciones/usuarios" element={<Usuarios />} />
        <Route path="/lista-espera" element={<ListaEsperaPage />} />

        <Route element={<LayoutEncargado />}>
          <Route path="/bandeja" element={<BandejaPage />} />
          <Route path="/entrega" element={<EntregaPage />} />
          <Route path="/constancia" element={<ConstanciaPage />} />
          <Route path="/vigentes" element={<VigentesPage />} />
        </Route>
      </Route>

      {/* Cualquier otra ruta -> 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;