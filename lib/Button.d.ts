import { Point } from "./Graphics/Point";
export interface ButtonListeners {
    click: {
        call(e: Point): void;
        type: "click";
    };
}
export declare class Button {
    static buttons: Button[];
    x: number;
    y: number;
    width: number;
    height: number;
    private listeners;
    constructor(x: number, y: number, width: number, height: number, draw?: (this: Button) => void);
    destroy(): void;
    listen<T extends keyof ButtonListeners>(type: T, listener: ButtonListeners[T]["call"]): void;
    click(): void;
    static clickAll(): void;
    static unClickAll(): void;
    draw(): void;
    static drawAll(buttons: Button[]): void;
}
