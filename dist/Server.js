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
const safe_1 = __importDefault(require("colors/safe"));
const http = __importStar(require("http"));
const ora_1 = __importDefault(require("ora"));
const SocketServer_1 = require("./gateway/SocketServer");
const RESTServer_1 = require("./rest/RESTServer");
const git_1 = require("./util/git");
const logging_1 = require("./util/logging");
/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
class Server {
    constructor(options) {
        this.options = Object.assign({
            debug: "info",
            disableWinston: false,
            port: 8080,
        }, options);
        // Create REST and Socket servers
        this.http = http.createServer();
        this.rest = new RESTServer_1.RESTServer(this);
        this.ws = new SocketServer_1.SocketServer(this);
        this.http.on("error", (err) => console.log(`${safe_1.default.magenta("http")} ${safe_1.default.red("error")} ${err}`));
        // process.on("exit", () => this.stop()).on("SIGTERM", () => this.stop());
        this.logger = logging_1.createLoggerWithPrefix();
        this.beforeStartTasks = [];
    }
    /**
     * Start the server.
     */
    async start() {
        logging_1.charLog(`${safe_1.default.yellow("fox-server")} ${safe_1.default.green(await git_1.getCurrentTag())} ${safe_1.default.grey(`on "${await git_1.getCurrentHash()}"`)}`);
        logging_1.charLog(safe_1.default.cyan("Preparing to bark...\n"));
        let spinner = ora_1.default({
            spinner: "dots",
        }).start("Attaching rest hooks...");
        this.rest.init();
        spinner.text = "Starting HTTP server...";
        this.http.listen(this.options.port);
        spinner.text = "Telling the socket server to initialize...";
        await this.ws.init();
        spinner.succeed("Server ready.");
        spinner.start(`${safe_1.default.cyan("Running startup tasks")}`);
        for (let i = 0; i < this.beforeStartTasks.length; i++) {
            const task = this.beforeStartTasks[i];
            spinner.text = `${safe_1.default.cyan("Running startup tasks")} - ${task.name || "anonymous"}`;
            try {
                await task(this);
            }
            catch (err) {
                spinner.stopAndPersist({
                    symbol: safe_1.default.red("error"),
                    text: `Error in task ${i} "${task.name || "anonymous"}".`,
                });
                console.error(err);
                spinner.start(`[${i + 2}/${this.beforeStartTasks.length}] ${task.name ||
                    "anonymous"}`);
            }
        }
        spinner.succeed("Background tasks complete.\n");
        logging_1.charLog(`${safe_1.default.yellow("BARK!!! ^w^")} - Listening on port ${this.options.port}.\n`);
    }
    /**
     * Stop the server.
     */
    async stop() {
        await this.ws.close();
        this.http.close();
    }
    async task(taskFunction) {
        this.beforeStartTasks.push(taskFunction);
    }
}
exports.Server = Server;
