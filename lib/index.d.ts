export declare const canvas: HTMLCanvasElement;
import { COORD } from "./COORD";
export declare const mouse: COORD;
export declare const settings: {
    theme: {
        main: string;
        lostFocus: string;
    };
};
export declare let mouseDown: boolean;
export declare const c: CanvasRenderingContext2D;
export declare function draw(): Promise<void>;
export declare function newImage(src: string): Promise<HTMLImageElement>;
