import MenuLateral from "../MenuLateral.jsx";
import "../../styles/devoluciones/Devoluciones.css";
import fotoUsb from "../../assets/USB.jpg";
import useIdentidad from "../useIdentidad.js";
import BotonSalir from "../BotonSalir.jsx";

function Devoluciones() {
  const { iniciales } = useIdentidad();
  return (
    <div>

      {/* CABECERA */}
      <header className="cabecera">
          <div className="cabecera-izquierda">
            <span className="nombre-sistema">Almacén de Equipos</span>
        </div>

        <div className="cabecera-centro">
          <input className="buscador" type="text" placeholder="⌕ Buscar por código de préstamo: PRE-2026-0291" />
        </div>

        <div className="cabecera-derecha">
          <div className="pendientes">
            <span>Solicitudes pendientes</span>
            <span className="contador-pendientes codigo">12</span>
          </div>
          <div className="avatar">{iniciales}</div>
          <BotonSalir />
        </div>
      </header>

      {/* CUERPO */}
      <div className="cuerpo">

        {/* MENÚ LATERAL: la página actual (Devoluciones) va resaltada */}
          <MenuLateral />
        {/* CONTENIDO */}
        <main className="contenido">
          <h1 className="titulo-pantalla">Registrar devolución</h1>
          <p className="texto-ayuda">Devolución con retraso y accesorio faltante</p>

          {/* mensaje de resultado: el JavaScript lo muestra y le cambia el texto */}
          <div id="mensaje" className="alerta oculto"></div>

          <div className="columnas">

            {/* 5.1 REGISTRO DE DEVOLUCIÓN */}
            <section className="tarjeta">
              <label className="etiqueta-campo">BUSCAR PRÉSTAMO</label>
              <div className="fila-buscar">
                <input className="campo codigo" id="codigo-prestamo" type="text" defaultValue="PRE-2026-0291" />
                <button className="boton boton-primario" id="btn-buscar">Buscar</button>
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
                  <span className="codigo" id="fecha-pactada">11/09/2026</span>
                </div>
                <div className="dato">
                  <span className="etiqueta-campo">RETORNO REAL</span>
                  <span className="codigo" id="retorno-real">14/09/2026</span>
                </div>
              </div>

              <h2 className="subtitulo-seccion">VERIFICACIÓN DE ACCESORIOS</h2>
              <hr className="linea" />

              <label className="accesorio">
                <input id="acc-lapiz" type="checkbox" defaultChecked />
                <span className="accesorio-nombre">Lápiz digital</span>
                <span className="texto-faltante">faltante</span>
              </label>
              <label className="accesorio">
                <input id="acc-usb" type="checkbox" />
                <span className="accesorio-nombre">Cable USB</span>
                <span className="texto-faltante">faltante</span>
              </label>
              <label className="accesorio">
                <input id="acc-estuche" type="checkbox" defaultChecked />
                <span className="accesorio-nombre">Estuche</span>
                <span className="texto-faltante">faltante</span>
              </label>

              <div className="fila-estado">
                <div className="grupo-estado">
                  <label className="etiqueta-campo">ESTADO DE RETORNO</label>
                  <div className="opciones-estado">
                    <button className="opcion" id="btn-sin">Sin novedades</button>
                    <button className="opcion" id="btn-danos">Con daños</button>
                    <button className="opcion opcion-activa-roja" id="btn-faltantes">Faltantes</button>
                  </div>
                </div>
                <div className="grupo-fecha">
                  <label className="etiqueta-campo">FECHA DE RETORNO</label>
                  <input className="campo codigo" id="fecha-retorno" type="text" defaultValue="14/09/2026" />
                </div>
              </div>

              <div className="alerta alerta-roja" id="alerta-retraso">
                <b>3 días de retraso.</b> Penalidad calculada: <b className="codigo">S/ 45.00</b> (S/ 15.00 por día). La cuenta quedará bloqueada hasta regularizar.
              </div>

              <div className="botones-fila">
                <button className="boton boton-secundario" id="btn-cancelar-1">Cancelar</button>
                <button className="boton boton-primario" id="btn-registrar">Registrar devolución</button>
              </div>
            </section>

            {/* 5.2 DAÑOS O FALTANTES */}
            <section className="tarjeta" id="tarjeta-danos">
              <h2 className="titulo-seccion">Registrar daños o faltantes</h2>
              <p className="texto-ayuda">Paso siguiente cuando el retorno no es «sin novedades»</p>

              <label className="etiqueta-campo">DESCRIPCIÓN DEL DAÑO</label>
              <textarea className="campo area-texto" id="descripcion-dano">Superficie activa con rayadura profunda en la esquina inferior derecha; el trazo se corta en esa zona.</textarea>

              <div className="fila-faltantes">
                <div className="columna-faltantes">
                  <span className="etiqueta-campo">ACCESORIOS FALTANTES</span>

                  <label className="faltante">
                    <input id="falt-usb" type="checkbox" defaultChecked />
                    <span>Cable USB</span>
                  </label>

                  <label className="faltante">
                    <input id="falt-lapiz" type="checkbox" />
                    <span>Lápiz digital</span>
                  </label>

                  <label className="faltante">
                    <input id="falt-estuche" type="checkbox" />
                    <span>Estuche</span>
                  </label>
                </div>

                <div className="columna-foto">
                  <span className="etiqueta-campo">FOTOGRAFÍA DEL DAÑO</span>
                  <div className="foto-dano codigo"><img src={fotoUsb} alt="fotografía del daño" /></div>
                </div>
              </div>

              <label className="derivacion">
                <input type="checkbox" id="derivar" defaultChecked />
                <span className="interruptor"></span>
                <span>Derivar la unidad a mantenimiento</span>
              </label>

              <div className="alerta alerta-amarilla" id="alerta-inventario">
                <b>Efecto sobre el inventario.</b> La unidad <span className="codigo">INV-TAB-0004</span> pasará a «En mantenimiento» y la disponibilidad del equipo bajará de 1 a 0 unidades libres. Hay 1 reserva del 22/09/2026 que deberá reasignarse.
              </div>

              <div className="botones-fila">
                <button className="boton boton-secundario" id="btn-cancelar-2">Cancelar</button>
                <button className="boton boton-primario" id="btn-guardar">Guardar y cerrar devolución</button>
              </div>
            </section>

          </div>

          {/* botón para renovar: abajo de las dos tarjetas */}
          <div className="botones-fila">
            <button className="boton boton-secundario" id="btn-renovar-prestamo">Renovar préstamo</button>
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

      {/* 5.3 MODAL DE RENOVACIÓN: es uno solo, el JS cambia su contenido según la situación */}
      <div className="modal" id="modal-renovar">
        <div className="modal-caja">
          <h2 className="titulo-seccion">Renovar préstamo</h2>
          <p className="modal-subtitulo"><span className="codigo" id="modal-codigo"></span> · <span id="modal-detalle"></span></p>

          {/* fechas: solo se ven en la situación 1 (devuelto a tiempo y en buen estado) */}
          <div id="bloque-fechas">
            <div className="fila-fechas">
              <div>
                <label className="etiqueta-campo">VENCIMIENTO ACTUAL</label>
                <input className="campo codigo campo-bloqueado" id="modal-vencimiento" type="text" disabled />
              </div>
              <div>
                <label className="etiqueta-campo">NUEVA FECHA</label>
                <input className="campo codigo" id="nueva-fecha" type="date" />
              </div>
            </div>
          </div>

          {/* aviso: verde si se puede renovar, amarillo si no se puede o la fecha no sirve */}
          <div className="alerta alerta-borde" id="modal-aviso"></div>

          {/* botones cuando SÍ se puede renovar */}
          <div className="botones-fila" id="botones-posible">
            <button className="boton boton-secundario" id="btn-cancelar-modal">Cancelar</button>
            <button className="boton boton-primario" id="btn-renovar">Renovar</button>
          </div>

          {/* botones cuando NO se puede renovar */}
          <div id="botones-bloqueado">
            <button className="boton boton-deshabilitado boton-ancho" disabled>Renovar</button>
            <button className="boton boton-secundario boton-ancho" id="btn-ver-lista">Ver lista de espera</button>
          </div>
        </div>
      </div>
</div>
  );
}

export default Devoluciones;