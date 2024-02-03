export const canvas = document.querySelector("canvas")!;
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
import { Button } from "./Button";
import { COORD } from "./COORD";
import { Window } from "./Window";
import { desktop } from "./desktop";
import { taskbar } from "./taskbar";

// (async () => {
//   console.log(await compile(parse(await getAppSourceCode("testApp"))));
// })();

addEventListener("resize", resize);

export const mouse: COORD = {
  x: 0,
  y: 0
};

export const settings = {
  theme: {
    main: "#7eb5c7",
    lostFocus: "lightblue"
  }
};

export let mouseDown = false;

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mousedown", () => ((mouseDown = true), Button.clickAll()));
canvas.addEventListener("mouseup", () => ((mouseDown = false), Button.unClickAll()));
// canvas.addEventListener("click", () => {
//   canvas.requestFullscreen();
// });

export const c = canvas.getContext("2d")!;

export async function draw() {
  desktop.draw();
  taskbar.draw();
  Window.drawAll();
}

async function main() {
  await desktop.init();
  await taskbar.init();
  await Window.init();
  setInterval(draw, 1000 / 60);
  // openApplication("bird");
}

export async function newImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    let image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = src;
  });
}

main();
