"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
class SocketServer {
    constructor(server) {
        this.server = server;
        this.connections = new Map();
    }
    /**
     * Initialize the socket server and start listening for socket connections.
     */
    async init() {
        this.ws = new WebSocket.Server({
            path: "/gateway",
            server: this.server.http,
        });
        this.ws.on("connection", (s, rq) => {
            if (rq.connection.remoteAddress) {
                this.connections.set(rq.connection.remoteAddress, {
                    rq,
                    s: s,
                });
            }
            s.on("close", (c, r) => console.log("ws", `[ws] CLOSE ${rq.connection.remoteAddress ||
                "unknown"} ${c} - ${r}`));
        });
        return new Promise((r, rs) => {
            if (this.ws) {
                this.ws.once("listening", () => {
                    r(true);
                });
            }
            else {
                rs(false);
            }
        });
    }
    /**
     * Close the socket server and stop listening/close socket connections.
     */
    async close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}
exports.SocketServer = SocketServer;
