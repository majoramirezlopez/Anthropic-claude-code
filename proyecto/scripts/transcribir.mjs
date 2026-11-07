// Uso: node scripts/transcribir.mjs <video> [salida.json] [modelo=base]
// Transcribe en español con whisper.cpp y guarda una lista de palabras con tiempos (segundos).
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [video, salida = "trabajo/palabras.json", modelo = "base"] = process.argv.slice(2);
if (!video) throw new Error("Falta el video");
const raiz = path.resolve(import.meta.dirname, "..");
const bin = path.join(raiz, "whisper.cpp/build/bin/whisper-cli");
const model = path.join(raiz, `whisper.cpp/ggml-${modelo}.bin`);
if (!fs.existsSync(model) || fs.statSync(model).size < 1e6) throw new Error(`Falta el modelo ${model}`);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "whisper-"));
const wav = path.join(tmp, "audio.wav");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", video, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
execFileSync(bin, ["-m", model, "-f", wav, "-l", process.env.IDIOMA ?? "es", "-ml", "1", "-sow", "-oj", "-of", path.join(tmp, "out"), "-t", String(os.cpus().length)], { stdio: "inherit" });

const json = JSON.parse(fs.readFileSync(path.join(tmp, "out.json"), "utf8"));
const palabras = json.transcription
  .map((s) => ({ texto: s.text.trim(), inicio: s.offsets.from / 1000, fin: s.offsets.to / 1000 }))
  .filter((p) => p.texto && !/^\[.*\]$/.test(p.texto));
// whisper.cpp estira el fin de cada palabra sobre el silencio siguiente: lo recortamos con silencedetect.
// Umbral relativo: 14 dB por debajo del volumen medio de la grabación.
const vol = spawnSync("ffmpeg", ["-i", wav, "-af", "volumedetect", "-f", "null", "-"]).stderr.toString();
const media = Number(vol.match(/mean_volume: (-?[\d.]+)/)?.[1] ?? -30);
const det = spawnSync("ffmpeg", ["-i", wav, "-af", `silencedetect=noise=${(media - 14).toFixed(1)}dB:d=0.2`, "-f", "null", "-"]).stderr.toString();
const ini = [...det.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
const fins = [...det.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
const silencios = ini.map((s, i) => ({ s, e: fins[i] ?? Infinity }));
for (const p of palabras) {
  for (const { s, e } of silencios) {
    if (s > p.inicio + 0.05 && s < p.fin) p.fin = +s.toFixed(3); // silencio empieza dentro de la palabra
    if (p.inicio >= s && p.inicio < e && e < p.fin) p.inicio = +e.toFixed(3); // la palabra "empieza" en un silencio
  }
}
fs.mkdirSync(path.dirname(salida), { recursive: true });
fs.writeFileSync(salida, JSON.stringify(palabras, null, 1));
console.log(`${palabras.length} palabras -> ${salida}`);
console.log(palabras.map((p) => p.texto).join(" "));
