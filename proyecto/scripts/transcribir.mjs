// Uso: node scripts/transcribir.mjs <video> [salida.json] [modelo=base]
// Transcribe en español con whisper.cpp y guarda una lista de palabras con tiempos (segundos).
import { execFileSync } from "node:child_process";
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
execFileSync(bin, ["-m", model, "-f", wav, "-l", "es", "-ml", "1", "-sow", "-oj", "-of", path.join(tmp, "out"), "-t", String(os.cpus().length)], { stdio: "inherit" });

const json = JSON.parse(fs.readFileSync(path.join(tmp, "out.json"), "utf8"));
const palabras = json.transcription
  .map((s) => ({ texto: s.text.trim(), inicio: s.offsets.from / 1000, fin: s.offsets.to / 1000 }))
  .filter((p) => p.texto && !/^\[.*\]$/.test(p.texto));
fs.mkdirSync(path.dirname(salida), { recursive: true });
fs.writeFileSync(salida, JSON.stringify(palabras, null, 1));
console.log(`${palabras.length} palabras -> ${salida}`);
console.log(palabras.map((p) => p.texto).join(" "));
