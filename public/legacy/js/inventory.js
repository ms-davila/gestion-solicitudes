const norm = (t) => String(t == null ? '' : t).trim().toLowerCase();
const unidadesDe = (db, id) => db.unidades.filter((u) => u.equipoId === id);
const equipoDe = (db, id) => db.equipos.find((e) => e.id === id);

function resumen(db, id) {
  const r = { disponible: 0, prestada: 0, mant: 0, baja: 0 };
  unidadesDe(db, id).forEach((u) => r[u.estado]++);
  return r;
}

function filtrar(db, f) {
  const cod = norm(f.codigo);
  return db.equipos.filter((e) => {
    const us = unidadesDe(db, e.id);
    return (!f.categoria || e.categoria === f.categoria)
      && (!f.estado || us.some((u) => u.estado === f.estado))
      && (!cod || us.some((u) => norm(u.codigo).includes(cod)));
  });
}

function buscarUnidades(db, texto) {
  const q = norm(texto);
  if (!q) return [];
  return db.unidades.filter((u) => norm(u.codigo).includes(q)).map((u) => ({ u, e: equipoDe(db, u.equipoId) }));
}

function registrar(db, equipoId, codigo, accion, anterior, nuevo, obs) {
  db.historial.unshift({ fecha: new Date().toLocaleString('es-PE'), equipoId, codigo: codigo || '—', accion, anterior: anterior || '—', nuevo: nuevo || '—', obs: obs || '' });
}

function validarEquipo(db, d, idActual) {
  const er = {};
  if (!d.nombre.trim()) er.nombre = 'El nombre es obligatorio.';
  if (!d.categoria) er.categoria = 'Selecciona una categoría.';
  if (!d.marca.trim()) er.marca = 'La marca es obligatoria.';
  if (!d.modelo.trim()) er.modelo = 'El modelo es obligatorio.';
  if (d.descripcion.length > 400) er.descripcion = 'La descripción admite máximo 400 caracteres.';
  const repetido = db.equipos.some((e) => e.id !== idActual && norm(e.marca) === norm(d.marca) && norm(e.modelo) === norm(d.modelo));
  if (!er.marca && !er.modelo && repetido) er.modelo = 'Ya existe un equipo con esta marca y modelo.';
  return er;
}

function guardarEquipo(db, d, idActual) {
  const datos = { nombre: d.nombre.trim(), categoria: d.categoria, marca: d.marca.trim(), modelo: d.modelo.trim(), descripcion: d.descripcion.trim(), accesorios: d.accesorios.slice(), foto: d.foto };
  if (idActual) {
    Object.assign(equipoDe(db, idActual), datos);
    registrar(db, idActual, '', 'Edición de equipo', '', '', datos.nombre);
    return idActual;
  }
  const id = 'eq' + Date.now();
  db.equipos.push(Object.assign({ id, condiciones: Object.assign({}, COND_BASE) }, datos));
  registrar(db, id, '', 'Creación de equipo', '', '', datos.nombre);
  return id;
}

function validarUnidad(db, d) {
  const er = {};
  const codigo = d.codigo.trim().toUpperCase();
  if (!codigo) er.codigo = 'El código es obligatorio.';
  else if (db.unidades.some((u) => u.codigo === codigo)) er.codigo = 'Ya existe una unidad con este código.';
  if (!d.ubicacion.trim()) er.ubicacion = 'La ubicación es obligatoria.';
  return er;
}

function agregarUnidad(db, equipoId, d) {
  const u = { codigo: d.codigo.trim().toUpperCase(), equipoId, ubicacion: d.ubicacion.trim(), estado: d.estado, observaciones: d.observaciones.trim(), prestamo: '' };
  db.unidades.push(u);
  registrar(db, equipoId, u.codigo, 'Registro de unidad', '', ESTADOS[u.estado], u.observaciones);
}

const TRANSICIONES = { disponible: ['mant', 'baja'], mant: ['disponible', 'baja'], prestada: [], baja: [] };
function motivoBloqueo(u) {
  if (u.estado === 'prestada') return 'Esta unidad está prestada: registra primero la devolución (módulo de devoluciones).';
  if (u.estado === 'baja') return 'Una unidad dada de baja no puede volver a usarse.';
  return '';
}

function cambiarEstado(db, codigo, nuevo, obs) {
  const u = db.unidades.find((x) => x.codigo === codigo);
  const anterior = u.estado;
  u.estado = nuevo;
  if (obs) u.observaciones = obs;
  registrar(db, u.equipoId, codigo, 'Cambio de estado', ESTADOS[anterior], ESTADOS[nuevo], obs);
}

function eliminarUnidad(db, codigo) {
  const u = db.unidades.find((x) => x.codigo === codigo);
  if (u.estado === 'prestada') return 'No se puede eliminar: la unidad tiene un préstamo vigente.';
  db.unidades = db.unidades.filter((x) => x.codigo !== codigo);
  registrar(db, u.equipoId, codigo, 'Eliminación de unidad', ESTADOS[u.estado], '', '');
  return '';
}

function eliminarEquipo(db, id) {
  if (unidadesDe(db, id).some((u) => u.estado === 'prestada')) return 'No se puede eliminar: el equipo tiene unidades prestadas.';
  const e = equipoDe(db, id);
  db.unidades = db.unidades.filter((u) => u.equipoId !== id);
  db.equipos = db.equipos.filter((x) => x.id !== id);
  registrar(db, id, '', 'Eliminación de equipo', '', '', e.nombre);
  return '';
}

function validarCondiciones(c) {
  const er = {};
  if (!Number.isInteger(c.dias) || c.dias < 1 || c.dias > 60) er.dias = 'Ingresa un número entero entre 1 y 60.';
  if (isNaN(c.penalidad) || c.penalidad < 0) er.penalidad = 'Ingresa un monto válido (0 o más).';
  return er;
}

function guardarCondiciones(db, id, c) {
  equipoDe(db, id).condiciones = c;
  registrar(db, id, '', 'Modificación de condiciones', '', '', c.dias + ' días · S/ ' + c.penalidad.toFixed(2));
}
