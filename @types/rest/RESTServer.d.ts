/// <reference types="node" />
import { EventEmitter } from "events";
import { default as express, IRouterMatcher } from "express";
import { Server } from "../Server";
export declare interface RESTServer extends EventEmitter {
    server: Server;
    express: express.Application;
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
export declare interface RESTServer extends EventEmitter {
    on(eventName: "debug", listener: (msg: string) => any): this;
    on(eventName: "ready", listener: () => any): this;
    on(eventName: "http", listener: (msg: string) => any): this;
}
/**
 * Class for representing the server that handles HTTP REST client requests.
 */
export declare class RESTServer extends EventEmitter {
    server: Server;
    express: express.Application;
    constructor(server: Server);
    /**
     * Open the server and start listening for requests.
     */
    init(): this;
    /**
     * Create a router to use for the server.
     * @param {String} path - Path to use for the handler
     * @param {Function} routerCreator - Function that creates the router
     */
    withServer(...definitions: [string, (server: Server) => express.Router][] | [string, (server: Server) => express.Router]): void;
}
