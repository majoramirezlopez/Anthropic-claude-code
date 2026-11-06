import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ALTO, CIERRE, COLORES, FUENTES, HOOK } from "./estilo";

// Isotipo fijo arriba a la derecha (marca de agua).
export const MarcaDeAgua: React.FC = () => (
  <Img src={staticFile("marca/isotipo-blanco.png")} style={{ position: "absolute", top: 80, right: 64, width: 78, opacity: 0.75 }} />
);

// Hook de los primeros 3 s: título serif con línea fina, entra con fade + subida.
export const Hook: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const salida = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", opacity: salida }}>
      <div
        style={{
          position: "absolute",
          top: ALTO * HOOK.alturaCentro,
          transform: `translateY(calc(-50% + ${(1 - s) * 30}px))`,
          opacity: s,
          width: 900,
          textAlign: "center",
          fontFamily: FUENTES.titulo,
          fontWeight: 500,
          fontSize: HOOK.tamano,
          lineHeight: 1.08,
          color: COLORES.blancoCalido,
          textShadow: "0 4px 28px rgba(40,55,75,0.55)",
        }}
      >
        {texto}
        <div style={{ margin: "26px auto 0", height: 3, width: 160 * s, background: COLORES.beige }} />
      </div>
    </AbsoluteFill>
  );
};

// Placa de cierre: fondo blanco cálido, logotipo azul y CTA.
export const Cierre: React.FC<{ cta?: string }> = ({ cta = CIERRE.cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: COLORES.blancoCalido, alignItems: "center", justifyContent: "center", opacity: interpolate(frame, [0, 8], [0, 1]) }}>
      <Img src={staticFile("marca/isotipo-azul.png")} style={{ width: 170, opacity: s, transform: `scale(${0.9 + 0.1 * s})` }} />
      <Img src={staticFile("marca/logotipo-azul.png")} style={{ width: 720, marginTop: 50, opacity: s }} />
      <div style={{ marginTop: 90, fontFamily: FUENTES.texto, fontSize: 46, color: COLORES.azulProfundo, letterSpacing: 1, opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
        {cta}
      </div>
    </AbsoluteFill>
  );
};
