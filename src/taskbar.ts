import { c, canvas, newImage, settings } from ".";
import { addApp, getAppSourceCode, openApplication } from "./AppUtils";
import { Button } from "./Button";
import { OSElement } from "./OSElement";
import { storage } from "./Storage";

export class Taskbar implements OSElement {
  public static readonly height = 40;

  private icons: Button[] = [];

  async init() {
    await storage.setItem("apps", (await storage.getItem("apps")) || {});
    await addApp("/prgm/appStore");
    let apps = await storage.getItem("apps");
    for (const name of apps) {
      await this.makeIcon(name);
    }
  }

  async makeIcon(name: string) {
    let iconPath = (await getAppSourceCode(name)).split("\n")[0];

    if (!iconPath.startsWith("##icon=")) return;
    else iconPath = iconPath.slice(7);
    const icon = await newImage(iconPath);
    let btn = new Button(this.icons.length * Taskbar.height, canvas.height - Taskbar.height, Taskbar.height, Taskbar.height, function () {
      c.drawImage(icon, this.x, this.y, this.width, this.height);
    });
    btn.listen("click", () => {
      openApplication(name);
    });
    this.icons.push(btn);
  }

  draw() {
    c.fillStyle = settings.theme.main;
    c.fillRect(0, canvas.height - Taskbar.height, canvas.width, Taskbar.height);
    Button.drawAll(this.icons);
  }
}

export const taskbar = new Taskbar();
