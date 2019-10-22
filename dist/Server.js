"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const http = __importStar(require("http"));
const SocketServer_1 = require("./gateway/SocketServer");
const RESTServer_1 = require("./rest/RESTServer");
const git_1 = require("./util/git");
/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
class Server extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = Object.assign({
            debug: "info",
            port: 8080,
        }, options);
        // Create REST and Socket servers
        this.http = http.createServer();
        this.rest = new RESTServer_1.RESTServer(this);
        this.ws = new SocketServer_1.SocketServer(this);
        this.rest
            .on("debug", (msg) => this.emit("debug", msg))
            .on("http", (msg) => this.emit("http", msg));
        this.ws
            .on("debug", (msg) => this.emit("debug", msg))
            .on("ws", (msg) => this.emit("http", msg));
        process.on("exit", () => this.stop()).on("SIGTERM", () => this.stop());
    }
    /**
     * Start the server.
     */
    async start() {
        this.emit("debug", `[server] running on commit "${await git_1.getCurrentHash()}"`);
        this.rest.init();
        this.emit("debug", `[http] listening on port "${this.options.port}".`);
        this.http.listen(this.options.port);
        await this.ws.init();
        this.emit("ready");
    }
    /**
     * Stop the server.
     */
    async stop() {
        this.emit("stop");
        await this.ws.close();
        this.emit("debug", "[http] closing the HTTP server...");
        this.http.close();
        this.emit("exit");
    }
}
exports.Server = Server;
