import { c, newImage } from ".";
import { OSElement } from "./OSElement";

export class Desktop implements OSElement {
  public image!: HTMLImageElement;

  async init() {
    this.image = await newImage("/wallpaper.jpg");
  }

  draw() {
    c.drawImage(this.image, 0, 0);
  }
}

export const desktop = new Desktop();
