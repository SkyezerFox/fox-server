import { IncomingMessage } from "http";
import * as winston from "winston";
import * as WebSocket from "ws";
import { Server } from "../Server";
/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
export declare class SocketServer {
    server: Server;
    ws?: WebSocket.Server;
    logger: winston.Logger;
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
