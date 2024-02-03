import { PRGM_String } from "prgm-lang";
import { Window } from "../Window";

export class Graphics {
  private target: Window;

  constructor(target: Window) {
    this.target = target;
  }

  // private normalizeRect({ x, y, w, h }: Rect) {
  //   x += this.target.x;
  //   y += this.target.y;

  //   if (x < this.target.x) {
  //     w -= this.target.x - x;
  //     if (w < 0) w = 0;
  //     x = this.target.x;
  //   }
  //   if (y < this.target.y) {
  //     h -= this.target.y - y;
  //     if (h < 0) h = 0;
  //     y = this.target.y;
  //   }
  //   if (x + w > this.target.x + this.target.width) {
  //     w -= x + w - (this.target.x + this.target.width);
  //     if (w < 0) w = 0;
  //   }
  //   if (y + h > this.target.y + this.target.height) {
  //     h -= y + h - (this.target.y + this.target.height);
  //     if (h < 0) h = 0;
  //   }

  //   return { x, y, w, h } as Rect;
  // }

  async fillRect(x: number, y: number, w: number, h: number) {
    // console.log(x, y, w, h);

    this.target.c_drawBuffer.fillStyle = await this.fillStyle.toString();
    this.target.c_drawBuffer.fillRect(x, y, w, h);
  }

  async fillText(text: PRGM_String, x: number, y: number) {
    let str = await text.toString();
    this.target.c_drawBuffer.fillStyle = await this.fillStyle.toString();
    this.target.c_drawBuffer.font = await this.font.toString();
    this.target.c_drawBuffer.fillText(str, x, y);
  }

  async textWidth(text: PRGM_String) {
    let str = await text.toString();
    return this.target.c_drawBuffer.measureText(str).width;
  }

  clearRect(x: number, y: number, w: number, h: number) {
    // c.fillStyle = "white";
    // c.fillRect(x + this.target.x, y + this.target.y, w, h);
    this.target.c_drawBuffer.clearRect(x, y, w, h);
  }

  clearScreen() {
    // this.clearRect(0, 0, this.target.width, this.target.height);
    this.fillRect(0, 0, this.target.drawBuffer.width, this.target.drawBuffer.height);
  }

  fillStyle = new PRGM_String();
  font = new PRGM_String();
}
