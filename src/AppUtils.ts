// export let whileLoops: ({ handler: () => void; condition: () => boolean; done: boolean; pid: number } | null)[] = [];

import { Environment, PRGM_String, defaultEnv, evaluate, parse, toPRGM_String } from "prgm-lang";
import { canvas } from ".";
import { Point } from "./Graphics/Point";
import { storage } from "./Storage";
import { Window } from "./Window";

// export async function While(handler: () => void, condition: () => boolean, pid: number) {
//   return new Promise<void>((resolve) => {
//     let i = whileLoops.push({ handler, condition, done: false, pid }) - 1;
//     let interval = setInterval(() => {
//       if (whileLoops[i]?.done) {
//         clearInterval(interval);
//         whileLoops[i] = null;
//         resolve();
//       }
//     });
//   });
// }

// export function Break(pid: number) {
//   for (let i = 0; i < whileLoops.length; i++) {
//     const element = whileLoops[i];
//     if (element?.pid == pid) {
//       element.done = true;
//     }
//   }
// }

// export function Quit(pid: number) {
//   Break(pid);
//   for (let i = 0; i < Window.windows.length; i++) {
//     const window = Window.windows[i];
//     if (window.pid == pid) {
//       for (let j = 0; j < window.keyListeners.length; j++) {
//         const element = window.keyListeners[j];
//         removeEventListener("keydown", element);
//       }
//       window.close();
//     }
//   }
// }

export namespace Listeners {
  export function listen(type: string, listener: (e: any) => void, window: Window): [string, (e: any) => void] {
    switch (type) {
      case "keydown":
      case "keyup": {
        let listenerFunction = (e: KeyboardEvent) => {
          if (window.hasFocus) {
            listener(e);
          }
        };
        // window.keyListeners.push(listenerFunction);
        addEventListener(type, listenerFunction);
        return [type, listenerFunction];
      }
      case "mousedown":
      case "mouseup":
      case "mousemove":
      case "click": {
        let listenerFunction = mouseListenerFunction(listener, window);
        // window.clickListeners.push(listenerFunction);
        addEventListener(type, listenerFunction);
        return [type, listenerFunction];
      }
      default:
        throw new TypeError(`Unknown listener type: ${type}`);
    }
  }

  function mouseListenerFunction(listener: (e: Point) => void, window: Window) {
    let listenerFunction = (e: MouseEvent) => {
      let res: Point = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
      res.x -= window.x;
      res.y -= window.y;

      if (window.hasFocus && res.y >= 0) {
        listener(res);
      }
    };
    return listenerFunction;
  }
}

let applications: { [name: string]: Application } = {};

type ApplicationData = string;

interface Application {
  data: ApplicationData;
  options: ApplicationOptions;
}

interface ApplicationOptions {
  [name: string]: boolean;
  useConsole: boolean;
}

const defaultAppOptions: ApplicationOptions = {
  useConsole: true
};

function mergeValues<T>(required: Required<T>, partial?: Partial<T>) {
  let res: T = {} as T;
  if (typeof partial == "undefined") {
    res = required;
  } else
    for (const key in required) {
      const element = partial[key];
      if (typeof element == "undefined" || element == null) {
        // @ts-ignore
        res[key] = required[key];
      } else {
        res[key] = element;
      }
    }
  return res;
}

export function defineApplication(name: string, data: ApplicationData, options?: Partial<ApplicationOptions>) {
  if (/^[a-z\d/]+$/gi.test(name)) {
    let newOptions = mergeValues(defaultAppOptions, options);
    applications[name] = { data, options: newOptions };
  }
}

let processes: { env: Environment; pid: number }[] = [];

interface PidAndData<D> {
  pid: number;
  data: D;
}

let windows: PidAndData<Window>[] = [];
let listeners: PidAndData<ReturnType<typeof Listeners.listen>>[] = [];

export async function addApp(name: string) {
  const apps = await storage.getItem("apps");
  if (!(name in apps)) {
    apps[name] = await getAppSourceCode(name);
  }
  storage.setItem("apps", apps);
}

export async function openApplication(name: string) {
  return new Promise<number>(async (resolve) => {
    if (name in applications) {
      let pid = 0;
      processes.forEach((process) => {
        if (process.pid > pid) pid = process.pid;
      });
      pid++;
      // let consolePid: number | undefined;

      // processes.push({ name, pid });

      // console.log(name + ":", applications[name].options);
      // if (applications[name].options.useConsole) {
      //   console.log("opening console");
      //   consolePid = await openApplication("console");
      // }
      resolve(pid);
      let env = defaultEnv();
      processes[pid] = {
        env,
        pid
      };
      env.def("listen", async (type: PRGM_String, listener: (e: any) => void, window: Window) => {
        let str = await type.toString();
        listeners.push({ pid, data: Listeners.listen(str, listener, window) });
      });
      env.def("Window", async (title: PRGM_String, width: number, height: number, x?: number, y?: number) => {
        let window = new Window(await title.toString(), x ?? Window.WINDOWPOS_CENTERED_X, y ?? Window.WINDOWPOS_CENTERED_Y, width, height, pid);
        windows.push({ pid, data: window });
        return window;
      });
      env.def("storage", {
        async getItem(_name: PRGM_String) {
          let str = await _name.toString();
          let res = await storage.getItem(`app::${name}::${str}`);
          if (res === undefined) res = null;
          return res;
        },
        async setItem(_name: PRGM_String, value: any) {
          let str = await _name.toString();
          let _value;
          if (value.__isString__ === true) _value = await value.toString();
          else _value = value;
          await storage.setItem(`app::${name}::${str}`, value);
          return value;
        }
      });
      async function println(...data: any[]) {
        let res = [];

        for (const v of data) {
          res.push(typeof v == "object" && v && v.__isString__ === true ? await v.toString() : v);
        }

        console.log(`${name}>`, ...res);
      }
      env.def("println", println);
      env.def("console", {
        log: println
      });
      env.def("fetch", async (_url: PRGM_String) => {
        let url = await _url.toString();
        return await toPRGM_String(await (await fetch(url)).text(), env);
      });

      let exitCode = await evaluate(parse(applications[name].data), env, pid, name.split("/").slice(0, -1).join("/"), (code) => {
        _stopApp(pid);
      });
      return exitCode;
    } else {
      defineApplication(name, (await storage.getItem("apps"))[name]);
      await openApplication(name);
      return;
      console.error(`Application "${name}" not found.`);
    }
  });
}

export async function stopApp(pid: number) {
  if (processes[pid]) {
    processes[pid].env.get("exit")();
  }
  await _stopApp(pid);
}

async function _stopApp(pid: number) {
  for (let i = 0; i < windows.length; i++) {
    const window = windows[i];
    if (window.pid === pid) window.data.closeAfterStop();
  }
  windows = windows.filter((val) => val.pid === pid);
  for (let i = 0; i < listeners.length; i++) {
    const element = listeners[i];
    if (element.pid === pid) removeEventListener(element.data[0], element.data[1]);
  }
  listeners = listeners.filter((val) => val.pid === pid);
}

export async function getAppSourceCode(name: string) {
  return await (await fetch(`${name}.prgm`)).text();
}
