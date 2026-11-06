// Uso: node scripts/proponer-cortes.mjs <palabras.json> [salida=trabajo/cortes.json] [silencioMax=0.4]
// Propone qué partes QUEDAN: saca silencios > silencioMax y muletillas obvias.
// Las frases repetidas/equivocadas las marca Claude a mano antes de mostrar la lista.
import fs from "node:fs";

const [entrada, salida = "trabajo/cortes.json", sMax = "0.4"] = process.argv.slice(2);
const silencioMax = Number(sMax);
const MARGEN = 0.08; // aire antes/después de cada palabra
const MULETILLAS = new Set(["eh", "ehh", "em", "emm", "mm", "mmm", "este", "ah", "ahh"]);
const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ ]/g, "").trim();

const palabras = JSON.parse(fs.readFileSync(entrada, "utf8"));
const quitadas = [];
const cortes = [];
let romper = false; // después de una muletilla se fuerza un corte
for (const p of palabras) {
  if (MULETILLAS.has(norm(p.texto))) {
    quitadas.push({ motivo: "muletilla", texto: p.texto, inicio: p.inicio, fin: p.fin });
    const ult = cortes[cortes.length - 1];
    if (ult) ult.fin = Math.min(ult.fin, p.inicio);
    romper = true;
    continue;
  }
  const ult = cortes[cortes.length - 1];
  const ini = Math.max(ult && romper ? Math.max(ult.fin, 0) : 0, p.inicio - MARGEN);
  const fin = p.fin + MARGEN;
  if (ult && !romper && ini - ult.fin <= silencioMax) ult.fin = Math.max(ult.fin, fin);
  else {
    if (ult && !romper) quitadas.push({ motivo: "silencio", inicio: ult.fin, fin: ini, duracion: +(ini - ult.fin).toFixed(2) });
    cortes.push({ inicio: ini, fin });
  }
  romper = false;
}
quitadas.sort((a, b) => a.inicio - b.inicio);
const r = (n) => +n.toFixed(3);
const total = cortes.reduce((a, c) => a + c.fin - c.inicio, 0);
fs.writeFileSync(salida, JSON.stringify({ cortes: cortes.map((c) => ({ inicio: r(c.inicio), fin: r(c.fin) })), quitadas }, null, 1));
console.log(`Quedan ${cortes.length} tramos, ${total.toFixed(1)} s. Quitado:`);
for (const q of quitadas) console.log(`- ${q.inicio.toFixed(2)}–${q.fin.toFixed(2)} s  ${q.motivo}${q.texto ? ` ("${q.texto}")` : ""}`);
