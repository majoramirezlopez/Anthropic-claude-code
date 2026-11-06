# Editor de video con IA — Corpoestética

Esta carpeta es un editor de video. Trabajá **solo dentro de esta carpeta**.

## Regla de oro
- **Antes de borrar, mover o sobrescribir cualquier archivo de la usuaria** (todo lo que haya en
  `grabaciones/`, `referencias/`, `musica/`, `exportados/`, `marca/`, `estilo.md`), pedí
  confirmación explícita. Los archivos temporales que generes vos (en `proyecto/trabajo/`,
  `proyecto/public/entrada/`, `/tmp`) sí los podés limpiar.
- Antes de aplicar cortes, mostrá la lista de cortes y esperá el OK.
- Antes de instalar algo nuevo, avisá qué y por qué.

## Carpetas
| Carpeta / archivo | Qué es |
|---|---|
| `grabaciones/` | Videos crudos que tira la usuaria. Se usa el más reciente. |
| `referencias/` | Videos que le gustan (solo para analizar estilo, nunca reutilizar material). |
| `exportados/` | Videos terminados: `<nombre-original>-editado.mp4`. |
| `musica/` | Música de fondo. Vacía = editar sin música. |
| `marca/` | Logos extraídos del brandbook (isotipo/logotipo, blanco/azul, PNG transparente). |
| `estilo.md` | Reglas de edición medibles. **Manda sobre cualquier otra preferencia.** |
| `proyecto/` | Proyecto Remotion (React) que arma los videos. |
| `proyecto/src/estilo.ts` | Los mismos valores de `estilo.md` en código. Mantenerlos sincronizados. |
| `proyecto/scripts/` | `transcribir.mjs`, `proponer-cortes.mjs`, `editar.mjs`. |
| `proyecto/whisper.cpp/` | whisper.cpp compilado + modelo `ggml-base.bin` (no va a git). |
| `.herramientas/venv/` | Entorno Python con yt-dlp (no va a git). |

## Herramientas
- **Node.js ≥ 18** (hay v22): corre Remotion y los scripts.
- **FFmpeg / ffprobe**: cortar, unir, extraer audio, sacar cuadros (`-ss T -frames:v 1`),
  detectar silencios (`silencedetect`), comprimir y exportar.
- **yt-dlp**: bajar referencias → `.herramientas/venv/bin/yt-dlp -o "referencias/%(title).60s.%(ext)s" <url>`.
- **whisper.cpp** (modelo `base`, español): transcripción con tiempos por palabra →
  `node proyecto/scripts/transcribir.mjs <video> proyecto/trabajo/palabras.json`.
  Para más precisión: bajar `ggml-small.bin` a `proyecto/whisper.cpp/` y pasar `small` como 3er argumento.
- **Remotion** (`proyecto/`): composiciones `VideoEditado` (edición real) y `MuestraEstilo` (demo 10 s).
  Vista previa: `cd proyecto && npm run dev`.

## Flujo de edición
1. **Elegir**: el video más reciente de `grabaciones/` (`ls -t grabaciones | head -1`).
2. **Transcribir** con Whisper → `proyecto/trabajo/palabras.json` (palabra, inicio, fin en segundos).
3. **Cortar silencios y errores**:
   - `node proyecto/scripts/proponer-cortes.mjs proyecto/trabajo/palabras.json proyecto/trabajo/cortes.json 0.4`
     saca silencios > 0,4 s y muletillas obvias.
   - Leer la transcripción y quitar a mano (editando `cortes.json`) frases repetidas o equivocadas:
     **se queda la última toma**.
   - **Mostrar la lista de cortes a la usuaria y esperar confirmación.**
4. **Aplicar `estilo.md`**: hook (texto de ≤ 6 palabras para los primeros 3 s), palabras clave,
   ritmo, zoom alternado, marca de agua y cierre.
5. **Subtítulos**: copiar `palabras.json` a `palabras-corregidas.json`, corregir ortografía/tildes
   (sin cambiar tiempos) y marcar `"clave": true` en las palabras a resaltar.
6. **Música**: `editar.mjs` usa el primer archivo de `musica/` a volumen 0,10; si no hay, va sin música.
7. **Exportar** vertical 1080×1920, 30 fps:
   `node proyecto/scripts/editar.mjs grabaciones/<video> proyecto/trabajo/cortes.json proyecto/trabajo/palabras-corregidas.json "<hook>" ["<CTA>"]`
   → `exportados/<nombre>-editado.mp4`. Verificar con ffprobe y mirar 3–4 cuadros.
8. **Informar** duración final y lista de lo cortado.

## Correcciones
Cuando la usuaria pida un cambio ("hook más grande", "subtítulos más abajo"): aplicarlo
(en `proyecto/src/estilo.ts` o en el componente), volver a exportar y, si dice que lo quiere
**siempre**, actualizar también `estilo.md` y anotarlo en su "Historial de cambios".

## Notas del entorno
- En la nube de Claude Code la red solo deja registros de paquetes y GitHub: huggingface.co
  (modelos de Whisper), Instagram/YouTube y remotion.media están bloqueados salvo que se habiliten.
- `proyecto/remotion.config.ts` usa el Chrome headless de `/opt/pw-browsers` si existe; en otra
  compu Remotion baja el suyo solo.
- Instalación en otra compu: `cd proyecto && npm install && node scripts/instalar-whisper.mjs base`,
  y `python3 -m venv .herramientas/venv && .herramientas/venv/bin/pip install yt-dlp`.
