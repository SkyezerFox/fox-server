import * as winston from "winston";
export declare const charLog: (...msg: string[]) => void;
export declare const createLoggerWithPrefix: (prefix?: string) => winston.Logger;
