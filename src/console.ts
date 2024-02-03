// import { Window } from "./Window";
// import { While, defineApplication } from "./language/AppUtils";

// defineApplication(
//   "console",
//   async (pid) => {
//     console.log("console:", pid);
//     let window = new Window("Console", Window.WINDOWPOS_CENTERED_X, Window.WINDOWPOS_CENTERED_Y, 800, 600, pid);
//     let g = window.getGraphics();

//     await While(
//       () => {
//         g.fillStyle("black");
//         g.fillRect(0, 0, window.width, window.height);
//         // console.log(window.hasFocus);
//       },
//       () => true,
//       pid
//     );
//     return 0;
//   },
//   {
//     useConsole: false
//   }
// );

// export let consoleApp = "";
