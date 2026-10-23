const CATEGORIAS = ['Medición', 'Audiovisual', 'Robótica', 'Cómputo', 'Redes', 'Lab. de física'];
const ESTADOS = { disponible: 'Disponible', prestada: 'Prestada', mant: 'Mantenimiento', baja: 'Dada de baja' };
const COND_BASE = { dias: 7, autorizacion: true, renovacion: false, penalidad: 15 };


const MODELOS_DEMO = [
  ['Osciloscopio TBS1052B', 'Tektronix', 'TBS1052B', 'Medición', 'OSC', 42, 'ddpmd', 'Osciloscopio digital de 2 canales y 50 MHz con pantalla a color.', ['2 sondas de medición', 'Cable USB', 'Estuche rígido']],
  ['Cámara Canon EOS 90D', 'Canon', 'EOS 90D', 'Audiovisual', 'CAM', 9, 'ddpp', 'Cámara réflex digital de 32.5 MP con grabación 4K.', ['Estuche rígido', 'Cargador', 'Batería de repuesto'], { dias: 5, autorizacion: false, renovacion: true, penalidad: 20 }],
  ['Kit de robótica Arduino Mega', 'Arduino', 'Mega 2560', 'Robótica', 'ARD', 13, 'dddddd', 'Kit con placa Mega 2560, sensores y cables.', ['Placa Mega 2560', 'Cable USB']],
  ['Tableta gráfica Wacom Intuos', 'Wacom', 'CTL-4100', 'Cómputo', 'TAB', 3, 'dpp', 'Tableta gráfica para dibujo digital.', ['Lápiz digital', 'Cable USB', 'Estuche']],
  ['Multímetro Fluke 117', 'Fluke', '117', 'Medición', 'MUL', 20, 'ppm', 'Multímetro digital de verdadero valor eficaz.', ['Puntas de prueba', 'Estuche']],
  ['Analizador de redes portátil', 'NetAlly', 'LinkRunner', 'Redes', 'RED', 1, 'ddb', 'Verificador de cableado y enlaces Ethernet.', ['Estuche rígido', 'Cargador']],
  ['Trípode profesional Manfrotto', 'Manfrotto', 'MT055', 'Audiovisual', 'TRI', 6, 'ddddp', 'Trípode profesional de aluminio.', ['Bolsa de transporte']],
  ['Fuente de poder regulable', 'Korad', 'KA3005P', 'Lab. de física', 'FUE', 31, 'dddm', 'Fuente de poder regulable de 30 V y 5 A.', ['Cables de salida']],
];

function crearDemo() {
  const db = { equipos: [], unidades: [], historial: [], borrador: null };
  const mapa = { d: 'disponible', p: 'prestada', m: 'mant', b: 'baja' };
  MODELOS_DEMO.forEach(([nombre, marca, modelo, categoria, pre, ini, seq, descripcion, accesorios, cond], i) => {
    const id = 'eq' + (i + 1);
    db.equipos.push({ id, nombre, marca, modelo, categoria, descripcion, accesorios, foto: '', condiciones: Object.assign({}, COND_BASE, cond) });
    seq.split('').forEach((c, k) => {
      const estado = mapa[c];
      db.unidades.push({
        codigo: 'INV-' + pre + '-' + String(ini + k).padStart(4, '0'),
        equipoId: id,
        ubicacion: k % 2 ? 'Almacén H-102 · anaquel 3' : 'Almacén H-102',
        estado,
        observaciones: estado === 'mant' ? 'En revisión técnica' : '',
        prestamo: estado === 'prestada' ? 'PRE-2026-0' + (300 + db.unidades.length) : '',
      });
    });
  });
  return db;
}
