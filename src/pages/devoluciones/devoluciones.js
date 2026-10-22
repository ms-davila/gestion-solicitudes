// Penalidad por cada día de retraso en soles
const penalidadDia = 15;

// Milisegundos que tiene un día para calcular las fechas
const msDia = 86400000;

// Datos básicos del préstamo actual
const prestamo = {
  codigo: 'PRE-2026-0291',
  equipo: 'Tableta Wacom Intuos',
  estudiante: 'Camila Quispe',
  entrega: '07/09/2026',
  maxDias: 10,
  fechaMinima: '2026-09-12',
  fechaMaxima: '2026-09-17',
  fechaSugerida: '2026-09-14'
};

let estadoRetorno = 'faltantes';
let hayDanos = true;

// Selección de elementos del HTML
const mensaje = document.getElementById('mensaje');
const btnRenovarPrestamo = document.getElementById('btn-renovar-prestamo');
const inputCodigo = document.getElementById('codigo-prestamo');
const btnBuscar = document.getElementById('btn-buscar');
const fechaPactada = document.getElementById('fecha-pactada');
const retornoReal = document.getElementById('retorno-real');
const inputFechaRetorno = document.getElementById('fecha-retorno');
const alertaRetraso = document.getElementById('alerta-retraso');
const btnSin = document.getElementById('btn-sin');
const btnDanos = document.getElementById('btn-danos');
const btnFaltantes = document.getElementById('btn-faltantes');
const btnRegistrar = document.getElementById('btn-registrar');
const btnCancelar1 = document.getElementById('btn-cancelar-1');

const accLapiz = document.getElementById('acc-lapiz');
const accUsb = document.getElementById('acc-usb');
const accEstuche = document.getElementById('acc-estuche');

const tarjetaDanos = document.getElementById('tarjeta-danos');
const descripcionDano = document.getElementById('descripcion-dano');
const faltLapiz = document.getElementById('falt-lapiz');
const faltUsb = document.getElementById('falt-usb');
const faltEstuche = document.getElementById('falt-estuche');
const derivar = document.getElementById('derivar');
const alertaInventario = document.getElementById('alerta-inventario');
const btnCancelar2 = document.getElementById('btn-cancelar-2');
const btnGuardar = document.getElementById('btn-guardar');

const modalRenovar = document.getElementById('modal-renovar');
const modalCodigo = document.getElementById('modal-codigo');
const modalDetalle = document.getElementById('modal-detalle');
const bloqueFechas = document.getElementById('bloque-fechas');
const modalVencimiento = document.getElementById('modal-vencimiento');
const inputNuevaFecha = document.getElementById('nueva-fecha');
const modalAviso = document.getElementById('modal-aviso');
const botonesPosible = document.getElementById('botones-posible');
const botonesBloqueado = document.getElementById('botones-bloqueado');
const btnCancelarModal = document.getElementById('btn-cancelar-modal');
const btnRenovar = document.getElementById('btn-renovar');
const btnVerLista = document.getElementById('btn-ver-lista');
const botonesEstado = document.querySelectorAll('.opcion');

// Muestra una alerta arriba de la página con texto y tipo de color
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'alerta alerta-' + tipo;
  window.scrollTo(0, 0);
}

// Convierte un texto de fecha dd/mm/aaaa en un objeto de fecha
function convertirFecha(texto) {
  const partes = texto.split('/');
  return new Date(partes[2], partes[1] - 1, partes[0]);
}

// Calcula los días de retraso restando la fecha de retorno y la pactada
function calcularDiasRetraso(textoRetorno) {
  const pactada = convertirFecha(fechaPactada.textContent);
  const retorno = convertirFecha(textoRetorno);
  return Math.round((retorno - pactada) / msDia);
}

// Botón para buscar el código del préstamo
btnBuscar.addEventListener('click', () => {
  const codigo = inputCodigo.value.trim().toUpperCase();
  if (codigo === prestamo.codigo) {
    mostrarMensaje(`Préstamo ${codigo} encontrado: ${prestamo.estudiante} · ${prestamo.equipo}.`, 'verde');
  } else {
    mostrarMensaje(`No encontramos el préstamo ${codigo}.`, 'roja');
  }
});

// Sincroniza los checkboxes de accesorios con los faltantes
accLapiz.addEventListener('change', () => { faltLapiz.checked = !accLapiz.checked; });
accUsb.addEventListener('change', () => { faltUsb.checked = !accUsb.checked; });
accEstuche.addEventListener('change', () => { faltEstuche.checked = !accEstuche.checked; });

// Cambia el estado de retorno al hacer clic en los botones
btnSin.addEventListener('click', () => {
  botonesEstado.forEach(b => b.className = 'opcion');
  btnSin.classList.add('opcion-activa-verde');
  tarjetaDanos.classList.add('oculto');
  hayDanos = false;
  estadoRetorno = 'sin';
});

btnDanos.addEventListener('click', () => {
  botonesEstado.forEach(b => b.className = 'opcion');
  btnDanos.classList.add('opcion-activa-roja');
  tarjetaDanos.classList.remove('oculto');
  hayDanos = true;
  estadoRetorno = 'danos';
});

btnFaltantes.addEventListener('click', () => {
  botonesEstado.forEach(b => b.className = 'opcion');
  btnFaltantes.classList.add('opcion-activa-roja');
  tarjetaDanos.classList.remove('oculto');
  hayDanos = true;
  estadoRetorno = 'faltantes';
});

// Botón para registrar la devolución y calcular penalidades
btnRegistrar.addEventListener('click', () => {
  const textoRetorno = inputFechaRetorno.value.trim();
  
  if (textoRetorno.length !== 10) {
    mostrarMensaje('Escribe la fecha con formato dd/mm/aaaa.', 'roja');
    return;
  }
  
  retornoReal.textContent = textoRetorno;
  const dias = calcularDiasRetraso(textoRetorno);
  
  alertaRetraso.className = 'alerta';
  if (dias <= 0) {
    alertaRetraso.classList.add('alerta-verde');
    alertaRetraso.innerHTML = hayDanos 
      ? '<b>Devolución a tiempo · 0 días de retraso.</b> Sin penalidad. Completa el registro de daños.' 
      : '<b>Devolución a tiempo · 0 días de retraso.</b> Sin penalidad. Equipo disponible.';
  } else {
    const penalidad = dias * penalidadDia;
    alertaRetraso.classList.add('alerta-roja');
    alertaRetraso.innerHTML = `<b>${dias} días de retraso.</b> Penalidad: S/ ${penalidad}.00. Cuenta bloqueada.`;
  }
});

btnCancelar1.addEventListener('click', () => {
  mostrarMensaje('Operación cancelada.', 'amarilla');
});

// Muestra u oculta la alerta de inventario según el interruptor
derivar.addEventListener('change', () => {
  alertaInventario.classList.toggle('oculto');
});

// Botón para guardar daños o mantenimiento
btnGuardar.addEventListener('click', () => {
  const desc = descripcionDano.value.trim();
  if (desc.length < 10) {
    mostrarMensaje('Escribe una descripción de al menos 10 caracteres.', 'roja');
  } else if (derivar.checked) {
    mostrarMensaje('Devolución cerrada. Unidad pasó a mantenimiento.', 'verde');
  } else {
    mostrarMensaje('Devolución cerrada sin derivar a mantenimiento.', 'verde');
  }
});

btnCancelar2.addEventListener('click', () => {
  mostrarMensaje('Operación cancelada.', 'amarilla');
});

// Funciones para manejar el modal de renovación
function cerrarModal() {
  modalRenovar.classList.remove('abierto');
}

function revisarNuevaFecha() {
  const valor = inputNuevaFecha.value;
  if (!valor) {
    modalAviso.className = 'alerta alerta-amarilla alerta-borde';
    modalAviso.textContent = 'Elige la nueva fecha.';
    return false;
  }
  
  const partes = valor.split('-');
  const nueva = new Date(partes[0], partes[1] - 1, partes[2]);
  const vencimiento = convertirFecha(fechaPactada.textContent);
  
  if (nueva <= vencimiento) {
    modalAviso.className = 'alerta alerta-amarilla alerta-borde';
    modalAviso.textContent = 'La nueva fecha debe ser posterior al vencimiento.';
    return false;
  }
  
  modalAviso.className = 'alerta alerta-verde alerta-borde';
  modalAviso.textContent = 'Fecha válida para renovación.';
  return true;
}

btnRenovarPrestamo.addEventListener('click', () => {
  const dias = calcularDiasRetraso(inputFechaRetorno.value.trim());
  modalCodigo.textContent = prestamo.codigo;
  modalDetalle.textContent = `${prestamo.equipo} · ${prestamo.estudiante}`;

  if (dias <= 0 && !hayDanos && estadoRetorno === 'sin') {
    bloqueFechas.classList.remove('oculto');
    botonesPosible.classList.remove('oculto');
    botonesBloqueado.classList.add('oculto');
    modalVencimiento.value = fechaPactada.textContent;
    inputNuevaFecha.value = prestamo.fechaSugerida;
    revisarNuevaFecha();
  } else {
    bloqueFechas.classList.add('oculto');
    botonesPosible.classList.add('oculto');
    botonesBloqueado.classList.remove('oculto');
    modalAviso.className = 'alerta alerta-amarilla alerta-borde';
    modalAviso.textContent = 'No se puede renovar por retraso o daños.';
  }
  
  modalRenovar.classList.add('abierto');
});

inputNuevaFecha.addEventListener('input', revisarNuevaFecha);
btnCancelarModal.addEventListener('click', cerrarModal);

modalRenovar.addEventListener('click', (e) => {
  if (e.target === modalRenovar) cerrarModal();
});

btnRenovar.addEventListener('click', () => {
  if (revisarNuevaFecha()) {
    cerrarModal();
    mostrarMensaje('Préstamo renovado exitosamente.', 'verde');
  }
});

btnVerLista.addEventListener('click', () => {
  cerrarModal();
  mostrarMensaje('Abriendo lista de espera...', 'amarilla');
});