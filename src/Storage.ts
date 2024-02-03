export function expandObject(obj: any, key: string): any {
  if (!key.includes("::")) return obj[key];
  else {
    let path = key.split("::");
    let name = path.shift()!;
    return expandObject((obj[name] = obj[name] ?? {}), path.join("::"));
  }
}
export function expandObjectRef(obj: any, key: string): [obj: any, key: string] {
  if (!key.includes("::")) return [obj, key];
  else {
    let path = key.split("::");
    let name = path.shift()!;
    return expandObjectRef((obj[name] = obj[name] ?? {}), path.join("::"));
  }
}

export interface StorageObj {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export class Storage {
  private storageObj: StorageObj;

  constructor(storageObj: StorageObj) {
    this.storageObj = storageObj;
  }
  public getItem(name: string) {
    let path = name.split("::");
    let lsName = path.shift()!;
    if (!this.storageObj.getItem(lsName)) return null;
    let data = JSON.parse(this.storageObj.getItem(lsName) || "{}");
    if (path.length > 0) return expandObject(data, path.join("::"));
    else return data;
  }
  public setItem(name: string, value: any) {
    let path = name.split("::");
    let lsName = path.shift()!;
    let data = JSON.parse(this.storageObj.getItem(lsName) || "{}");
    if (path.length > 0) {
      let [obj, key] = expandObjectRef(data, path.join("::"));
      obj[key] = value;
      this.storageObj.setItem(lsName, JSON.stringify(data));
      return obj[key];
    } else {
      this.storageObj.setItem(lsName, JSON.stringify(value));
    }
  }
}

export const storage = new Storage(localStorage);
