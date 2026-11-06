// Uso: node scripts/editar.mjs <video> <cortes.json> <palabras-corregidas.json> "<texto del hook>" [cta]
// Arma el video en Remotion con estilo.md y exporta exportados/<nombre>-editado.mp4 (1080x1920, 30 fps).
// palabras-corregidas.json: mismas palabras que la transcripción (tiempos del ORIGINAL), con ortografía corregida
// y "clave": true en las palabras a resaltar.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [video, cortesJson, palabrasJson, hook, cta] = process.argv.slice(2);
if (!hook) throw new Error("Uso: editar.mjs <video> <cortes.json> <palabras.json> <hook> [cta]");
const proyecto = path.resolve(import.meta.dirname, "..");
const raiz = path.resolve(proyecto, "..");
const { cortes } = JSON.parse(fs.readFileSync(cortesJson, "utf8"));
const palabras = JSON.parse(fs.readFileSync(palabrasJson, "utf8"));

// Reubica cada palabra en la línea de tiempo editada.
let acc = 0;
const remap = [];
for (const c of cortes) {
  for (const p of palabras) if (p.inicio >= c.inicio - 0.01 && p.inicio < c.fin) remap.push({ ...p, inicio: acc + (p.inicio - c.inicio), fin: acc + (Math.min(p.fin, c.fin) - c.inicio) });
  acc += c.fin - c.inicio;
}

// Copia el video a public/entrada (Remotion solo lee de public/).
const nombre = path.parse(video).name;
fs.mkdirSync(path.join(proyecto, "public/entrada"), { recursive: true });
const ext = path.extname(video);
fs.copyFileSync(video, path.join(proyecto, "public/entrada", `${nombre}${ext}`));

// Música: la primera de musica/ (si hay).
const temas = fs.readdirSync(path.join(raiz, "musica")).filter((f) => /\.(mp3|wav|m4a|aac|ogg)$/i.test(f));
let musica = null;
if (temas.length) {
  fs.mkdirSync(path.join(proyecto, "public/musica"), { recursive: true });
  fs.copyFileSync(path.join(raiz, "musica", temas[0]), path.join(proyecto, "public/musica", temas[0]));
  musica = `musica/${temas[0]}`;
}

const props = { fuente: `entrada/${nombre}${ext}`, cortes, palabras: remap, hook, cta, musica };
const propsPath = path.join(proyecto, "trabajo", `${nombre}-props.json`);
fs.mkdirSync(path.dirname(propsPath), { recursive: true });
fs.writeFileSync(propsPath, JSON.stringify(props, null, 1));
const out = path.join(raiz, "exportados", `${nombre}-editado.mp4`);
execFileSync("npx", ["remotion", "render", "VideoEditado", out, `--props=${propsPath}`, "--log=error"], { cwd: proyecto, stdio: "inherit" });
console.log(`Listo: ${out} (${acc.toFixed(1)} s + cierre) ${musica ? `con música ${temas[0]}` : "sin música"}`);
