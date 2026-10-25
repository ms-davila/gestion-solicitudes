// Uso (desde la carpeta del proyecto, donde está package.json):
//   node aislar-css.mjs --revisar
//       -> lista los .css de src/ con reglas sueltas (nav {, header {, body {...)
//   node aislar-css.mjs "src/ruta/diseño.css" pagina-inventario
//       -> reescribe ese .css con todos sus selectores dentro de .pagina-inventario
//          (guarda una copia de respaldo: diseño.css.bak)
import fs from 'node:fs';
import path from 'node:path';

const SIN_PREFIJO = /^(\*|:root|html|body|#root|[a-z][a-z0-9-]*)(?![\w-])/i;

function listarCss(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') listarCss(p, out); }
    else if (e.name.endsWith('.css')) out.push(p);
  }
  return out;
}

// Recorre el CSS y llama a cb(selectorCrudo, lineaAprox) por cada regla normal.
function recorrer(css, cb) {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  let i = 0, profundidad = 0, inicio = 0;
  const pilaAt = [];
  while (i < limpio.length) {
    const c = limpio[i];
    if (c === '{') {
      const cab = limpio.slice(inicio, i).trim();
      const linea = limpio.slice(0, inicio).split('\n').length + (limpio.slice(inicio, i).match(/^\s*/)[0].split('\n').length - 1);
      if (cab.startsWith('@')) pilaAt.push(cab);
      else if (!pilaAt.some(a => /^@(keyframes|font-face)/.test(a))) cb(cab, linea, pilaAt.length);
      if (!cab.startsWith('@')) {
        // saltar el cuerpo de la regla
        let d = 1; i++;
        while (i < limpio.length && d) { if (limpio[i] === '{') d++; if (limpio[i] === '}') d--; i++; }
        inicio = i; continue;
      }
      profundidad++; inicio = i + 1;
    } else if (c === '}') { pilaAt.pop(); profundidad--; inicio = i + 1; }
    else if (c === ';' && profundidad >= 0 && pilaAt.length === 0) { inicio = i + 1; }
    i++;
  }
}

function revisar() {
  const archivos = listarCss('src');
  let hay = false;
  for (const f of archivos) {
    const css = fs.readFileSync(f, 'utf8');
    if (/&\s*[:.]|&\s*>/.test(css)) { console.log(`ℹ  ${f}: CSS anidado (plantilla de Vite). Si no lo usas, bórralo.\n`); continue; }
    const malos = [];
    recorrer(css, (sel, linea) => {
      for (const s of sel.split(',').map(x => x.trim()).filter(Boolean)) {
        if (!s.startsWith('.pagina-') && SIN_PREFIJO.test(s)) malos.push(`   línea ${linea}: ${s}`);
      }
    });
    if (malos.length) {
      hay = true;
      console.log(`⚠  ${f}  (${malos.length} reglas sueltas)`);
      console.log(malos.slice(0, 6).join('\n') + (malos.length > 6 ? '\n   ...' : '') + '\n');
    } else console.log(`✔  ${f}`);
  }
  if (hay) console.log('\nLos que tienen ⚠ afectan a TODAS las pantallas. Arréglalos con:\n  node aislar-css.mjs "<archivo>" <pagina-xxx>');
}

function aislar(archivo, scope) {
  if (!scope.startsWith('pagina-')) { console.error('El nombre debe empezar con "pagina-", ej: pagina-inventario'); process.exit(1); }
  let css = fs.readFileSync(archivo, 'utf8');
  if (css.includes(`Estilos aislados: solo afectan dentro de .${scope}`)) { console.log('Ese archivo ya estaba aislado. No hice nada.'); return; }
  fs.writeFileSync(archivo + '.bak', css);
  css = css.replace(/@import\s+url\([^)]*\)\s*;/g, '');
  const S = '.' + scope;
  const prefijar = sel => {
    const out = [];
    for (let s of sel.split(',').map(x => x.trim()).filter(Boolean)) {
      if (s === '#root') continue;
      const t = (s === ':root' || s === 'html' || s === 'body') ? S : `${S} ${s}`;
      if (!out.includes(t)) out.push(t);
    }
    return out;
  };
  const proc = txt => {
    const res = []; let i = 0;
    while (i < txt.length) {
      const resto = txt.slice(i);
      const esp = resto.match(/^\s*/)[0].length; i += esp;
      if (i >= txt.length) break;
      if (txt.startsWith('/*', i)) { const j = txt.indexOf('*/', i) + 2; res.push(txt.slice(i, j)); i = j; continue; }
      const j = txt.indexOf('{', i); if (j < 0) break;
      const cab = txt.slice(i, j).trim();
      let d = 1, k = j + 1;
      while (k < txt.length && d) { if (txt[k] === '{') d++; if (txt[k] === '}') d--; k++; }
      const cuerpo = txt.slice(j + 1, k - 1);
      if (cab.startsWith('@')) {
        if (/^@(keyframes|font-face)/.test(cab)) res.push(`${cab} {${cuerpo}}`);
        else res.push(`${cab} {\n${proc(cuerpo)}\n}`);
      } else {
        const sels = prefijar(cab);
        if (sels.length) res.push(`${sels.join(',\n')} {\n  ${cuerpo.trim().replace(/\n\s*/g, '\n  ')}\n}`);
      }
      i = k;
    }
    return res.join('\n\n');
  };
  fs.writeFileSync(archivo, `/* Estilos aislados: solo afectan dentro de .${scope} */\n` + proc(css) + '\n');
  console.log(`✔ Listo: ${archivo} ahora solo afecta dentro de .${scope}\n  (respaldo: ${archivo}.bak)`);
}

const [a, b] = process.argv.slice(2);
if (a === '--revisar') revisar();
else if (a && b) aislar(a, b);
else console.log('Uso:\n  node aislar-css.mjs --revisar\n  node aislar-css.mjs "src/ruta/archivo.css" pagina-xxx');
