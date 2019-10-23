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
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const errors_1 = require("./errors");
/**
 * Class for representing the server that handles HTTP REST client requests.
 */
class RESTServer {
    constructor(server) {
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
        this.express.use(morgan_1.default("common", {
            stream: {
                write: (info) => {
                    info = info.replace(/(\r\n\t|\n|\r\t)/g, "");
                    console.log(`${chalk_1.default.cyanBright("http")} ${info}`);
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
        return this;
    }
    /**
     * Utility function for accessing server properties.
     * @param {Function} routerCreator - Function that creates the router
     */
    withServer(...handles) {
        handles.forEach((handle) => handle(this));
    }
    /**
     * Utility function for easily creating routers with access to the server class.
     * @param {String} path Path the router should hook to
     * @param {Funciton} handle Router handle function
     */
    withRouter(path, handle) {
        this.use(path, handle(this));
    }
}
exports.RESTServer = RESTServer;
