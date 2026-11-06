import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CIERRE, FPS, HOOK, MUSICA } from "./estilo";
import { Cierre, Hook, MarcaDeAgua } from "./Marca";
import { Palabra, Subtitulos } from "./Subtitulos";

export type Corte = { inicio: number; fin: number }; // segundos en el video original (lo que SE QUEDA)
export type PropsEdicion = {
  fuente: string; // ruta dentro de public/, p. ej. "entrada/video.mp4"
  cortes: Corte[];
  palabras: Palabra[]; // tiempos ya ajustados a la línea de tiempo editada
  hook: string;
  cta?: string;
  musica?: string | null; // ruta dentro de public/ o null
};

const duracionCuerpo = (cortes: Corte[]) => cortes.reduce((a, c) => a + Math.round((c.fin - c.inicio) * FPS), 0);

export const calcularMetadatos: CalculateMetadataFunction<PropsEdicion> = ({ props }) => ({
  durationInFrames: Math.max(1, duracionCuerpo(props.cortes) + Math.round(CIERRE.duracion * FPS)),
});

export const VideoEditado: React.FC<PropsEdicion> = ({ fuente, cortes, palabras, hook, cta, musica }) => {
  let acumulado = 0;
  const cuerpo = duracionCuerpo(cortes);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {cortes.map((c, i) => {
        const largo = Math.round((c.fin - c.inicio) * FPS);
        const desde = acumulado;
        acumulado += largo;
        // Zoom alternado 100 % / 107 % en cada corte para disimular el salto.
        const zoom = i % 2 === 0 ? 1 : 1.07;
        return (
          <Sequence key={i} from={desde} durationInFrames={largo}>
            <OffthreadVideo
              src={staticFile(fuente)}
              trimBefore={Math.round(c.inicio * FPS)}
              trimAfter={Math.round(c.inicio * FPS) + largo}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }}
            />
          </Sequence>
        );
      })}
      <Sequence durationInFrames={cuerpo}>
        <Subtitulos palabras={palabras} />
        <MarcaDeAgua />
      </Sequence>
      <Sequence durationInFrames={Math.round(HOOK.duracion * FPS)}>
        <Hook texto={hook} />
      </Sequence>
      <Sequence from={cuerpo}>
        <Cierre cta={cta} />
      </Sequence>
      {musica ? <Audio src={staticFile(musica)} loop volume={MUSICA.volumen} /> : null}
    </AbsoluteFill>
  );
};
