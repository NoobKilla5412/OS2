import { OSElement } from "./OSElement";
export declare class Taskbar implements OSElement {
    static readonly height = 40;
    private icons;
    init(): Promise<void>;
    makeIcon(name: string): Promise<void>;
    draw(): void;
}
export declare const taskbar: Taskbar;
