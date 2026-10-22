//src/App.jsx
import Devoluciones from './components/devoluciones/Devoluciones.jsx';
import Usuarios from './components/devoluciones/Usuarios.jsx';

function App() {
  return (
    <div>
      {/* Este es el contenedor principal de tu proyecto */}
      <nav style={{ padding: '10px', background: '#eee' }}>
        <h2>Menú Temporal de Mi Proyecto</h2>
      </nav>

      {/* Aquí renderizas tus componentes recién creados */}
      <Devoluciones />
      <hr />
      <Usuarios />
    </div>
  );
}

export default App;