// import { Window } from "./Window";
// import { While, defineApplication, key } from "./language/AppUtils";

// defineApplication("testApp", async (pid) => {
//   let window = new Window("hi", Window.WINDOWPOS_CENTERED_X, Window.WINDOWPOS_CENTERED_Y, 800, 600, pid);
//   let g = window.getGraphics();
//   let x = 0;
//   let y = 0;

//   key((e) => {
//     if (e.key == "w") y -= 5;
//     if (e.key == "a") x -= 5;
//     if (e.key == "s") y += 5;
//     if (e.key == "d") x += 5;
//   }, window);

//   let i = 0;

//   await While(
//     () => {
//       g.clearScreen();
//       g.fillRect(x, y, 50, 50);
//       // if (i > 400) {
//       //   Quit(pid);
//       // }
//       i++;
//     },
//     () => true,
//     pid
//   );
//   return 0;
// });

// export let testApp = "";
