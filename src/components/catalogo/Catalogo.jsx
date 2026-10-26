import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/catalogo/catalogo.css";
import useIdentidad from "../useIdentidad.js";
import HeaderEstudiante from "../compartidos/HeaderEstudiante.jsx";

// =============================================================================
// DATASET DE PRODUCTOS (CATÁLOGO DE INVENTARIO)
// =============================================================================
const CATALOGO_PRODUCTOS = [
  {
    id: "INV-OSC-0042",
    foto: "/public/imagenes/osciloscopio.webp",
    nombre: "Osciloscopio TBS1052B",
    categoria: "Medición",
    marca: "Tektronix",
    modelo: "TBS1052B",
    disponible: 3,
    existente: 5
  },
  {
    id: "INV-CAM-0009",
    foto: "/public/imagenes/camara.avif",
    nombre: "Cámara Canon EOS 90D",
    categoria: "Audiovisual",
    marca: "Canon",
    modelo: "EOS 90D",
    disponible: 2,
    existente: 4
  },
  {
    id: "INV-ARD-0013",
    foto: "/public/imagenes/arduino.jpg",
    nombre: "Kit de robótica Arduino Mega",
    categoria: "Robótica",
    marca: "Arduino",
    modelo: "Mega 2560",
    disponible: 6,
    existente: 6
  },
  {
    id: "INV-TAB-0003",
    foto: "/public/imagenes/tableta.webp",
    nombre: "Tableta gráfica Wacom Intuos",
    categoria: "Cómputo",
    marca: "Wacom",
    modelo: "CTL-4100",
    disponible: 1,
    existente: 3
  },
  {
    id: "INV-MUL-0022",
    foto: "/public/imagenes/multimetro.webp",
    nombre: "Multímetro Fluke 117",
    categoria: "Medición",
    marca: "Fluke",
    modelo: "117",
    disponible: 0,
    existente: 3
  },
  {
    id: "INV-RED-0001",
    foto: "/public/imagenes/analisador.webp",
    nombre: "Analizador de redes portátil",
    categoria: "Redes",
    marca: "NetAlly",
    modelo: "LinkRunner",
    disponible: 2,
    existente: 3
  },
  {
    id: "INV-TRI-0006",
    foto: "/public/imagenes/tripode.webp",
    nombre: "Trípode profesional Manfrotto",
    categoria: "Audiovisual",
    marca: "Manfrotto",
    modelo: "MT055",
    disponible: 4,
    existente: 5
  },
  {
    id: "INV-FUE-0031",
    foto: "/public/imagenes/fuente.jpg",
    nombre: "Fuente de poder regulable",
    categoria: "Lab. de física",
    marca: "Korad",
    modelo: "KA3005P",
    disponible: 3,
    existente: 4
  },
  {
    id: "INV-LAP-0050",
    foto: "/public/imagenes/laptop.webp",
    nombre: "Laptop Dell Latitude 5420",
    categoria: "Cómputo",
    marca: "Dell",
    modelo: "Latitude 5420",
    disponible: 5,
    existente: 5
  },
  {
    id: "INV-PRO-0060",
    foto: "/public/imagenes/proyector.jpg",
    nombre: "Proyector Epson PowerLite X49",
    categoria: "Audiovisual",
    marca: "Epson",
    modelo: "PowerLite X49",
    disponible: 1,
    existente: 4
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
  const { rol, nombreCorto, paginaCuenta } = useIdentidad();
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
      <HeaderEstudiante
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onBuscar={handleSearchSubmit}
      />

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