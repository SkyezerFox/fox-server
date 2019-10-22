/// <reference types="node" />
import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import * as WebSocket from "ws";
import { Server } from "../Server";
export declare interface SocketServer extends EventEmitter {
    on(eventName: "debug", listener: (msg: string) => any): this;
    on(eventName: "ready", listener: () => any): this;
    on(eventName: "ws", listener: (msg: string) => any): this;
}
/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
export declare class SocketServer extends EventEmitter {
    server: Server;
    ws?: WebSocket.Server;
    connections: Map<string, {
        rq: IncomingMessage;
        s: WebSocket;
    }>;
    constructor(server: Server);
    /**
     * Initialize the socket server and start listening for socket connections.
     */
    init(): Promise<boolean>;
    /**
     * Close the socket server and stop listening/close socket connections.
     */
    close(): Promise<void>;
}
