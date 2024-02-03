import { c, canvas, mouse, mouseDown, newImage, settings } from ".";
import { stopApp } from "./AppUtils";
import { Button } from "./Button";
import { DIM } from "./Dimension";
import { Graphics } from "./Graphics/Graphics";
import { Taskbar } from "./taskbar";

export interface WindowOptions {}

const defaultWindowOptions: WindowOptions = {};

export class Window {
  public title: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public oldX: number;
  public oldY: number;
  public oldW: number;
  public oldH: number;
  public hasFocus = false;
  private pid: number;
  public xBtn: Button;
  private isOpen = true;
  private options: WindowOptions;

  drawBuffer: HTMLCanvasElement;
  c_drawBuffer: CanvasRenderingContext2D;

  constructor(
    title: string,
    x: number,
    y: number,
    width: number,
    height: number,
    pid: number,
    options?: Partial<WindowOptions>
  ) {
    this.options = Object.assign({}, defaultWindowOptions, options);
    this.pid = pid;

    this.drawBuffer = document.createElement("canvas");
    this.c_drawBuffer = this.drawBuffer.getContext("2d")!;
    this.drawBuffer.width = width;
    this.drawBuffer.height = height;

    y += Window.titleHeight;
    this.title = title;
    this.x = x == Window.WINDOWPOS_CENTERED_X ? x - width / 2 : x;
    this.y = y == Window.WINDOWPOS_CENTERED_Y + Window.titleHeight ? y - height / 2 - Taskbar.height : y;
    for (let i = 0; i < Window.windows.length; i++) {
      const element = Window.windows[i];
      // console.log(x, element.x);
      if (x == element.x && y == element.y) {
        // console.log("hello");
        x += 100;
        y += 100;
        break;
      }
    }
    this.width = width;
    this.height = height;
    this.oldX = this.x;
    this.oldY = this.y;
    this.oldW = this.width;
    this.oldH = this.height;

    this.xBtn = new Button(this.x + this.width - 25, this.y + 5 - Window.titleHeight, 20, 20, function () {
      c.drawImage(Window.xBtn, this.x, this.y, this.width, this.height);
    });

    this.xBtn.listen("click", this.close.bind(this));

    Window.windows.push(this);
  }

  private isLastWindow() {
    let amount = 0;
    for (let i = 0; i < Window.windows.length; i++) {
      const window = Window.windows[i];
      if (window.pid === this.pid) amount++;
    }

    return amount <= 1;
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      Window.windows.splice(Window.windows.indexOf(this), 1);
      this.xBtn.destroy();
      if (this.isLastWindow()) stopApp(this.pid);
    }
  }

  closeAfterStop() {
    if (this.isOpen) {
      this.isOpen = false;
      Window.windows.splice(Window.windows.indexOf(this), 1);
      this.xBtn.destroy();
    }
  }

  public static windows: Window[] = [];
  public static xBtn: HTMLImageElement;

  private pos1 = 0;
  private pos2 = 0;
  private pos3 = 0;
  private pos4 = 0;

  static async init() {
    this.xBtn = await newImage("/x.png");
  }

  static titleHeight = 30;

  public draw() {
    c.fillStyle = "white";
    c.fillRect(this.x, this.y, this.width, this.height);
    c.fillStyle = this.hasFocus ? settings.theme.main : settings.theme.lostFocus;
    c.fillRect(this.x, this.y - Window.titleHeight, this.width, Window.titleHeight);
    this.xBtn.x = this.x + this.width - 25;
    this.xBtn.y = this.y + 5 - Window.titleHeight;
    this.xBtn.draw();
    c.fillStyle = settings.theme.main == "black" ? "white" : "black";
    c.font = "20px Arial";
    c.fillText(this.title, this.x + 5, this.y + +c.font.replace(/[^\d.]/g, "") + 2.5 - Window.titleHeight);

    // fill window's contents
    c.drawImage(this.drawBuffer, this.x, this.y);
    // for (let i = 0; i < this.rects.length; i++) {
    //   const rect = this.rects[i];
    //   c.fillRect(rect.x + this.x, rect.y + this.y, rect.w, rect.h);
    // }
  }

  titleBarClicked = false;

  move() {
    if (this.hasFocus) {
      if (this.titleBarClicked) {
        this.pos1 = this.pos3 - mouse.x;
        this.pos2 = this.pos4 - mouse.y;
        this.pos3 = mouse.x;
        this.pos4 = mouse.y;
        this.y -= this.pos2;
        this.x -= this.pos1;
      }
      // if (mouse.y <= Math.floor(this.y + 5 - Window.titleHeight) && mouse.y >= Math.floor(this.y - Window.titleHeight))
      //   canvas.style.cursor = "n-resize";
      // else canvas.style.cursor = "default";
    }
  }

  public click() {
    this.pos3 = mouse.x;
    this.pos4 = mouse.y;
    if (mouse.x > this.x && mouse.x < this.x + this.width && mouse.y > this.y + 5 - Window.titleHeight && mouse.y < this.y) {
      this.titleBarClicked = true;
      if (this.maximized) this.restore();
    }
  }

  unClick() {
    this.titleBarClicked = false;
    if (mouse.y <= 0) this.maximize();
  }

  maximized = false;
  maximize() {
    this.oldX = this.x;
    this.oldY = this.y;
    this.oldW = this.width;
    this.oldH = this.height;
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height - Taskbar.height;
    this.maximized = true;
  }

  restore() {
    this.width = this.oldW;
    this.height = this.oldH;
    this.x = mouse.x - this.width / 2;
    this.maximized = false;
  }

  getGraphics() {
    return new Graphics(this);
  }

  keyListeners: ((e: KeyboardEvent) => void)[] = [];
  keyUpListeners: ((e: KeyboardEvent) => void)[] = [];
  clickListeners: ((e: MouseEvent) => void)[] = [];

  rects: DIM[] = [];

  static drawAll() {
    this.moveAll();
    for (let i = this.windows.length - 1; i >= 0; i--) {
      this.windows[i].draw();
    }
  }

  private static noFocusedWindows() {
    for (const window of this.windows) {
      if (window.hasFocus) return false;
    }
    return true;
  }

  static clickAll() {
    for (let i = 0; i < this.windows.length; i++) {
      const window = this.windows[i];
      if (
        mouse.x > window.x &&
        mouse.x < window.x + window.width &&
        mouse.y > window.y - Window.titleHeight &&
        mouse.y < window.y + window.height &&
        mouseDown
      ) {
        // if (
        //   !(
        //     mouse.x > this.windows[0].x &&
        //     mouse.x < this.windows[0].x + this.windows[0].width &&
        //     mouse.y > this.windows[0].y - Window.titleHeight &&
        //     mouse.y < this.windows[0].y + this.windows[0].height &&
        //     this.windows[0].hasFocus
        //   )
        // ) {
        if ((this.windows[0] != window && !this.windows[0].hasFocus) || this.windows.length == 1 || this.noFocusedWindows()) {
          window.hasFocus = true;
          this.windows.splice(this.windows.indexOf(window), 1);
          this.windows.unshift(window);
        }
        //  else if (
        //   !(
        //     mouse.x > this.windows[0].x &&
        //     mouse.x < this.windows[0].x + this.windows[0].width /*  - 30 */ &&
        //     mouse.y > this.windows[0].y - Window.titleHeight &&
        //     mouse.y < this.windows[0].y + this.windows[0].height &&
        //     this.windows[0].hasFocus
        //   )
        // ) {

        // }
        // }
        if (this.windows[0] == window && window.hasFocus) {
          window.click();
        }
      } else {
        window.hasFocus = false;
      }
    }
  }

  static unClickAll() {
    for (let i = 0; i < this.windows.length; i++) {
      this.windows[i].unClick();
    }
  }

  static moveAll() {
    for (let i = 0; i < this.windows.length; i++) {
      this.windows[i].move();
    }
  }

  static readonly WINDOWPOS_CENTERED_X = canvas.width / 2;
  static readonly WINDOWPOS_CENTERED_Y = canvas.height / 2;
}
