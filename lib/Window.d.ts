import { Button } from "./Button";
import { DIM } from "./Dimension";
import { Graphics } from "./Graphics/Graphics";
export interface WindowOptions {
}
export declare class Window {
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    private oldX;
    private oldY;
    private oldW;
    private oldH;
    hasFocus: boolean;
    private pid;
    xBtn: Button;
    private isOpen;
    private options;
    drawBuffer: HTMLCanvasElement;
    c_drawBuffer: CanvasRenderingContext2D;
    constructor(title: string, x: number, y: number, width: number, height: number, pid: number, options?: Partial<WindowOptions>);
    private isLastWindow;
    close(): void;
    closeAfterStop(): void;
    static windows: Window[];
    static xBtn: HTMLImageElement;
    private pos1;
    private pos2;
    private pos3;
    private pos4;
    static init(): Promise<void>;
    static titleHeight: number;
    draw(): void;
    titleBarClicked: boolean;
    move(): void;
    click(): void;
    unClick(): void;
    maximized: boolean;
    maximize(): void;
    restore(): void;
    getGraphics(): Graphics;
    keyListeners: ((e: KeyboardEvent) => void)[];
    keyUpListeners: ((e: KeyboardEvent) => void)[];
    clickListeners: ((e: MouseEvent) => void)[];
    rects: DIM[];
    static drawAll(): void;
    private static noFocusedWindows;
    static clickAll(): void;
    static unClickAll(): void;
    static moveAll(): void;
    static readonly WINDOWPOS_CENTERED_X: number;
    static readonly WINDOWPOS_CENTERED_Y: number;
}
