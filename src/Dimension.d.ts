import { COORD } from "./COORD";

export interface DIM extends COORD {
  w: number;
  h: number;
  fillStyle: string | CanvasGradient | CanvasPattern;
}
