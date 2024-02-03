export declare function expandObject(obj: any, key: string): any;
export declare function expandObjectRef(obj: any, key: string): [obj: any, key: string];
export interface StorageObj {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
}
export declare class Storage {
    private storageObj;
    constructor(storageObj: StorageObj);
    getItem(name: string): any;
    setItem(name: string, value: any): any;
}
export declare const storage: Storage;
