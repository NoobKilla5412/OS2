import { Window } from "./Window";
export declare namespace Listeners {
    function listen(type: string, listener: (e: any) => void, window: Window): [string, (e: any) => void];
}
type ApplicationData = string;
interface ApplicationOptions {
    [name: string]: boolean;
    useConsole: boolean;
}
export declare function defineApplication(name: string, data: ApplicationData, options?: Partial<ApplicationOptions>): void;
export declare function addApp(name: string): Promise<void>;
export declare function openApplication(name: string): Promise<number>;
export declare function stopApp(pid: number): Promise<void>;
export declare function getAppSourceCode(name: string): Promise<string>;
export {};
