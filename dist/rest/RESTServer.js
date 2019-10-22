"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const errors_1 = require("./errors");
/**
 * Class for representing the server that handles HTTP REST client requests.
 */
class RESTServer extends events_1.EventEmitter {
    constructor(server) {
        super();
        this.server = server;
        this.express = express_1.default();
        // Iterate through HTTP methods and create functions for them.
        http.METHODS.forEach((method) => {
            const requestHandlerFunction = this.express[method.toLowerCase()];
            if (requestHandlerFunction) {
                Object.defineProperty(this, method.toLowerCase(), requestHandlerFunction);
            }
        });
        // Copy the use function to the server class.
        this.use = this.express.use.bind(this.express);
        // Bind requests to the logger, so we can get debug information
        this.use(morgan_1.default(this.server.options.debug === "debug" ? "common" : "dev", {
            stream: {
                write: (info) => {
                    info = info.replace(/(\r\n\t|\n|\r\t)/g, "");
                    this.emit("http", info);
                },
            },
        }));
    }
    /**
     * Open the server and start listening for requests.
     */
    init() {
        this.express.use("*", (req, res) => errors_1.NotFound(res));
        this.server.http = http.createServer(this.express);
        this.emit("debug", `[rest] http hooks attached.`);
        return this;
    }
    /**
     * Create a router to use for the server.
     * @param {String} path - Path to use for the handler
     * @param {Function} routerCreator - Function that creates the router
     */
    withServer(...definitions) {
        if (typeof definitions[0] === "string") {
            definitions = definitions;
            this.use(definitions[0], definitions[1](this.server));
        }
        else {
            definitions = definitions;
            definitions.forEach((def) => this.use(def[0], def[1](this.server)));
        }
    }
}
exports.RESTServer = RESTServer;
