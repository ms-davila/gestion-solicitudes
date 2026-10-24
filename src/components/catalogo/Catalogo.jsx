import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/catalogo/catalogo.css";

// =============================================================================
// DATASET DE PRODUCTOS (CATÁLOGO DE INVENTARIO)
// =============================================================================
const CATALOGO_PRODUCTOS = [
  {
    id: "INV-MED-0001",
    foto: "",
    nombre: "Osciloscopio Digital 100MHz 4 Canales",
    categoria: "Medición",
    marca: "Tektronix",
    modelo: "TBS1052B",
    disponible: 4,
    existente: 6
  },
  {
    id: "INV-ROB-0002",
    foto: "",
    nombre: "Brazo Robótico Educativo 6DOF",
    categoria: "Robótica",
    marca: "Dobot",
    modelo: "Magician",
    disponible: 2,
    existente: 4
  },
  {
    id: "INV-COM-0003",
    foto: "",
    nombre: "Laptop Workstation i7 32GB RAM",
    categoria: "Cómputo",
    marca: "Dell",
    modelo: "Precision 5570",
    disponible: 5,
    existente: 8
  },
  {
    id: "INV-ROB-0004",
    foto: "",
    nombre: "Kit de Desarrollo Arduino Uno R3",
    categoria: "Robótica",
    marca: "Arduino",
    modelo: "Starter Kit V2",
    disponible: 10,
    existente: 12
  },
  {
    id: "INV-MED-0005",
    foto: "",
    nombre: "Multímetro Digital True-RMS",
    categoria: "Medición",
    marca: "Fluke",
    modelo: "115",
    disponible: 8,
    existente: 10
  },
  {
    id: "INV-RED-0006",
    foto: "",
    nombre: "Switch Gestionable Gigabit 24 Puertos",
    categoria: "Redes",
    marca: "Cisco",
    modelo: "Catalyst 2960-X",
    disponible: 3,
    existente: 5
  },
  {
    id: "INV-AUD-0007",
    foto: "",
    nombre: "Cámara Réflex Digital 4K",
    categoria: "Audiovisual",
    marca: "Sony",
    modelo: "Alpha a6400",
    disponible: 2,
    existente: 3
  },
  {
    id: "INV-AUD-0008",
    foto: "",
    nombre: "Proyector Láser Interactivo Full HD",
    categoria: "Audiovisual",
    marca: "Epson",
    modelo: "PowerLite L530U",
    disponible: 1,
    existente: 2
  },
  {
    id: "INV-MED-0009",
    foto: "",
    nombre: "Generador de Funciones Arbitrarias 25MHz",
    categoria: "Medición",
    marca: "Rigol",
    modelo: "DG1022Z",
    disponible: 3,
    existente: 4
  },
  {
    id: "INV-FIS-0010",
    foto: "",
    nombre: "Pista de Aire para Experimentos de Dinámica",
    categoria: "Laboratorio de Física",
    marca: "PASCO",
    modelo: "ME-9493",
    disponible: 4,
    existente: 6
  },
  {
    id: "INV-RED-0011",
    foto: "",
    nombre: "Router Inalámbrico Wi-Fi 6 AX5400",
    categoria: "Redes",
    marca: "TP-Link",
    modelo: "Archer AX73",
    disponible: 5,
    existente: 5
  },
  {
    id: "INV-ROB-0012",
    foto: "",
    nombre: "Estación de Soldadura Digital ESD",
    categoria: "Robótica",
    marca: "Weller",
    modelo: "WE1010",
    disponible: 6,
    existente: 8
  },
  {
    id: "INV-AUD-0013",
    foto: "",
    nombre: "Micrófono Inalámbrico de Solapa Dual",
    categoria: "Audiovisual",
    marca: "Rode",
    modelo: "Wireless GO II",
    disponible: 4,
    existente: 4
  },
  {
    id: "INV-FIS-0014",
    foto: "",
    nombre: "Péndulo Físico Demostrativo",
    categoria: "Laboratorio de Física",
    marca: "Phywe",
    modelo: "Pendulum 02",
    disponible: 1,
    existente: 1
  },
  {
    id: "INV-COM-0015",
    foto: "",
    nombre: "Mini PC Workstation Core i7 12va Gen",
    categoria: "Cómputo",
    marca: "Intel",
    modelo: "NUC 12 Pro",
    disponible: 6,
    existente: 6
  },
  {
    id: "INV-MED-0016",
    foto: "",
    nombre: "Analizador de Espectro RF 1.5GHz",
    categoria: "Medición",
    marca: "Siglent",
    modelo: "SSA3021X",
    disponible: 0,
    existente: 2
  },
  {
    id: "INV-ROB-0017",
    foto: "",
    nombre: "Robot Móvil Autónomo con LiDAR y ROS2",
    categoria: "Robótica",
    marca: "TurtleBot",
    modelo: "TurtleBot 4",
    disponible: 0,
    existente: 2
  },
  {
    id: "INV-RED-0018",
    foto: "",
    nombre: "Punto de Acceso PoE Wi-Fi 6 Mesh",
    categoria: "Redes",
    marca: "Ubiquiti",
    modelo: "UniFi U6-Mesh",
    disponible: 3,
    existente: 4
  },
  {
    id: "INV-FIS-0019",
    foto: "",
    nombre: "Kit de Sensores Inalámbricos de Fuerza y Movimiento",
    categoria: "Laboratorio de Física",
    marca: "PASCO",
    modelo: "Wireless Sensor Kit",
    disponible: 5,
    existente: 5
  },
  {
    id: "INV-COM-0020",
    foto: "",
    nombre: "Tableta Gráfica Digitalizadora Profesional",
    categoria: "Cómputo",
    marca: "Wacom",
    modelo: "Intuos Pro M",
    disponible: 4,
    existente: 5
  }
];

const CATEGORIAS_DEFINIDAS = [
  { id: "robotica", valor: "Robotica", label: "Robótica" },
  { id: "medicion", valor: "Medicion", label: "Medición" },
  { id: "audiovisual", valor: "Audiovisual", label: "Audiovisual" },
  { id: "computo", valor: "Computo", label: "Cómputo" },
  { id: "redes", valor: "Redes", label: "Redes" },
  { id: "labfis", valor: "LabFis", label: "Laboratorio de Física" }
];

const ITEMS_POR_PAGINA = 8;

function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function coincideCategoria(catProducto, valFiltro) {
  const cProd = normalizar(catProducto);
  const cFiltro = normalizar(valFiltro);
  if (cProd === cFiltro) return true;
  if (cFiltro === "labfis" && (cProd.includes("fisica") || cProd.includes("labfis"))) return true;
  if (cFiltro.includes("fisica") && cProd.includes("fisica")) return true;
  return false;
}

function Catalogo() {
  const navigate = useNavigate();

  // Estados de filtros temporales en el Aside
  const [draftCategorias, setDraftCategorias] = useState([]);
  const [draftDispo, setDraftDispo] = useState("UniLibres");
  const [draftDurac, setDraftDurac] = useState("7");

  // Filtros aplicados efectivamente sobre el inventario y lista de chips
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    categorias: [],
    dispo: "todos",
    durac: "7",
    activo: false
  });

  // Búsqueda en el header
  const [busqueda, setBusqueda] = useState("");
  // Paginación actual
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    window.CATALOGO_PRODUCTOS = CATALOGO_PRODUCTOS;
    return () => {
      delete window.CATALOGO_PRODUCTOS;
    };
  }, []);

  // Requisito 4: Conteo dinámico de productos por categoría
  const conteoPorCategoria = useMemo(() => {
    const conteos = {};
    CATEGORIAS_DEFINIDAS.forEach((cat) => {
      conteos[cat.valor] = CATALOGO_PRODUCTOS.filter((prod) =>
        coincideCategoria(prod.categoria, cat.valor)
      ).length;
    });
    return conteos;
  }, []);

  // Manejo de checkboxes de categoría en el Aside
  const handleToggleCategoria = (valor) => {
    setDraftCategorias((prev) =>
      prev.includes(valor) ? prev.filter((item) => item !== valor) : [...prev, valor]
    );
  };

  // Requisito 3: Botón "Aplicar Filtros"
  const handleAplicarFiltros = (e) => {
    if (e) e.preventDefault();
    setFiltrosAplicados({
      categorias: [...draftCategorias],
      dispo: draftDispo,
      durac: draftDurac,
      activo: true
    });
    setPaginaActual(1);
  };

  // Requisito 3: Botón "Limpiar Todo"
  const handleLimpiarTodo = (e) => {
    if (e) e.preventDefault();
    setDraftCategorias([]);
    setDraftDispo("todos");
    setDraftDurac("99");
    setFiltrosAplicados({
      categorias: [],
      dispo: "todos",
      durac: "99",
      activo: false
    });
    setBusqueda("");
    setPaginaActual(1);
  };

  // Eliminar chips individuales
  const handleRemoverCategoriaChip = (catValor) => {
    const nuevasCategorias = filtrosAplicados.categorias.filter((c) => c !== catValor);
    setDraftCategorias(nuevasCategorias);
    setFiltrosAplicados((prev) => ({
      ...prev,
      categorias: nuevasCategorias
    }));
    setPaginaActual(1);
  };

  const handleRemoverDispoChip = () => {
    setDraftDispo("todos");
    setFiltrosAplicados((prev) => ({
      ...prev,
      dispo: "todos"
    }));
    setPaginaActual(1);
  };

  const handleRemoverDuracChip = () => {
    setDraftDurac("99");
    setFiltrosAplicados((prev) => ({
      ...prev,
      durac: "99"
    }));
    setPaginaActual(1);
  };

  // Búsqueda del header
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPaginaActual(1);
  };

  // Filtrado de productos
  const productosFiltrados = useMemo(() => {
    return CATALOGO_PRODUCTOS.filter((prod) => {
      // 1. Filtro por buscador superior
      if (busqueda.trim() !== "") {
        const query = normalizar(busqueda);
        const matchId = normalizar(prod.id).includes(query);
        const matchNombre = normalizar(prod.nombre).includes(query);
        const matchMarca = normalizar(prod.marca).includes(query);
        const matchModelo = normalizar(prod.modelo).includes(query);
        if (!matchId && !matchNombre && !matchMarca && !matchModelo) {
          return false;
        }
      }

      // Si los filtros han sido aplicados
      if (filtrosAplicados.activo) {
        // 2. Filtro por Categorías
        if (filtrosAplicados.categorias.length > 0) {
          const coincide = filtrosAplicados.categorias.some((catVal) =>
            coincideCategoria(prod.categoria, catVal)
          );
          if (!coincide) return false;
        }

        // 3. Filtro por Disponibilidad
        if (filtrosAplicados.dispo === "UniLibres" && prod.disponible <= 0) {
          return false;
        }

        // 4. Filtro por Duración:
        // Según especificación en prompt.md, todos los productos cuentan para todas las duraciones
      }

      return true;
    });
  }, [filtrosAplicados, busqueda]);

  // Requisito 5: Texto de resumen en el <p> de .catalogo
  const cantidadLibres = useMemo(() => {
    return productosFiltrados.filter((p) => p.disponible > 0).length;
  }, [productosFiltrados]);

  const duracionTexto = useMemo(() => {
    const durac = filtrosAplicados.activo ? filtrosAplicados.durac : draftDurac;
    if (durac === "99" || durac === "sinlimit") {
      return `${cantidadLibres} equipos con unidades libres sin límite de días`;
    }
    return `${cantidadLibres} equipos con unidades libres de hasta ${durac} días`;
  }, [cantidadLibres, filtrosAplicados, draftDurac]);

  // Requisito 2: Paginación
  const totalItems = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, paginaActual), totalPaginas);

  const inicioIdx = (paginaValida - 1) * ITEMS_POR_PAGINA;
  const productosEnPagina = productosFiltrados.slice(inicioIdx, inicioIdx + ITEMS_POR_PAGINA);

  const textoPaginacion = useMemo(() => {
    if (totalItems === 0) {
      return "Mostrando 0 a 0 de 0 equipos";
    }
    const x = inicioIdx + 1;
    const y = Math.min(inicioIdx + ITEMS_POR_PAGINA, totalItems);
    return `Mostrando ${x} a ${y} de ${totalItems} equipos`;
  }, [totalItems, inicioIdx]);

  return (
    <div className="catalogo-page">
      {/* HEADER */}
      <header>
        <div className="title">
          <div className="square"></div>
          <h2>Almacén de equipos</h2>
        </div>
        <ul>
          <li>
            <Link to="/catalogo" className="rapi_mov selected">
              Catálogo
            </Link>
          </li>
          <li>
            <Link to="/missolicitudes" className="rapi_mov">
              Mis Solicitudes
            </Link>
          </li>
          <li>
            <Link to="/mis-reservas" className="rapi_mov">
              Mis Reservas
            </Link>
          </li>
          <li>
            <Link to="/calendario" className="rapi_mov">
              Calendario
            </Link>
          </li>
        </ul>
        <div className="derecha_div">
          <form className="buscador_top" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              name="codigo"
              placeholder="⌕ Buscar por código de inventario: INV-OSC-0042"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>
          <div className="perfil">
            <h3>Nombre Apellido</h3>
            <div className="pfp"></div>
          </div>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="catalogo-main">
        {/* ASIDE CON FILTROS */}
        <aside className="buscador">
          <section className="contener_text">
            <h2>Filtros</h2>
            <h3>CATEGORÍA</h3>
            {CATEGORIAS_DEFINIDAS.map((cat) => (
              <div key={cat.id}>
                <input
                  type="checkbox"
                  id={cat.id}
                  name={cat.id}
                  value={cat.valor}
                  checked={draftCategorias.includes(cat.valor)}
                  onChange={() => handleToggleCategoria(cat.valor)}
                />
                <label htmlFor={cat.id}>
                  {cat.label}{" "}
                  <span className="contador_categoria">
                    ({conteoPorCategoria[cat.valor] ?? 0})
                  </span>
                </label>
              </div>
            ))}

            <h3>DISPONIBILIDAD</h3>
            <input
              type="radio"
              id="libres"
              name="dispo"
              value="UniLibres"
              checked={draftDispo === "UniLibres"}
              onChange={() => setDraftDispo("UniLibres")}
            />
            <label htmlFor="libres">Unidades Libres</label>
            <br />
            <input
              type="radio"
              id="todos"
              name="dispo"
              value="todos"
              checked={draftDispo === "todos"}
              onChange={() => setDraftDispo("todos")}
            />
            <label htmlFor="todos">Todos</label>

            <h3>DURACIÓN MAXIMA</h3>
            <input
              type="radio"
              id="7dias"
              name="durac"
              value="7"
              checked={draftDurac === "7"}
              onChange={() => setDraftDurac("7")}
            />
            <label htmlFor="7dias">Hasta 7 días</label>
            <br />
            <input
              type="radio"
              id="15dias"
              name="durac"
              value="15"
              checked={draftDurac === "15"}
              onChange={() => setDraftDurac("15")}
            />
            <label htmlFor="15dias">Hasta 15 días</label>
            <br />
            <input
              type="radio"
              id="sinlimit"
              name="durac"
              value="99"
              checked={draftDurac === "99"}
              onChange={() => setDraftDurac("99")}
            />
            <label htmlFor="sinlimit">Sin limites</label>
            <br />
          </section>

          <button type="button" className="aplicarf" onClick={handleAplicarFiltros}>
            Aplicar Filtros
          </button>
          <br />
          <button type="button" className="limpiar" onClick={handleLimpiarTodo}>
            Limpiar Todo
          </button>
        </aside>

        {/* CONTENEDOR DEL CATÁLOGO */}
        <div className="catalogo">
          <h1>Catálogo de Equipos</h1>
          {/* Requisito 5: Resumen actualizado dinámicamente */}
          <p>{duracionTexto}</p>

          {/* Requisito 3: Chips interactivos en section.lista_filtros */}
          <section className="lista_filtros">
            {filtrosAplicados.activo && (
              <>
                {filtrosAplicados.categorias.map((catVal) => {
                  const catDef = CATEGORIAS_DEFINIDAS.find((c) => c.valor === catVal);
                  return (
                    <div className="filtro_chip" key={catVal}>
                      <span>{catDef ? catDef.label : catVal}</span>
                      <button
                        type="button"
                        className="chip_x"
                        aria-label={`Eliminar filtro ${catDef ? catDef.label : catVal}`}
                        onClick={() => handleRemoverCategoriaChip(catVal)}
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}

                {filtrosAplicados.dispo === "UniLibres" && (
                  <div className="filtro_chip">
                    <span>Unidades Libres</span>
                    <button
                      type="button"
                      className="chip_x"
                      aria-label="Eliminar filtro de Unidades Libres"
                      onClick={handleRemoverDispoChip}
                    >
                      &times;
                    </button>
                  </div>
                )}

                {(filtrosAplicados.durac === "7" || filtrosAplicados.durac === "15") && (
                  <div className="filtro_chip">
                    <span>Hasta {filtrosAplicados.durac} días</span>
                    <button
                      type="button"
                      className="chip_x"
                      aria-label={`Eliminar filtro de Hasta ${filtrosAplicados.durac} días`}
                      onClick={handleRemoverDuracChip}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Requisito 1: Despliegue de tarjetas card_producto en .inventario */}
          <section className="inventario">
            {totalItems === 0 ? (
              <p className="sin_resultados">
                No se encontraron equipos disponibles con los filtros seleccionados.
              </p>
            ) : (
              productosEnPagina.map((prod) => (
                <article
                  key={prod.id}
                  className="card_producto"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/solicitarproducto", { state: { producto: prod } })}
                  title="Clic para solicitar préstamo de este equipo"
                >
                  <div className="card_imagen">
                    {prod.foto ? (
                      <img src={prod.foto} alt={prod.nombre} />
                    ) : (
                      <span>foto 1:1</span>
                    )}
                  </div>
                  <div className="card_contenido">
                    <h3 className="card_titulo">{prod.nombre}</h3>
                    <p className="card_subtitulo">
                      {prod.marca} · {prod.modelo}
                    </p>
                    <div className="card_footer">
                      <span className="badge_categoria">{prod.categoria.toUpperCase()}</span>
                      <span
                        className={`unidades_disponibles ${
                          prod.disponible === 0 ? "sin_unidades" : ""
                        }`}
                      >
                        <b>{prod.disponible}</b> / {prod.existente} libres
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          {/* Requisito 2: Paginación (8 productos por página) */}
          <section className="pags">
            <p>{textoPaginacion}</p>
            <nav>
              <button
                type="button"
                aria-label="Página anterior"
                disabled={paginaValida <= 1 || totalItems === 0}
                onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
              >
                &lt;
              </button>

              {Array.from({ length: totalPaginas }, (_, idx) => idx + 1).map((num) => (
                <button
                  type="button"
                  key={num}
                  className={num === paginaValida ? "enpag" : ""}
                  onClick={() => setPaginaActual(num)}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                aria-label="Página siguiente"
                disabled={paginaValida >= totalPaginas || totalItems === 0}
                onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
              >
                &gt;
              </button>
            </nav>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <h2>Almacén de Equipos · Facultad de Ingeniería</h2>
        <section className="info_f">
          <a href="#">Reglamento de Prestamo</a>
          <p>almacen.equipos@ulima.edu.pe</p>
          <p>Anexo 3120</p>
        </section>
      </footer>
    </div>
  );
}

export default Catalogo;
