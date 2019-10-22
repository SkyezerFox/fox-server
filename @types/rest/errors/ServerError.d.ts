import { Response } from "express";
export interface ServerError {
    code: number;
    msg: string;
    details?: string;
}
export declare type ServerErrorCreator = (res: Response, details?: string) => void;
