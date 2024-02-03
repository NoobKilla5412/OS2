import { PRGM_String } from "prgm-lang";
import { Window } from "../Window";
export declare class Graphics {
    private target;
    constructor(target: Window);
    fillRect(x: number, y: number, w: number, h: number): Promise<void>;
    fillText(text: PRGM_String, x: number, y: number): Promise<void>;
    textWidth(text: PRGM_String): Promise<number>;
    clearRect(x: number, y: number, w: number, h: number): void;
    clearScreen(): void;
    fillStyle: PRGM_String;
    font: PRGM_String;
}
