/// <reference types="node" />
import { EventEmitter } from "events";
import * as http from "http";
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
    port: number;
}
export declare interface Server extends EventEmitter {
    on(eventName: "debug", listener: (msg: string) => any): this;
    on(eventName: "ready", listener: () => any): this;
    on(eventName: "http", listener: (msg: string) => any): this;
    on(eventName: "ws", listener: (msg: string) => any): this;
    on(eventName: "exit", listener: () => any): this;
}
/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
export declare class Server<T extends ServerOptions = ServerOptions> extends EventEmitter {
    options: T;
    rest: RESTServer;
    ws: SocketServer;
    http: http.Server;
    constructor(options?: Partial<T>);
    /**
     * Start the server.
     */
    start(): Promise<void>;
    /**
     * Stop the server.
     */
    stop(): Promise<void>;
}
