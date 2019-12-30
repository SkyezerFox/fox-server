/// <reference types="node" />
import * as http from "http";
import * as winston from "winston";
import { SocketServer } from "./gateway/SocketServer";
import { RESTServer } from "./rest/RESTServer";
/**
 * Options to use for the server during runtime.
 *
 * @typedef FoxServerOptions
 *
 *
 * @property {string} dbUri - The URI to use when connecting to the database
 * @property {"debug"|"verbose"|"info"} debug - Whether to enable debug logging
 * @property {number} port - The port to listen on
 */
export interface FoxServerOptions {
    debug: "debug" | "verbose" | "info";
    disableWinston: boolean;
    disableAnimations: boolean;
    versionChecking: boolean;
    disableSocketServer: boolean;
    disableRESTServer: boolean;
    port: number;
}
/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {FoxServerOptions} options - Options to use when listening
 */
export declare class FoxServer<T extends FoxServerOptions = FoxServerOptions> {
    options: T;
    http: http.Server;
    rest: RESTServer;
    ws: SocketServer;
    logger: winston.Logger;
    beforeStartTasks: ((server: FoxServer<T>, ...args: any[]) => any)[];
    afterStartTasks: ((server: FoxServer<T>, ...args: any[]) => any)[];
    serverStartupTasks: ((server: FoxServer<T>, ...args: any[]) => any)[];
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
    before(...taskFunctions: Array<(server: FoxServer<T>, ...args: any[]) => any>): this;
    /**
     * Add tasks to run after the server has begun listening.
     * @param taskFunctions
     */
    after(...taskFunctions: Array<(server: FoxServer<T>, ...args: any[]) => any>): this;
}
