import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CIERRE, COLORES, FPS, FUENTES, HOOK, TRANSICION_FRAMES } from "./estilo";
import { Cierre, Hook, MarcaDeAgua } from "./Marca";
import { Palabra, Subtitulos } from "./Subtitulos";

// Escena de relleno (en un video real va el material grabado): degradé de marca con zoom lento.
const Escena: React.FC<{ a: string; b: string; texto?: string }> = ({ a, b, texto }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 90], [1, 1.06]);
  const op = interpolate(f, [0, TRANSICION_FRAMES], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op, background: `radial-gradient(circle at 30% 25%, ${a}, ${b})`, transform: `scale(${z})` }}>
      <Img src={staticFile("marca/isotipo-blanco.png")} style={{ position: "absolute", left: 340, top: 760, width: 400, opacity: 0.12 }} />
      {texto ? (
        <div style={{ position: "absolute", width: "100%", top: 980, textAlign: "center", fontFamily: FUENTES.titulo, fontStyle: "italic", fontSize: 54, color: COLORES.blancoCalido, opacity: 0.55 }}>
          {texto}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const frase = (texto: string, inicio: number, dur: number, claves: string[] = []): Palabra[] => {
  const ps = texto.split(" ");
  const paso = dur / ps.length;
  return ps.map((p, i) => ({ texto: p, inicio: inicio + i * paso, fin: inicio + (i + 1) * paso - 0.05, clave: claves.includes(p.replace(/[.,]/g, "")) }));
};

const PALABRAS: Palabra[] = [
  ...frase("Tu piel cambia con los años.", 3.1, 1.6, ["piel"]),
  ...frase("Y está bien.", 4.9, 0.8),
  ...frase("Te acompañamos con resultados naturales,", 5.9, 1.8, ["naturales"]),
  ...frase("sin exageraciones.", 7.8, 0.9),
];

export const DURACION_MUESTRA = 10 * FPS;

export const MuestraEstilo: React.FC = () => {
  const cuerpo = DURACION_MUESTRA - Math.round(CIERRE.duracion * FPS);
  const escenas: [string, string, string][] = [
    [COLORES.azulPrincipal, COLORES.azulProfundo, ""],
    [COLORES.celeste, COLORES.azulGris, "plano: rostro"],
    [COLORES.beige, COLORES.azulGris, "plano: tratamiento"],
    [COLORES.azulGris, COLORES.azulProfundo, "plano: resultado"],
  ];
  const cortes = [0, 3, 5.4, 7.5].map((s) => Math.round(s * FPS));
  return (
    <AbsoluteFill style={{ background: COLORES.azulProfundo }}>
      {escenas.map(([a, b, t], i) => (
        <Sequence key={i} from={cortes[i]} durationInFrames={(cortes[i + 1] ?? cuerpo) - cortes[i] + TRANSICION_FRAMES}>
          <Escena a={a} b={b} texto={t} />
        </Sequence>
      ))}
      <Sequence durationInFrames={cuerpo}>
        <Subtitulos palabras={PALABRAS} />
        <MarcaDeAgua />
      </Sequence>
      <Sequence durationInFrames={Math.round(HOOK.duracion * FPS)}>
        <Hook texto="¿Qué es envejecer bien?" />
      </Sequence>
      <Sequence from={cuerpo}>
        <Cierre />
      </Sequence>
    </AbsoluteFill>
  );
};
