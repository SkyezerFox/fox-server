import * as http from "http";
import * as winston from "winston";
import { SocketServer } from "./gateway/SocketServer";
import { RESTServer } from "./rest/RESTServer";
/**
 * Options to use for the server during runtime.
 *
 * @typedef ServerOptions
 *
 *
 * @property {string} dbUri - The URI to use when connecting to the database
 * @property {"debug"|"verbose"|"info"} debug - Whether to enable debug logging
 * @property {number} port - The port to listen on
 */
export interface ServerOptions {
    debug: "debug" | "verbose" | "info";
    disableWinston: boolean;
    port: number;
}
/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
export declare class Server<T extends ServerOptions = ServerOptions> {
    options: T;
    http: http.Server;
    rest: RESTServer;
    ws: SocketServer;
    logger: winston.Logger;
    beforeStartTasks: ((server: Server) => any)[];
    constructor(options?: Partial<T>);
    /**
     * Start the server.
     */
    start(): Promise<void>;
    /**
     * Stop the server.
     */
    stop(): Promise<void>;
    task(taskFunction: (...args: any[]) => any): Promise<void>;
}
