import "./fuentes";
import { Composition } from "remotion";
import { ALTO, ANCHO, FPS } from "./estilo";
import { DURACION_MUESTRA, MuestraEstilo } from "./MuestraEstilo";
import { calcularMetadatos, PropsEdicion, VideoEditado } from "./VideoEditado";

const ejemplo: PropsEdicion = { fuente: "entrada/prueba.mp4", cortes: [{ inicio: 0, fin: 4 }], palabras: [], hook: "Título del hook", musica: null };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MuestraEstilo" component={MuestraEstilo} durationInFrames={DURACION_MUESTRA} fps={FPS} width={ANCHO} height={ALTO} />
    <Composition id="VideoEditado" component={VideoEditado} durationInFrames={1} fps={FPS} width={ANCHO} height={ALTO} defaultProps={ejemplo} calculateMetadata={calcularMetadatos} />
  </>
);
