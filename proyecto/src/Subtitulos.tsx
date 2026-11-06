import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ALTO, FUENTES, SUBTITULOS } from "./estilo";

export type Palabra = { texto: string; inicio: number; fin: number; clave?: boolean };

// Agrupa palabras en páginas de hasta N palabras; corta también en pausas > 0,35 s o puntuación.
export const paginar = (palabras: Palabra[], max = SUBTITULOS.maxPalabras) => {
  const paginas: Palabra[][] = [];
  let actual: Palabra[] = [];
  palabras.forEach((p, i) => {
    actual.push(p);
    const sig = palabras[i + 1];
    const pausa = sig ? sig.inicio - p.fin > 0.35 : true;
    if (actual.length >= max || pausa || /[.,;:?!]$/.test(p.texto)) {
      paginas.push(actual);
      actual = [];
    }
  });
  if (actual.length) paginas.push(actual);
  return paginas;
};

export const Subtitulos: React.FC<{ palabras: Palabra[]; desde?: number }> = ({ palabras, desde = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + desde;
  const paginas = paginar(palabras);
  const pagina = paginas.find((pg, i) => {
    const fin = paginas[i + 1] ? Math.min(paginas[i + 1][0].inicio, pg[pg.length - 1].fin + 0.6) : pg[pg.length - 1].fin + 0.6;
    return t >= pg[0].inicio && t < fin;
  });
  if (!pagina) return null;
  const entrada = interpolate((t - pagina[0].inicio) * fps, [0, SUBTITULOS.entradaFrames], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: ALTO * SUBTITULOS.alturaCentro,
          transform: `translateY(calc(-50% + ${(1 - entrada) * 12}px))`,
          opacity: entrada,
          maxWidth: 900,
          padding: "14px 30px 18px",
          borderRadius: 18,
          background: SUBTITULOS.fondo,
          fontFamily: FUENTES.texto,
          fontSize: SUBTITULOS.tamano,
          lineHeight: 1.15,
          textAlign: "center",
          color: SUBTITULOS.color,
        }}
      >
        {pagina.map((p, i) => {
          const dicha = t >= p.inicio;
          return (
            <span key={i} style={{ color: p.clave ? SUBTITULOS.colorClave : SUBTITULOS.color, opacity: dicha ? 1 : 0.45 }}>
              {p.texto}
              {i < pagina.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
