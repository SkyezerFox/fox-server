/// <reference types="node" />
import { IncomingMessage } from "http";
import * as winston from "winston";
import * as WebSocket from "ws";
import { FoxServer } from "../FoxServer";
/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
export declare class SocketServer {
    server: FoxServer<any>;
    ws?: WebSocket.Server;
    logger: winston.Logger;
    connections: Map<string, {
        rq: IncomingMessage;
        s: WebSocket;
    }>;
    connected: boolean;
    constructor(server: FoxServer<any>);
    /**
     * Initialize the socket server and start listening for socket connections.
     */
    init(): void;
    /**
     * Close the socket server and stop listening/close socket connections.
     */
    close(): Promise<void>;
}
