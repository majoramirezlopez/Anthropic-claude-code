import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/questrial/400.css";
import { continueRender, delayRender } from "remotion";

const handle = delayRender("Cargando tipografías");
Promise.all([
  document.fonts.load("500 92px 'Playfair Display'"),
  document.fonts.load("italic 400 92px 'Playfair Display'"),
  document.fonts.load("400 68px 'Questrial'"),
]).then(() => continueRender(handle));
