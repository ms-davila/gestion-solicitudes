// Elementos de la página de usuarios
const mensaje = document.getElementById('mensaje');
const btnPago = document.getElementById('btn-pago');
const btnBloquear = document.getElementById('btn-bloquear');
const estadoCuenta = document.getElementById('estado-cuenta');
const penalidad0291 = document.getElementById('penalidad-0291');

// Muestra mensajes en la parte superior
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'alerta alerta-' + tipo;
  window.scrollTo(0, 0);
}

// Acción para registrar el pago de la penalidad
btnPago.addEventListener('click', () => {
  penalidad0291.textContent = 'S/ 45.00 pagada';
  penalidad0291.className = 'codigo texto-gris';
  mostrarMensaje('Pago registrado correctamente.', 'verde');
});

// Acción para bloquear la cuenta del estudiante
btnBloquear.addEventListener('click', () => {
  estadoCuenta.textContent = 'Bloqueada';
  mostrarMensaje('Cuenta bloqueada con éxito.', 'verde');
});