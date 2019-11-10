import { default as express, IRouterMatcher } from "express";
import * as winston from "winston";
import { Server } from "../Server";
export declare interface RESTServer {
    server: Server<any>;
    express: express.Application;
    logger: winston.Logger;
    checkout: IRouterMatcher<express.Application>;
    connect: IRouterMatcher<express.Application>;
    copy: IRouterMatcher<express.Application>;
    delete: IRouterMatcher<express.Application>;
    get: typeof express.application.get;
    head: IRouterMatcher<express.Application>;
    lock: IRouterMatcher<express.Application>;
    "m-search": IRouterMatcher<express.Application>;
    merge: IRouterMatcher<express.Application>;
    mkactivity: IRouterMatcher<express.Application>;
    mkcol: IRouterMatcher<express.Application>;
    move: IRouterMatcher<express.Application>;
    notify: IRouterMatcher<express.Application>;
    options: IRouterMatcher<express.Application>;
    patch: IRouterMatcher<express.Application>;
    post: IRouterMatcher<express.Application>;
    propfind: IRouterMatcher<express.Application>;
    proppatch: IRouterMatcher<express.Application>;
    purge: IRouterMatcher<express.Application>;
    put: IRouterMatcher<express.Application>;
    rebund: IRouterMatcher<express.Application>;
    report: IRouterMatcher<express.Application>;
    search: IRouterMatcher<express.Application>;
    source: IRouterMatcher<express.Application>;
    subscribe: IRouterMatcher<express.Application>;
    trace: IRouterMatcher<express.Application>;
    unbind: IRouterMatcher<express.Application>;
    unlink: IRouterMatcher<express.Application>;
    unlock: IRouterMatcher<express.Application>;
    unsubscribe: IRouterMatcher<express.Application>;
    use: typeof express.application.use;
}
/**
 * Class for representing the server that handles HTTP REST client requests.
 */
export declare class RESTServer {
    server: Server<any>;
    express: express.Application;
    logger: winston.Logger;
    constructor(server: Server<any>);
    /**
     * Open the server and start listening for requests.
     */
    init(): this;
    /**
     * Utility function for accessing server properties.
     * @param {Function} routerCreator - Function that creates the router
     */
    withServer(...handles: Array<(server: this) => any>): void;
    /**
     * Utility function for easily creating routers with access to the server class.
     * @param {String} path Path the router should hook to
     * @param {Funciton} handle Router handle function
     */
    router(path: string, handle: (server: this) => express.Router): this;
}
