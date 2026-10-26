import { Routes, Route, Navigate } from "react-router-dom";
import RutaProtegida from "./components/compartidos/RutaProtegida.jsx";

import Devoluciones from "./components/devoluciones/Devoluciones.jsx";
import Usuarios from "./components/devoluciones/Usuarios.jsx";

import CalendarioPage from "./pages/reservas/CalendarioPage.jsx";
import MisReservasPage from "./pages/reservas/MisReservasPage.jsx";
import ListaEsperaPage from "./pages/reservas/ListaEsperaPage.jsx";

import InventarioPage from "./pages/inventario/InventarioPage.jsx";

import CatalogoPage from "./pages/catalogo/CatalogoPage.jsx";
import MisSolicitudesPage from "./pages/catalogo/MisSolicitudesPage.jsx";
import SolicitarProductoPage from "./pages/catalogo/SolicitarProductoPage.jsx";

import LayoutEncargado from "./pages/aprobacion y entrega/LayoutEncargado.jsx";
import BandejaPage from "./pages/aprobacion y entrega/BandejaPage.jsx";
import EntregaPage from "./pages/aprobacion y entrega/EntregaPage.jsx";
import ConstanciaPage from "./pages/aprobacion y entrega/ConstanciaPage.jsx";
import VigentesPage from "./pages/aprobacion y entrega/VigentesPage.jsx";

function App() {
  return (
    <Routes>
      {/* CATÁLOGO: ACCESO PÚBLICO */}
      <Route element={<RutaProtegida roles={["publico"]} />}>
        <Route path="/catalogo" element={<CatalogoPage />} />
      </Route>

      {/* HU-3: SOLO ESTUDIANTES */}
      <Route element={<RutaProtegida roles={["estudiante"]} />}>
        <Route
          path="/missolicitudes"
          element={<MisSolicitudesPage />}
        />
        <Route
          path="/solicitarproducto"
          element={<SolicitarProductoPage />}
        />
      </Route>

      {/* HU-6: SOLO ESTUDIANTES */}
      <Route element={<RutaProtegida roles={["estudiante"]} />}>
        <Route
          path="/calendario"
          element={<CalendarioPage />}
        />
        <Route
          path="/mis-reservas"
          element={<MisReservasPage />}
        />
      </Route>

      {/* PANTALLAS EXCLUSIVAS DEL ENCARGADO */}
      <Route element={<RutaProtegida roles={["encargado"]} />}>
        {/* HU-2: INVENTARIO */}
        <Route
          path="/inventario"
          element={<InventarioPage />}
        />

        {/* HU-5: DEVOLUCIONES Y USUARIOS */}
        <Route
          path="/devoluciones"
          element={<Devoluciones />}
        />
        <Route
          path="/devoluciones/usuarios"
          element={<Usuarios />}
        />

        {/* HU-6: LISTA DE ESPERA */}
        <Route
          path="/lista-espera"
          element={<ListaEsperaPage />}
        />

        {/* HU-4: APROBACIÓN Y ENTREGA */}
        <Route element={<LayoutEncargado />}>
          <Route
            path="/bandeja"
            element={<BandejaPage />}
          />
          <Route
            path="/entrega"
            element={<EntregaPage />}
          />
          <Route
            path="/constancia"
            element={<ConstanciaPage />}
          />
          <Route
            path="/vigentes"
            element={<VigentesPage />}
          />
        </Route>
      </Route>

      {/* RUTAS NO ENCONTRADAS */}
      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}

export default App;
