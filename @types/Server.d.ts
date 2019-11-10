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
    disableAnimations: boolean;
    versionChecking: boolean;
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
    beforeStartTasks: ((server: Server<T>, ...args: any[]) => any)[];
    afterStartTasks: ((server: Server<T>, ...args: any[]) => any)[];
    serverStartupTasks: ((server: Server<T>, ...args: any[]) => any)[];
    constructor(options?: Partial<T>);
    /**
     * Iterate over a list of tasks.
     * @param taskList
     */
    private _iterateOverTasks;
    /**
     * Iterate over a list of tasks without using CLI spinners.
     * @param taskList
     */
    private _iterateOverTasksWithoutAnimation;
    private _start;
    /**
     * Start the server without using console animations.
     */
    private _startWithoutAnimations;
    /**
     * Start the server.
     */
    start(): Promise<this>;
    /**
     * Stop the server.
     */
    stop(): Promise<void>;
    /**
     * Add tasks to run before the server starts.
     * @param taskFunctions
     */
    before(...taskFunctions: Array<(server: Server<T>, ...args: any[]) => any>): this;
    /**
     * Add tasks to run after the server has begun listening.
     * @param taskFunctions
     */
    after(...taskFunctions: Array<(server: Server<T>, ...args: any[]) => any>): this;
}
