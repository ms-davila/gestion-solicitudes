import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../compartidos/MenuLateral.jsx";
import "../../styles/devoluciones/Devoluciones.css";
import fotoUsb from "../../assets/USB.jpg";
import HeaderEncargado from "../compartidos/HeaderEncargado.jsx";

// ---- Datos del préstamo que se está devolviendo ----
const PENALIDAD_DIA = 15;
const MS_DIA = 86400000;
const prestamo = {
  codigo: "PRE-2026-0291",
  equipo: "Tableta Wacom Intuos",
  estudiante: "Camila Quispe Andrade",
  unidad: "INV-TAB-0004",
  entrega: "2026-09-07",
  pactada: "11/09/2026",
  maxDias: 10,
  fechaSugerida: "2026-09-14",
};

// dd/mm/aaaa -> Date
function convertirFecha(texto) {
  const p = texto.split("/");
  return new Date(p[2], p[1] - 1, p[0]);
}
// aaaa-mm-dd -> Date
function convertirIso(texto) {
  const p = texto.split("-");
  return new Date(p[0], p[1] - 1, p[2]);
}
function diasRetraso(textoRetorno) {
  if (textoRetorno.length !== 10) return 0;
  return Math.round((convertirFecha(textoRetorno) - convertirFecha(prestamo.pactada)) / MS_DIA);
}

function Devoluciones() {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState(null); // { texto, tipo }
  const [codigo, setCodigo] = useState(prestamo.codigo);
  const [estadoRetorno, setEstadoRetorno] = useState("faltantes"); // sin | danos | faltantes
  const [acc, setAcc] = useState({ lapiz: true, usb: false, estuche: true });
  const [falt, setFalt] = useState({ usb: true, lapiz: false, estuche: false });
  const [fechaRetorno, setFechaRetorno] = useState("14/09/2026");
  const [retornoReal, setRetornoReal] = useState("14/09/2026");
  const [resultado, setResultado] = useState(null); // { dias, hayDanos }
  const [descripcion, setDescripcion] = useState(
    "Superficie activa con rayadura profunda en la esquina inferior derecha; el trazo se corta en esa zona."
  );
  const [derivar, setDerivar] = useState(true);

  // modal de renovación (5.3)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPosible, setModalPosible] = useState(false);
  const [modalMotivo, setModalMotivo] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState(prestamo.fechaSugerida);

  const hayDanos = estadoRetorno !== "sin";

  function mostrarMensaje(texto, tipo) {
    setMensaje({ texto, tipo });
    window.scrollTo(0, 0);
  }

  function buscar() {
    const c = codigo.trim().toUpperCase();
    if (c === prestamo.codigo) {
      mostrarMensaje(`Préstamo ${c} encontrado: ${prestamo.estudiante} · ${prestamo.equipo}.`, "verde");
    } else {
      mostrarMensaje(`No encontramos el préstamo ${c}.`, "roja");
    }
  }

  function cambiarAcc(clave) {
    const presente = !acc[clave];
    setAcc({ ...acc, [clave]: presente });
    setFalt({ ...falt, [clave]: !presente });
  }

  function registrar() {
    const texto = fechaRetorno.trim();
    if (texto.length !== 10) {
      mostrarMensaje("Escribe la fecha con formato dd/mm/aaaa.", "roja");
      return;
    }
    setRetornoReal(texto);
    setResultado({ dias: diasRetraso(texto), hayDanos });
  }

  function guardarDanos() {
    if (descripcion.trim().length < 10) {
      mostrarMensaje("Escribe una descripción de al menos 10 caracteres.", "roja");
    } else if (derivar) {
      mostrarMensaje("Devolución cerrada. Unidad pasó a mantenimiento.", "verde");
    } else {
      mostrarMensaje("Devolución cerrada sin derivar a mantenimiento.", "verde");
    }
  }

  // ---- Modal de renovación ----
  function abrirRenovar() {
    const dias = diasRetraso(fechaRetorno.trim());
    if (dias <= 0 && estadoRetorno === "sin") {
      setModalPosible(true);
      setNuevaFecha(prestamo.fechaSugerida);
    } else {
      setModalPosible(false);
      setModalMotivo(
        dias > 0
          ? `Este préstamo tiene ${dias} ${dias === 1 ? "día" : "días"} de retraso y una penalidad pendiente. No se puede renovar un equipo devuelto fuera de plazo.`
          : "El equipo regresó con daños o faltantes y debe pasar por revisión. No se puede renovar."
      );
    }
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  // valida la nueva fecha y devuelve el aviso a mostrar
  function revisarNuevaFecha() {
    if (!nuevaFecha) {
      return { ok: false, texto: "Elige la nueva fecha." };
    }
    const nueva = convertirIso(nuevaFecha);
    const vence = convertirFecha(prestamo.pactada);
    if (nueva <= vence) {
      return { ok: false, texto: "La nueva fecha debe ser posterior al vencimiento actual." };
    }
    const total = Math.round((nueva - convertirIso(prestamo.entrega)) / MS_DIA);
    if (total > prestamo.maxDias) {
      return {
        ok: false,
        texto: `Duración total ${total} de ${prestamo.maxDias} días permitidos. Elige una fecha anterior.`,
      };
    }
    return {
      ok: true,
      texto: `Duración total ${total} de ${prestamo.maxDias} días permitidos. No hay solicitudes ni reservas en espera en el nuevo rango.`,
    };
  }

  function confirmarRenovar() {
    if (revisarNuevaFecha().ok) {
      cerrarModal();
      mostrarMensaje("Préstamo renovado exitosamente.", "verde");
    }
  }

  const avisoFecha = revisarNuevaFecha();
  const dias = resultado ? resultado.dias : 3;
  const penalidad = dias * PENALIDAD_DIA;

  return (
    <div className="pagina-devoluciones">

      {/* CABECERA */}
      <HeaderEncargado />

      {/* CUERPO */}
      <div className="cuerpo">

        {/* MENÚ LATERAL: la página actual (Devoluciones) va resaltada */}
          <MenuLateral />
        {/* CONTENIDO */}
        <main className="contenido">
          <h1 className="titulo-pantalla">Registrar devolución</h1>
          <p className="texto-ayuda">Devolución con retraso y accesorio faltante</p>

          {/* mensaje de resultado: el JavaScript lo muestra y le cambia el texto */}
          {mensaje && <div id="mensaje" className={`alerta alerta-${mensaje.tipo}`}>{mensaje.texto}</div>}

          <div className="columnas">

            {/* 5.1 REGISTRO DE DEVOLUCIÓN */}
            <section className="tarjeta">
              <label className="etiqueta-campo">BUSCAR PRÉSTAMO</label>
              <div className="fila-buscar">
                <input className="campo codigo" id="codigo-prestamo" type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                <button className="boton boton-primario" id="btn-buscar" onClick={buscar}>Buscar</button>
              </div>

              <div className="datos-prestamo">
                <div className="dato">
                  <span className="etiqueta-campo">ESTUDIANTE</span>
                  <span>Camila Quispe Andrade</span>
                </div>
                <div className="dato">
                  <span className="etiqueta-campo">EQUIPO Y UNIDAD</span>
                  <span>Tableta Wacom Intuos · <span className="codigo">INV-TAB-0004</span></span>
                </div>
                <div className="dato">
                  <span className="etiqueta-campo">DEVOLUCIÓN PACTADA</span>
                  <span className="codigo" id="fecha-pactada">{prestamo.pactada}</span>
                </div>
                <div className="dato">
                  <span className="etiqueta-campo">RETORNO REAL</span>
                  <span className="codigo" id="retorno-real">{retornoReal}</span>
                </div>
              </div>

              <h2 className="subtitulo-seccion">VERIFICACIÓN DE ACCESORIOS</h2>
              <hr className="linea" />

              <label className="accesorio">
                <input id="acc-lapiz" type="checkbox" checked={acc.lapiz} onChange={() => cambiarAcc("lapiz")} />
                <span className="accesorio-nombre">Lápiz digital</span>
                <span className="texto-faltante">faltante</span>
              </label>
              <label className="accesorio">
                <input id="acc-usb" type="checkbox" checked={acc.usb} onChange={() => cambiarAcc("usb")} />
                <span className="accesorio-nombre">Cable USB</span>
                <span className="texto-faltante">faltante</span>
              </label>
              <label className="accesorio">
                <input id="acc-estuche" type="checkbox" checked={acc.estuche} onChange={() => cambiarAcc("estuche")} />
                <span className="accesorio-nombre">Estuche</span>
                <span className="texto-faltante">faltante</span>
              </label>

              <div className="fila-estado">
                <div className="grupo-estado">
                  <label className="etiqueta-campo">ESTADO DE RETORNO</label>
                  <div className="opciones-estado">
                    <button className={`opcion${estadoRetorno === "sin" ? " opcion-activa-verde" : ""}`} id="btn-sin" onClick={() => setEstadoRetorno("sin")}>Sin novedades</button>
                    <button className={`opcion${estadoRetorno === "danos" ? " opcion-activa-roja" : ""}`} id="btn-danos" onClick={() => setEstadoRetorno("danos")}>Con daños</button>
                    <button className={`opcion${estadoRetorno === "faltantes" ? " opcion-activa-roja" : ""}`} id="btn-faltantes" onClick={() => setEstadoRetorno("faltantes")}>Faltantes</button>
                  </div>
                </div>
                <div className="grupo-fecha">
                  <label className="etiqueta-campo">FECHA DE RETORNO</label>
                  <input className="campo codigo" id="fecha-retorno" type="text" value={fechaRetorno} onChange={(e) => setFechaRetorno(e.target.value)} />
                </div>
              </div>

              {dias <= 0 ? (
                <div className="alerta alerta-verde" id="alerta-retraso">
                  <b>Devolución a tiempo · 0 días de retraso.</b> Sin penalidad.{" "}
                  {hayDanos ? "Completa el registro de daños." : <>La unidad <span className="codigo">{prestamo.unidad}</span> vuelve al estado «Disponible».</>}
                </div>
              ) : (
                <div className="alerta alerta-roja" id="alerta-retraso">
                  <b>{dias} {dias === 1 ? "día" : "días"} de retraso.</b> Penalidad calculada: <b className="codigo">S/ {penalidad}.00</b> (S/ {PENALIDAD_DIA}.00 por día). La cuenta quedará bloqueada hasta regularizar.
                </div>
              )}

              <div className="botones-fila">
                <button className="boton boton-secundario" id="btn-cancelar-1" onClick={() => mostrarMensaje("Operación cancelada.", "amarilla")}>Cancelar</button>
                <button className="boton boton-primario" id="btn-registrar" onClick={registrar}>Registrar devolución</button>
              </div>
            </section>

            {/* 5.2 DAÑOS O FALTANTES */}
            <section className={`tarjeta${hayDanos ? "" : " oculto"}`} id="tarjeta-danos">
              <h2 className="titulo-seccion">Registrar daños o faltantes</h2>
              <p className="texto-ayuda">Paso siguiente cuando el retorno no es «sin novedades»</p>

              <label className="etiqueta-campo">DESCRIPCIÓN DEL DAÑO</label>
              <textarea className="campo area-texto" id="descripcion-dano" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

              <div className="fila-faltantes">
                <div className="columna-faltantes">
                  <span className="etiqueta-campo">ACCESORIOS FALTANTES</span>

                  <label className="faltante">
                    <input id="falt-usb" type="checkbox" checked={falt.usb} onChange={() => setFalt({ ...falt, usb: !falt.usb })} />
                    <span>Cable USB</span>
                  </label>

                  <label className="faltante">
                    <input id="falt-lapiz" type="checkbox" checked={falt.lapiz} onChange={() => setFalt({ ...falt, lapiz: !falt.lapiz })} />
                    <span>Lápiz digital</span>
                  </label>

                  <label className="faltante">
                    <input id="falt-estuche" type="checkbox" checked={falt.estuche} onChange={() => setFalt({ ...falt, estuche: !falt.estuche })} />
                    <span>Estuche</span>
                  </label>
                </div>

                <div className="columna-foto">
                  <span className="etiqueta-campo">FOTOGRAFÍA DEL DAÑO</span>
                  <div className="foto-dano codigo"><img src={fotoUsb} alt="fotografía del daño" /></div>
                </div>
              </div>

              <label className="derivacion">
                <input type="checkbox" id="derivar" checked={derivar} onChange={() => setDerivar(!derivar)} />
                <span className="interruptor"></span>
                <span>Derivar la unidad a mantenimiento</span>
              </label>

              <div className={`alerta alerta-amarilla${derivar ? "" : " oculto"}`} id="alerta-inventario">
                <b>Efecto sobre el inventario.</b> La unidad <span className="codigo">INV-TAB-0004</span> pasará a «En mantenimiento» y la disponibilidad del equipo bajará de 1 a 0 unidades libres. Hay 1 reserva del 22/09/2026 que deberá reasignarse.
              </div>

              <div className="botones-fila">
                <button className="boton boton-secundario" id="btn-cancelar-2" onClick={() => mostrarMensaje("Operación cancelada.", "amarilla")}>Cancelar</button>
                <button className="boton boton-primario" id="btn-guardar" onClick={guardarDanos}>Guardar y cerrar devolución</button>
              </div>
            </section>

          </div>

          {/* botón para renovar: abajo de las dos tarjetas */}
          <div className="botones-fila">
            <button className="boton boton-secundario" id="btn-renovar-prestamo" onClick={abrirRenovar}>Renovar préstamo</button>
          </div>

        </main>
      </div>

      {/* PIE DE PÁGINA */}
      <footer className="pie">
        <span>Almacén de Equipos · Panel del encargado · Almacén H-102</span>
        <div className="pie-derecha">
          <span>Manual del encargado</span>
          <span>Soporte: sistemas@ulima.edu.pe</span>
          <span className="codigo">Última sincronización: 14/09/2026 08:05</span>
        </div>
      </footer>

      {/* 5.3 MODAL DE RENOVACIÓN: dos variantes (posible / bloqueada) */}
      <div className={`modal${modalAbierto ? " abierto" : ""}`} id="modal-renovar" onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}>
        <div className="modal-caja">
          <h2 className="titulo-seccion">Renovar préstamo</h2>
          <p className="modal-subtitulo">
            <span className="codigo">{prestamo.codigo}</span> · {prestamo.equipo} · {prestamo.estudiante}
          </p>

          {modalPosible ? (
            <>
              <div id="bloque-fechas">
                <div className="fila-fechas">
                  <div>
                    <label className="etiqueta-campo">VENCIMIENTO ACTUAL</label>
                    <input className="campo codigo campo-bloqueado" id="modal-vencimiento" type="text" value={prestamo.pactada} disabled readOnly />
                  </div>
                  <div>
                    <label className="etiqueta-campo">NUEVA FECHA</label>
                    <input className="campo codigo" id="nueva-fecha" type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={`alerta alerta-borde ${avisoFecha.ok ? "alerta-verde" : "alerta-amarilla"}`} id="modal-aviso">
                {avisoFecha.texto}
              </div>

              <div className="botones-fila" id="botones-posible">
                <button className="boton boton-secundario" id="btn-cancelar-modal" onClick={cerrarModal}>Cancelar</button>
                <button className="boton boton-primario" id="btn-renovar" onClick={confirmarRenovar}>Renovar</button>
              </div>
            </>
          ) : (
            <>
              <div className="alerta alerta-amarilla alerta-borde" id="modal-aviso">{modalMotivo}</div>

              <div id="botones-bloqueado">
                <button className="boton boton-deshabilitado boton-ancho" disabled>Renovar</button>
                <button className="boton boton-secundario boton-ancho" id="btn-ver-lista" onClick={() => { cerrarModal(); navigate("/lista-espera"); }}>Ver lista de espera</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Devoluciones;