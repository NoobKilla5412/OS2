export declare function expandObject(obj: any, key: string): any;
export declare function expandObjectRef(obj: any, key: string): [obj: any, key: string];
export interface StorageObj {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: any) => Promise<void> | void;
}
export declare class Storage {
    private storageObj;
    constructor(storageObj: StorageObj);
    getItem(name: string): Promise<any>;
    setItem(name: string, value: any): Promise<any>;
}
export declare const storage: Storage;
