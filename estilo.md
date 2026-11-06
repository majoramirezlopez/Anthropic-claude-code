# Estilo de edición — Corpoestética

> Estado: **provisional**. La marca sale del brandbook oficial (manda sobre cualquier referencia).
> El ritmo, los subtítulos y las transiciones son una base pensada para la personalidad de la marca
> (elegante, tranquila, honesta, arquetipo "Contemplador"). Se ajusta cuando analicemos videos de
> referencia y con cada corrección que pidas ("siempre quiero…").
>
> Los valores numéricos están también en `proyecto/src/estilo.ts`: si cambia uno, cambian los dos.

## 1. Marca (del brandbook — no se negocia)

| Uso | Color | Hex |
|---|---|---|
| Fondo claro / texto sobre oscuro | Blanco cálido | `#f8f7f3` |
| Color principal | Azul | `#94afc9` |
| Acento / palabra clave | Beige | `#d8cdb0` |
| Secundario | Celeste | `#8eb7ce` |
| Secundario | Azul gris | `#6f8ca4` |
| Fondo de subtítulos / texto sobre claro | Azul profundo | `#4b6382` |

- **Prohibido**: colores fuera de esta paleta (ni rosa, ni amarillo, ni negro puro de fondo),
  fondos de bajo contraste, texto azul sobre fondo que no sea blanco cálido.
- **Tipografías** del brandbook: Cherie y Brown Sugar (serif de títulos), Bile y Glacial
  Indifference (sans). Como no son libres para instalar aquí, se usan equivalentes:
  - Títulos / hook → **Playfair Display 500** (serif de alto contraste).
  - Subtítulos / CTA → **Questrial 400** (geométrica, equivalente a Glacial Indifference).
  - Si me pasás los archivos .otf/.ttf originales, los reemplazo.
- **Logo**: archivos en `marca/` (isotipo y logotipo, blanco y azul, PNG transparente).
  Nunca deformar, recolorear fuera de la paleta ni mover "Claudia López".
- **Tono**: profesional pero cálido, cercano, aspiracional, sin exageraciones ni promesas
  irreales. Tutear ("tu piel", "te acompañamos"). Nada de "¡INCREÍBLE!", ni mayúsculas gritadas.

## 2. Formato
- Vertical **1080×1920, 30 fps**, H.264. Duración ideal 20–60 s.
- Zona segura: nada importante a menos de 80 px de los bordes ni en los 300 px inferiores
  (ahí van los botones de Instagram).

## 3. Primeros 3 segundos (hook)
- Arranca **directo con la frase más fuerte**: sin saludo ("hola, ¿cómo están?") ni silencio.
- Título del hook en Playfair Display **92 px**, `#f8f7f3`, centrado al **24 % de la altura**,
  máximo 6 palabras / 2 líneas, sombra suave, línea fina beige de 160 px debajo.
- Entra con fundido + subida de 30 px (~0,5 s) y sale con fundido en los últimos 8 frames del segundo 3.
- Preferir pregunta o afirmación que interpele: "¿Qué es envejecer bien?", "Lo que nadie te dice del láser".

## 4. Ritmo y cortes
- Silencios: se corta todo silencio **> 0,4 s** (se dejan 0,08 s de aire antes y después de cada palabra).
- Muletillas fuera: "eh", "em", "mmm", "este" (de relleno), "o sea" y "bueno" cuando no aportan.
- Frase repetida o equivocada: **se queda la última toma**.
- Un cambio de plano o de encuadre cada **2,5–4 s** (ritmo tranquilo, no frenético).
- Cada corte (jump cut) alterna el encuadre **100 % / 107 %** para que no se note el salto.

## 5. Subtítulos
- Questrial **68 px**, máximo **3 palabras** por bloque, una línea si entra (ancho máx. 900 px).
- Centrados horizontalmente, centro del bloque al **68 % de la altura**.
- Caja redondeada (radio 18 px) en `#4b6382` al 82 %, texto `#f8f7f3`.
- **Palabra clave** (beneficio, tratamiento, emoción) en beige `#d8cdb0`; 1 por bloque como máximo.
- Efecto karaoke suave: las palabras todavía no dichas al 45 % de opacidad.
- Animación de entrada: fundido + subida de 12 px en 5 frames. Sin rebotes ni sacudidas.
- Ortografía perfecta, con tildes y signos de apertura (¿ ¡). Nombres de tratamientos como en el
  brandbook: Bótox, ácido hialurónico, Radiesse, Sculptra, láser CO2 fraccionado, Nanopore, IPL.
- Se cortan bloques en pausas > 0,35 s o en puntuación.

## 6. Transiciones
- Entre cortes de la misma toma: **corte seco** (con el zoom alternado).
- Entre bloques temáticos o cambio de escena: **fundido cruzado de 8 frames**. Nada de barridos,
  giros, glitch ni flashes.

## 7. Marca dentro del video
- Isotipo blanco de **78 px** arriba a la derecha (80 px del borde superior, 64 px del derecho), 75 % de opacidad,
  durante todo el video (no en el cierre).
- **Cierre de 2,5 s**: fondo `#f8f7f3`, isotipo azul de 170 px + logotipo azul de 720 px de ancho, y CTA
  en Questrial 46 px `#4b6382`. CTA por defecto: "Agenda tu valoración sin costo".

## 8. Música y sonido
- Si hay archivos en `musica/`: el primero, en loop, a volumen **0,10 (~-20 dB)** debajo de la voz;
  la voz siempre se entiende. Estilo sugerido: piano/ambient suave, sin letra.
- Si `musica/` está vacía: sin música.
- Efectos de sonido: ninguno por defecto (marca tranquila). Como mucho un "whoosh" muy suave
  en el hook si lo pedís.

## 9. Historial de cambios pedidos
_(acá se anota cada preferencia permanente que me digas, con fecha)_
- 2026-11-06: estilo base creado a partir del brandbook.
