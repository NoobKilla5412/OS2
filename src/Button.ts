import { c, mouse } from ".";
import { Point } from "./Graphics/Point";
import { Window } from "./Window";

export interface ButtonListeners {
  click: { call(e: Point): void; type: "click" };
}

export class Button {
  public static buttons: Button[] = [];

  public x: number;
  public y: number;
  public width: number;
  public height: number;

  private listeners: ButtonListeners[keyof ButtonListeners][] = [];

  constructor(x: number, y: number, width: number, height: number, draw?: (this: Button) => void) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = draw ?? this.draw;
    Button.buttons.push(this);
  }

  public destroy() {
    if (Button.buttons.includes(this)) Button.buttons.splice(Button.buttons.indexOf(this), 1);
  }

  public listen<T extends keyof ButtonListeners>(type: T, listener: ButtonListeners[T]["call"]) {
    let _val: ButtonListeners[T] = {
      call: listener,
      type
    };
    this.listeners.push(_val);
  }

  public click() {
    for (let i = 0; i < this.listeners.length; i++) {
      const element = this.listeners[i];
      if (element.type == "click") {
        element.call({ x: mouse.x, y: mouse.y });
      }
    }
  }

  public static clickAll() {
    Window.clickAll();
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      if (
        mouse.x > button.x &&
        mouse.x < button.x + button.width &&
        mouse.y > button.y &&
        mouse.y < button.y + button.height
      ) {
        button.click();
      }
    }
  }

  public static unClickAll() {
    Window.unClickAll();
  }

  public draw() {
    c.fillStyle = "black";
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  public static drawAll(buttons: Button[]) {
    for (const btn of buttons) {
      btn.draw();
    }
  }
}
