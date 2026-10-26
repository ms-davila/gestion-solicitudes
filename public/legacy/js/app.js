const $ = (s, r = document) => r.querySelector(s);
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let db = Almacen.cargar();

// Incorpora a la base guardada los equipos nuevos de data.js (sin borrar nada).
// db.demoIds recuerda cuáles equipos de demo ya se agregaron, así uno que
// elimines a mano no vuelve a aparecer.
(function completarDemo() {
  const demo = crearDemo();
  if (!db.demoIds) db.demoIds = db.equipos.map((e) => e.id);
  demo.equipos.forEach((e) => {
    if (db.demoIds.includes(e.id)) return;
    db.equipos.push(e);
    demo.unidades.filter((u) => u.equipoId === e.id).forEach((u) => db.unidades.push(u));
    db.demoIds.push(e.id);
  });
  Almacen.guardar(db);
})();
let vista = { tipo: 'inventario' };
let filtros = { categoria: '', estado: '', codigo: '' };
let pagina = 1;
let form = null;      
let pendiente = null; 
const main = $('#vista');
const guardarDb = () => Almacen.guardar(db);

function aviso(texto, tipo) {
  const d = document.createElement('div');
  d.className = 'aviso' + (tipo === 'error' ? ' error' : '');
  d.textContent = texto;
  $('#avisos').appendChild(d);
  setTimeout(() => d.remove(), 3500);
}

const etiqueta = (estado) => `<span class="etiqueta et-${estado}">${ESTADOS[estado]}</span>`;
const urlFoto = (e) => {
  if (e.foto) return e.foto;
  const nombre = (e.nombre || '').toLowerCase();
  const reglas = [
    ['osciloscopio', '/imagenes/osciloscopio.webp'],
    ['multímetro', '/imagenes/multimetro.webp'],
    ['cámara', '/imagenes/camara.avif'],
    ['arduino', '/imagenes/arduino.jpg'],
    ['kit', '/imagenes/arduino.jpg'],
    ['fuente', '/imagenes/fuente.jpg'],
    ['profesional', '/imagenes/tripode.webp'],
    ['gráfica', '/imagenes/tableta.webp'],
    ['5420', '/imagenes/laptop.webp'],
    ['epson', '/imagenes/proyector.jpg'],
  ];
  const r = reglas.find(([palabra]) => nombre.includes(palabra));
  return r ? r[1] : '/imagenes/analisador.webp';
};

const foto = (e) => `<img class="foto" src="${esc(urlFoto(e))}" alt="${esc(e.nombre || 'Equipo')}" onerror="this.onerror=null;this.src='/imagenes/analisador.webp'">`;

function textoResumen(r) {
  const p = [];
  if (r.disponible) p.push(`<span class="libre">${r.disponible} ${r.disponible === 1 ? 'libre' : 'libres'}</span>`);
  if (r.prestada) p.push(`<span class="prestada">${r.prestada} ${r.prestada === 1 ? 'prestada' : 'prestadas'}</span>`);
  if (r.mant) p.push(`<span class="mant">${r.mant} mant.</span>`);
  if (r.baja) p.push(`<span class="baja">${r.baja} de baja</span>`);
  return p.length ? p.join('<span class="punto">·</span>') : '<span class="baja">Sin unidades</span>';
}

function ir(v) { vista = v; cerrarModal(); render(); window.scrollTo(0, 0); }

function render() {
  if (vista.tipo === 'inventario') { main.innerHTML = vInventario(); renderTabla(); }
  else if (vista.tipo === 'form') main.innerHTML = vForm();
  else if (vista.tipo === 'detalle') {
    if (!equipoDe(db, vista.id)) return ir({ tipo: 'inventario' });
    main.innerHTML = vDetalle();
  }
}

function vInventario() {
  const cats = CATEGORIAS.map((c) => `<option${c === filtros.categoria ? ' selected' : ''}>${esc(c)}</option>`).join('');
  const ests = Object.keys(ESTADOS).map((k) => `<option value="${k}"${k === filtros.estado ? ' selected' : ''}>${ESTADOS[k]}</option>`).join('');
  return `<div class="titulo"><h1>Inventario de equipos</h1>
    <p class="subtitulo">${db.equipos.length} modelos · ${db.unidades.length} unidades registradas en el Almacén H-102</p>
    <a class="boton" href="#" data-accion="nuevo">Nuevo equipo</a></div>
    <div class="filtros"><select data-filtro="categoria"><option value="">Categoría: todas</option>${cats}</select><select data-filtro="estado"><option value="">Estado: todos</option>${ests}</select><input type="search" data-filtro="codigo" value="${esc(filtros.codigo)}" placeholder="⌕ Código de inventario"></div>
    <div id="zona-tabla"></div>`;
}

function renderTabla() {
  const lista = filtrar(db, filtros), por = 8;
  const total = Math.max(1, Math.ceil(lista.length / por));
  pagina = Math.min(pagina, total);
  const vis = lista.slice((pagina - 1) * por, pagina * por);
  const filas = vis.map((e) => `<tr><td>${foto(e)}</td><td class="equipo">${esc(e.nombre)}</td><td class="gris">${esc(e.marca)} · ${esc(e.modelo)}</td><td class="gris">${esc(e.categoria)}</td><td class="unidades">${textoResumen(resumen(db, e.id))}</td>
    <td class="acciones"><a href="#" data-accion="detalle" data-id="${e.id}" data-tab="unidades">Unidades</a><span class="punto">·</span><a href="#" data-accion="detalle" data-id="${e.id}" data-tab="condiciones">Condiciones</a><span class="punto">·</span><a href="#" data-accion="editar" data-id="${e.id}">Editar</a><span class="punto">·</span><a href="#" data-accion="eliminar-equipo" data-id="${e.id}">Eliminar</a></td></tr>`).join('');
  const vacio = `<tr><td colspan="6"><div class="estado-vacio"><strong>Ningún equipo coincide con estos filtros</strong><p>Prueba con otra categoría o registra el primer equipo.</p><a class="boton-sec" href="#" data-accion="limpiar">Limpiar filtros</a></div></td></tr>`;
  const desde = lista.length ? (pagina - 1) * por + 1 : 0;
  let pags = `<a href="#" data-accion="pag" data-n="${Math.max(1, pagina - 1)}">‹</a> `;
  for (let i = 1; i <= total; i++) pags += `<a href="#" class="${i === pagina ? 'actual' : ''}" data-accion="pag" data-n="${i}">${i}</a> `;
  pags += `<a href="#" data-accion="pag" data-n="${Math.min(total, pagina + 1)}">›</a>`;
  $('#zona-tabla').innerHTML = `<div class="tarjeta"><table><thead><tr><th class="c-foto">Foto</th><th class="c-equipo">Equipo</th><th class="c-marca">Marca y modelo</th><th class="c-categoria">Categoría</th><th class="c-unidades">Unidades por estado</th><th>Acciones</th></tr></thead>
    <tbody>${vis.length ? filas : vacio}</tbody></table>
    <div class="pie-tabla">Mostrando ${desde} a ${Math.min(pagina * por, lista.length)} de ${lista.length} equipos<div class="paginas">${pags}</div></div></div>`;
}

const formVacio = () => ({ id: null, datos: { nombre: '', categoria: '', marca: '', modelo: '', descripcion: '', accesorios: [], foto: '' }, errores: {}, ofrecerBorrador: !!db.borrador });
const formDe = (e) => ({ id: e.id, datos: { nombre: e.nombre, categoria: e.categoria, marca: e.marca, modelo: e.modelo, descripcion: e.descripcion, accesorios: e.accesorios.slice(), foto: e.foto }, errores: {}, ofrecerBorrador: false });

function leerForm() {
  const g = (id) => ($('#' + id) ? $('#' + id).value : '');
  Object.assign(form.datos, { nombre: g('f-nombre'), categoria: g('f-categoria'), marca: g('f-marca'), modelo: g('f-modelo'), descripcion: g('f-descripcion') });
}

function vForm() {
  const d = form.datos, er = form.errores, n = Object.keys(er).length, titulo = form.id ? 'Editar equipo' : 'Nuevo equipo';
  const cls = (k) => (er[k] ? ' class="error"' : '');
  const msg = (k) => (er[k] ? `<p class="mensaje-error">${esc(er[k])}</p>` : '');
  const cats = CATEGORIAS.map((c) => `<option${c === d.categoria ? ' selected' : ''}>${esc(c)}</option>`).join('');
  const acc = d.accesorios.map((a, i) => `<div class="accesorio">${esc(a)} <a href="#" data-accion="quitar-acc" data-i="${i}">Quitar</a></div>`).join('');
  return `<p class="migas"><a href="#" data-accion="inventario">Inventario</a> / ${titulo}</p>
    <div class="titulo"><h1>${titulo}</h1></div>
    ${form.ofrecerBorrador ? '<div class="aviso-borrador">Tienes un borrador guardado.<a href="#" data-accion="recuperar">Recuperar borrador</a><a href="#" data-accion="descartar-borrador">Descartar</a></div>' : ''}
    <div class="columnas"><div class="izquierda"><div class="caja">
      ${n ? `<p class="alerta">No se pudo guardar. Revisa ${n} campo${n > 1 ? 's' : ''} marcado${n > 1 ? 's' : ''}.</p>` : ''}
      <p class="seccion">Identificación</p>
      <div class="fila-campos"><div class="col-grande"><label for="f-nombre">Nombre del equipo</label><input type="text" id="f-nombre" value="${esc(d.nombre)}"${cls('nombre')}>${msg('nombre')}</div><div class="col-chica"><label for="f-categoria">Categoría</label><select id="f-categoria"${cls('categoria')}><option value=""></option>${cats}</select>${msg('categoria')}</div></div>
      <div class="fila-campos"><div class="col-mitad"><label for="f-marca">Marca</label><input type="text" id="f-marca" value="${esc(d.marca)}"${cls('marca')}>${msg('marca')}</div><div class="col-mitad segunda"><label for="f-modelo">Modelo</label><input class="${er.modelo ? 'error ' : ''}codigo" type="text" id="f-modelo" value="${esc(d.modelo)}">${msg('modelo')}</div></div>
      <p class="seccion">Descripción</p>
      <div class="campo"><textarea id="f-descripcion" maxlength="400"${cls('descripcion')}>${esc(d.descripcion)}</textarea><p class="ayuda"><span id="cont">${d.descripcion.length}</span>/400 caracteres. Se muestra en la ficha pública del catálogo.</p>${msg('descripcion')}</div>
      <p class="seccion">Accesorios incluidos</p>
      ${acc}
      <div class="agregar campo"><input type="text" id="acc-nuevo" placeholder="Nombre del accesorio"><a class="boton-sec" href="#" data-accion="agregar-acc">Agregar</a></div>
    </div></div>
    <div class="derecha-form"><div class="caja"><p class="seccion">Fotografías</p>
      ${d.foto ? `<img class="vista-foto" src="${esc(d.foto)}" alt="Fotografía principal">` : ''}
      <input type="file" id="f-foto" accept="image/png,image/jpeg"><p class="ayuda">JPG o PNG · encuadre cuadrado · máximo 300 KB.</p></div>
      <div class="botones"><a class="cancelar" href="#" data-accion="inventario">Cancelar</a><button class="sec" type="button" data-accion="borrador">Guardar borrador</button><button class="principal" type="button" data-accion="guardar-equipo">Guardar equipo</button></div>
    </div></div>`;
}

function vDetalle() {
  const e = equipoDe(db, vista.id), us = unidadesDe(db, e.id), tab = vista.tab || 'unidades';
  const tabs = [['unidades', 'Unidades'], ['condiciones', 'Condiciones del préstamo'], ['historial', 'Historial']]
    .map(([k, t]) => `<a href="#" class="${tab === k ? 'activa' : ''}" data-accion="tab" data-tab="${k}">${t}</a>`).join('');
  const cuerpo = tab === 'unidades' ? tUnidades(us) : tab === 'condiciones' ? tCondiciones(e) : tHistorial(e);
  return `<p class="migas"><a href="#" data-accion="inventario">Inventario</a> / ${esc(e.categoria)} / ${esc(e.nombre)}</p>
    <div class="ficha"><div class="ficha-foto"><img src="${esc(urlFoto(e))}" alt="${esc(e.nombre)}" onerror="this.onerror=null;this.src='/imagenes/analisador.webp'"></div>
      <div class="ficha-texto"><h1>${esc(e.nombre)}</h1><p class="subtitulo">${esc(e.marca)} · ${esc(e.modelo)} · ${us.length} unidades registradas · Almacén H-102</p></div>
      <div class="ficha-botones"><a class="boton-sec" href="#" data-accion="editar" data-id="${e.id}">Editar equipo</a><a class="boton-pri" href="#" data-accion="nueva-unidad">Nueva unidad</a></div></div>
    <div class="pestanas">${tabs}</div>${cuerpo}`;
}

function tUnidades(us) {
  if (!us.length) return '<div class="tarjeta"><div class="estado-vacio"><strong>Este equipo aún no tiene unidades</strong><p>Registra al menos una unidad con su código de inventario para que aparezca en el catálogo.</p><a class="boton-pri" href="#" data-accion="nueva-unidad">Nueva unidad</a></div></div>';
  const filas = us.map((u) => `<tr><td class="codigo-u">${esc(u.codigo)}</td><td class="gris">${esc(u.ubicacion)}</td><td>${etiqueta(u.estado)}</td><td class="gris">${esc(u.observaciones || '—')}</td><td class="codigo-u">${esc(u.prestamo || '—')}</td>
    <td class="acciones"><a href="#" data-accion="estado" data-codigo="${esc(u.codigo)}">Cambiar estado</a><span class="punto">·</span><a href="#" data-accion="eliminar-unidad" data-codigo="${esc(u.codigo)}">Eliminar</a></td></tr>`).join('');
  return `<div class="tarjeta tabla-u"><table><thead><tr><th>Código</th><th>Ubicación</th><th>Estado</th><th>Observaciones</th><th>Préstamo vigente</th><th>Acciones</th></tr></thead><tbody>${filas}</tbody></table></div>`;
}

function previa(c) {
  const dias = isNaN(c.dias) ? '…' : c.dias, pen = isNaN(c.penalidad) ? '…' : c.penalidad.toFixed(2);
  return `<p><strong>Condiciones de este equipo</strong></p><p>Préstamo de hasta <strong>${dias} días calendario</strong>. ${c.autorizacion ? 'Requiere la autorización del docente del curso asociado.' : 'No requiere autorización adicional.'} ${c.renovacion ? 'Admite renovación.' : '<strong>No admite renovación.</strong>'} El retraso genera una penalidad de <span class="mono">S/ ${pen}</span> por día.</p>`;
}

function tCondiciones(e) {
  const c = e.condiciones, sw = (k, t) => `<div class="fila-interruptor"><button type="button" class="interruptor${c[k] ? ' encendido' : ''}" data-int="${k}"><span></span></button>${t}</div>`;
  return `<div class="caja caja-cond"><h2 class="titulo-panel">Condiciones del préstamo</h2>
    <label for="c-dias">Duración máxima</label><div class="campo"><input class="entrada-dias" type="number" id="c-dias" min="1" max="60" value="${c.dias}"><span class="texto-dias">días calendario</span><p class="mensaje-error" id="err-dias"></p></div>
    ${sw('autorizacion', 'Requiere autorización del docente')}${sw('renovacion', 'Admite renovación')}
    <label for="c-pen">Penalidad por día</label><div class="con-prefijo campo"><span>S/</span><input class="codigo" type="number" id="c-pen" min="0" step="0.5" value="${Number(c.penalidad).toFixed(2)}"></div><p class="mensaje-error" id="err-pen"></p>
    <p class="etiqueta-mono">Vista previa para el estudiante</p><div class="vista-previa" id="prev">${previa(c)}</div>
    <div class="botones"><button class="sec" type="button" data-accion="descartar-cond">Descartar</button><button class="principal" type="button" data-accion="guardar-cond">Guardar condiciones</button></div></div>`;
}

function leerCond() {
  return { dias: parseInt($('#c-dias').value, 10), autorizacion: $('[data-int=autorizacion]').classList.contains('encendido'), renovacion: $('[data-int=renovacion]').classList.contains('encendido'), penalidad: parseFloat($('#c-pen').value) };
}

function tHistorial(e) {
  const hs = db.historial.filter((h) => h.equipoId === e.id);
  if (!hs.length) return '<div class="tarjeta"><div class="estado-vacio"><strong>Aún no hay movimientos</strong><p>Los cambios en las unidades y condiciones de este equipo aparecerán aquí.</p></div></div>';
  const filas = hs.map((h) => `<tr><td class="codigo-u">${esc(h.fecha)}</td><td class="codigo-u">${esc(h.codigo)}</td><td>${esc(h.accion)}</td><td class="gris">${esc(h.anterior)}</td><td class="gris">${esc(h.nuevo)}</td><td class="gris">${esc(h.obs)}</td></tr>`).join('');
  return `<div class="tarjeta tabla-u"><table><thead><tr><th>Fecha</th><th>Código</th><th>Acción</th><th>Estado anterior</th><th>Estado nuevo</th><th>Observaciones</th></tr></thead><tbody>${filas}</tbody></table></div>`;
}

function abrirModal(html) { $('#modal').innerHTML = `<div class="overlay"><div class="modal">${html}</div></div>`; }
function cerrarModal() { $('#modal').innerHTML = ''; }
function confirmar(texto, boton, fn) {
  pendiente = fn;
  abrirModal(`<h2>Confirmar acción</h2><p>${esc(texto)}</p><div class="botones"><button class="sec" type="button" data-accion="cerrar">Cancelar</button><button class="btn-peligro" type="button" data-accion="confirmado">${boton}</button></div>`);
}

function modalUnidad(v = {}, er = {}) {
  const err = (k) => (er[k] ? `<p class="mensaje-error">${esc(er[k])}</p>` : '');
  abrirModal(`<h2>Nueva unidad</h2>
    <div class="campo"><label for="m-codigo">Código de inventario</label><input id="m-codigo" class="${er.codigo ? 'error' : ''}" value="${esc(v.codigo || '')}" placeholder="INV-OSC-0047">${err('codigo')}</div>
    <div class="campo"><label for="m-ubic">Ubicación</label><input id="m-ubic" class="${er.ubicacion ? 'error' : ''}" value="${esc(v.ubicacion || 'Almacén H-102')}">${err('ubicacion')}</div>
    <div class="campo"><label for="m-estado">Estado inicial</label><select id="m-estado"><option value="disponible">Disponible</option><option value="mant"${v.estado === 'mant' ? ' selected' : ''}>Mantenimiento</option></select></div>
    <div class="campo"><label for="m-obs">Observaciones</label><textarea id="m-obs">${esc(v.observaciones || '')}</textarea></div>
    <div class="botones"><button class="sec" type="button" data-accion="cerrar">Cancelar</button><button class="principal" type="button" data-accion="guardar-unidad">Registrar unidad</button></div>`);
}

function modalEstado(codigo) {
  const u = db.unidades.find((x) => x.codigo === codigo), bloqueo = motivoBloqueo(u);
  if (bloqueo) return abrirModal(`<h2>Cambiar estado</h2><p class="alerta">${esc(bloqueo)}</p><div class="botones"><button class="principal" type="button" data-accion="cerrar">Entendido</button></div>`);
  const opts = TRANSICIONES[u.estado].map((k) => `<option value="${k}">${ESTADOS[k]}</option>`).join('');
  abrirModal(`<h2>Cambiar estado</h2><p class="ficha-dato"><span>Unidad</span><strong class="mono">${esc(codigo)}</strong></p><p class="ficha-dato"><span>Estado actual</span>${etiqueta(u.estado)}</p>
    <div class="campo"><label for="m-nuevo">Nuevo estado</label><select id="m-nuevo">${opts}</select></div>
    <div class="campo"><label for="m-obs">Observaciones</label><textarea id="m-obs"></textarea></div>
    <div class="botones"><button class="sec" type="button" data-accion="cerrar">Cancelar</button><button class="principal" type="button" data-accion="aplicar-estado" data-codigo="${esc(codigo)}">Cambiar estado</button></div>`);
}

function modalFicha(codigo) {
  const u = db.unidades.find((x) => x.codigo === codigo), e = equipoDe(db, u.equipoId);
  const f = (t, v) => `<p class="ficha-dato"><span>${t}</span>${v}</p>`;
  abrirModal(`<h2 class="mono">${esc(u.codigo)}</h2>${f('Equipo', esc(e.nombre))}${f('Marca y modelo', esc(e.marca) + ' · ' + esc(e.modelo))}${f('Categoría', esc(e.categoria))}${f('Ubicación', esc(u.ubicacion))}${f('Estado', etiqueta(u.estado))}${f('Observaciones', esc(u.observaciones || '—'))}${f('Préstamo vigente', esc(u.prestamo || '—'))}
    <div class="botones"><button class="sec" type="button" data-accion="cerrar">Cerrar</button><button class="principal" type="button" data-accion="detalle" data-id="${e.id}" data-tab="unidades">Ver detalle del equipo</button></div>`);
}

function aplicarEstado(codigo, nuevo, obs) {
  cambiarEstado(db, codigo, nuevo, obs);
  guardarDb(); cerrarModal(); render();
  aviso('Estado actualizado: ' + codigo + ' ahora está en «' + ESTADOS[nuevo] + '».');
}

function mostrarSugerencias(texto) {
  const box = $('#sugerencias'), q = texto.trim();
  if (!q) { box.hidden = true; return; }
  const r = buscarUnidades(db, q).slice(0, 6);
  box.innerHTML = r.length
    ? r.map(({ u, e }) => `<a href="#" data-accion="ficha" data-codigo="${esc(u.codigo)}"><span class="mono">${esc(u.codigo)}</span> · ${esc(e.nombre)} · ${ESTADOS[u.estado]}</a>`).join('')
    : `<p>No se encontró ninguna unidad con el código «${esc(q)}».</p>`;
  box.hidden = false;
}

document.addEventListener('click', (ev) => {
  const t = ev.target;
  if (t.classList.contains('overlay')) return cerrarModal();
  if (!t.closest('.buscador')) $('#sugerencias').hidden = true;
  
  const sw = t.closest('[data-int]');
  if (sw) { sw.classList.toggle('encendido'); $('#prev').innerHTML = previa(leerCond()); return; }
  const el = t.closest('[data-accion]');
  if (!el) return;
  ev.preventDefault();
  const d = el.dataset;
  switch (d.accion) {
    case 'inventario': ir({ tipo: 'inventario' }); break;
    case 'nuevo': form = formVacio(); ir({ tipo: 'form' }); break;
    case 'editar': form = formDe(equipoDe(db, d.id)); ir({ tipo: 'form' }); break;
    case 'detalle': ir({ tipo: 'detalle', id: d.id, tab: d.tab || 'unidades' }); break;
    case 'tab': vista.tab = d.tab; render(); break;
    case 'limpiar': filtros = { categoria: '', estado: '', codigo: '' }; pagina = 1; render(); break;
    case 'pag': pagina = Number(d.n); renderTabla(); break;
    case 'cerrar': cerrarModal(); break;
    case 'confirmado': if (pendiente) pendiente(); pendiente = null; break;
    case 'eliminar-equipo': {
      const e = equipoDe(db, d.id);
      confirmar('¿Eliminar el equipo «' + e.nombre + '» y todas sus unidades? Esta acción no se puede deshacer.', 'Eliminar equipo', () => {
        const m = eliminarEquipo(db, e.id);
        if (m) { cerrarModal(); return aviso(m, 'error'); }
        guardarDb(); cerrarModal(); render(); aviso('Equipo eliminado.');
      });
      break;
    }
    case 'eliminar-unidad':
      confirmar('¿Eliminar la unidad ' + d.codigo + '? Esta acción no se puede deshacer.', 'Eliminar unidad', () => {
        const m = eliminarUnidad(db, d.codigo);
        if (m) { cerrarModal(); return aviso(m, 'error'); }
        guardarDb(); cerrarModal(); render(); aviso('Unidad eliminada.');
      });
      break;
    case 'agregar-acc': {
      leerForm();
      const v = $('#acc-nuevo').value.trim();
      if (v) form.datos.accesorios.push(v);
      render();
      break;
    }
    case 'quitar-acc': leerForm(); form.datos.accesorios.splice(Number(d.i), 1); render(); break;
    case 'recuperar':
      form.id = db.borrador.id; form.datos = JSON.parse(JSON.stringify(db.borrador.datos)); form.ofrecerBorrador = false; render(); break;
    case 'descartar-borrador': db.borrador = null; guardarDb(); form.ofrecerBorrador = false; render(); break;
    case 'borrador':
      leerForm(); db.borrador = { id: form.id, datos: JSON.parse(JSON.stringify(form.datos)) }; guardarDb();
      ir({ tipo: 'inventario' }); aviso('Borrador guardado. Podrás recuperarlo al abrir «Nuevo equipo».');
      break;
    case 'guardar-equipo': {
      leerForm();
      form.errores = validarEquipo(db, form.datos, form.id);
      if (Object.keys(form.errores).length) { render(); break; }
      guardarEquipo(db, form.datos, form.id);
      if (!form.id) db.borrador = null;
      guardarDb(); ir({ tipo: 'inventario' }); aviso('Equipo guardado correctamente.');
      break;
    }
    case 'nueva-unidad': modalUnidad(); break;
    case 'guardar-unidad': {
      const v = { codigo: $('#m-codigo').value, ubicacion: $('#m-ubic').value, estado: $('#m-estado').value, observaciones: $('#m-obs').value };
      const er = validarUnidad(db, v);
      if (Object.keys(er).length) return modalUnidad(v, er);
      agregarUnidad(db, vista.id, v); guardarDb(); cerrarModal(); render();
      aviso('Unidad ' + v.codigo.trim().toUpperCase() + ' registrada.');
      break;
    }
    case 'estado': modalEstado(d.codigo); break;
    case 'aplicar-estado': {
      const nuevo = $('#m-nuevo').value, obs = $('#m-obs').value.trim();
      if (nuevo === 'baja') confirmar('Dar de baja la unidad ' + d.codigo + ' es definitivo: no podrá volver a usarse. ¿Continuar?', 'Dar de baja', () => aplicarEstado(d.codigo, nuevo, obs));
      else aplicarEstado(d.codigo, nuevo, obs);
      break;
    }
    case 'ficha': $('#sugerencias').hidden = true; modalFicha(d.codigo); break;
    case 'guardar-cond': {
      const c = leerCond(), er = validarCondiciones(c);
      $('#err-dias').textContent = er.dias || ''; $('#err-pen').textContent = er.penalidad || '';
      if (Object.keys(er).length) break;
      guardarCondiciones(db, vista.id, c); guardarDb(); ir({ tipo: 'inventario' }); aviso('Condiciones del préstamo guardadas.');
      break;
    }
    case 'descartar-cond': render(); break;
  }
});

document.addEventListener('input', (ev) => {
  const t = ev.target;
  if (t.dataset.filtro) { filtros[t.dataset.filtro] = t.value; pagina = 1; renderTabla(); }
  else if (t.id === 'f-descripcion') $('#cont').textContent = t.value.length;
  else if (t.id === 'c-dias' || t.id === 'c-pen') $('#prev').innerHTML = previa(leerCond());
  else if (t.id === 'q-general') mostrarSugerencias(t.value);
});

document.addEventListener('change', (ev) => {
  if (ev.target.id !== 'f-foto' || !ev.target.files[0]) return;
  const f = ev.target.files[0];
  if (f.size > 300 * 1024) { ev.target.value = ''; return aviso('La imagen supera los 300 KB. Elige una más liviana.', 'error'); }
  const r = new FileReader();
  r.onload = () => { leerForm(); form.datos.foto = r.result; render(); };
  r.readAsDataURL(f);
});

$('#busqueda-general').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const r = buscarUnidades(db, $('#q-general').value);
  if (r.length === 1) { $('#sugerencias').hidden = true; modalFicha(r[0].u.codigo); }
  else if (!r.length) aviso('No se encontró ninguna unidad con ese código.', 'error');
});

$('#restaurar').addEventListener('click', () => confirmar('Se borrarán los cambios guardados y se cargarán los datos de demostración. ¿Continuar?', 'Restaurar', () => {
  db = Almacen.restaurar(); form = null; filtros = { categoria: '', estado: '', codigo: '' }; pagina = 1;
  ir({ tipo: 'inventario' }); aviso('Datos restaurados.');
}));

document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') cerrarModal(); });

render();