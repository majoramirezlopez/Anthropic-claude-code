// Valores de marca y de edición. Fuente de verdad: ../../estilo.md
// Si cambiás algo en estilo.md, actualizalo acá también.
export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;

export const COLORES = {
  blancoCalido: "#f8f7f3",
  azulPrincipal: "#94afc9",
  beige: "#d8cdb0",
  celeste: "#8eb7ce",
  azulGris: "#6f8ca4",
  azulProfundo: "#4b6382",
};

export const FUENTES = {
  titulo: "'Playfair Display', serif", // equivalente libre de Cherie / Brown Sugar
  texto: "'Questrial', sans-serif", // equivalente libre de Glacial Indifference
};

export const SUBTITULOS = {
  tamano: 68, // px
  maxPalabras: 3,
  alturaCentro: 0.68, // 68 % de la altura
  color: COLORES.blancoCalido,
  colorClave: COLORES.beige,
  fondo: "rgba(75, 99, 130, 0.82)", // azul profundo al 82 %
  entradaFrames: 5, // aparece con fade + subida de 12 px
};

export const HOOK = {
  duracion: 3, // s
  tamano: 92,
  alturaCentro: 0.24,
};

export const CIERRE = {
  duracion: 2.5, // s
  cta: "Agenda tu valoración sin costo",
};

export const MUSICA = { volumen: 0.1 }; // ~ -20 dB respecto de la voz
export const TRANSICION_FRAMES = 8; // fundido suave solo entre bloques
