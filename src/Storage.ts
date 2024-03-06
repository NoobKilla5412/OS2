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
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: any) => Promise<void> | void;
}

export class Storage {
  private storageObj: StorageObj;

  constructor(storageObj: StorageObj) {
    this.storageObj = storageObj;
  }

  public async getItem(name: string) {
    let path = name.split("::");
    let lsName = path.shift()!;
    if (!this.storageObj.getItem(lsName)) return null;
    let data = await this.storageObj.getItem(lsName);
    if (path.length > 0) return expandObject(data, path.join("::"));
    else return data;
  }

  public async setItem(name: string, value: any) {
    let path = name.split("::");
    let lsName = path.shift()!;
    let data = await this.storageObj.getItem(lsName);
    if (path.length > 0) {
      let [obj, key] = expandObjectRef(data, path.join("::"));
      obj[key] = value;
      this.storageObj.setItem(lsName, data);
      return obj[key];
    } else {
      this.storageObj.setItem(lsName, value);
    }
  }
}

// export async function openDirectory() {
//   // Feature detection. The API needs to be supported
//   // and the app not run in an iframe.
//   const supportsFileSystemAccess =
//     "showDirectoryPicker" in window &&
//     (() => {
//       try {
//         return window.self === window.top;
//       } catch {
//         return false;
//       }
//     })();

//   // If the File System Access API is supported…
//   if (supportsFileSystemAccess) {
//     const root = await navigator.storage.getDirectory();
//     console.log(root);
//   } else {
//     console.error("File System Access API is not supported.");
//   }
// }

export const storage = new Storage({
  async getItem(key) {
    return JSON.parse(localStorage.getItem(key) || "null");
  },
  async setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
});
