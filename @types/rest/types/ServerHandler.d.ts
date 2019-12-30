import * as express from "express";
import { FoxServer } from "../../FoxServer";
export declare type ServerHandler = (server: FoxServer, request: express.Request, response: express.Response, next: express.NextFunction) => any;
