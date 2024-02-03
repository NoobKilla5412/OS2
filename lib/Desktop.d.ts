import { OSElement } from "./OSElement";
export declare class Desktop implements OSElement {
    image: HTMLImageElement;
    init(): Promise<void>;
    draw(): void;
}
export declare const desktop: Desktop;
